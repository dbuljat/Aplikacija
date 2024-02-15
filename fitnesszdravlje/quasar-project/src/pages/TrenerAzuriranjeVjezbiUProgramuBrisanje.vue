<template>
    <q-page class="q-pa-md">
        <div class="text-center q-pb-lg">
        <h5>Ažuriranje postojećeg programa vježbi</h5>
      </div>
      <!-- Selektor dana -->
      <div class="q-mb-md">
        <q-select
          filled
          v-model="selectedDay"
          :options="dayOptions"
          label="Odaberite dan u tjednu"
          emit-value
          map-options
        />
      </div>
 
      <!-- Lista vježbi za odabrani dan -->
      <div v-if="selectedDay">
        <div v-for="(exercise, index) in exercises" :key="index" class="q-mb-md">
          <q-card>
            <q-card-section>
              <div class="text-h6">{{ exercise.name }}</div>
              <div>{{ exercise.description }}</div>
              <q-img :src="exercise.imageUrl" style="max-width: 500px; max-height: 500px;" />
            </q-card-section>
 
            <q-card-actions align="right">
               
              <q-btn label="Ažuriraj" color="primary" @click="openUpdateExerciseModal(exercise)" />
              <q-btn label="Obriši" color="negative" @click="deleteExercise(exercise.id)" />
            </q-card-actions>
          </q-card>
         
        </div>
        <div class="text-right q-mb-md">
  <q-btn label="Dodaj novu vježbu" color="positive" @click="addNewExercise" />
</div>
      </div>
 
      <!-- Dijaloški prozor za ažuriranje vježbi -->
      <q-dialog v-model="showUpdateModal" full-width max-width="400px">
  <q-card>
    <q-card-section>
      <div class="text-h6" style="color: #027be3;">Ažuriranje vježbe</div>
      <q-form @submit.prevent="saveUpdatedExercise">
        <q-select
          filled
          v-model="selectedExerciseId"
          :options="exercisesOptions"
          label="Odaberite vježbu"
          emit-value
          map-options
          @update:model-value="handleExerciseSelection"
          class="q-mb-md"
        />
        <q-input filled v-if="selectedExercise.description" v-model="selectedExercise.description" label="Opis vježbe" type="textarea" class="q-mb-md" />
        <div class="text-center q-my-md">
          <q-img v-if="selectedExercise.imageUrl" :src="selectedExercise.imageUrl" style="max-width: 200px; max-height: 200px;" />
        </div>
        <q-btn label="Spremi promjene" type="submit" color="primary" class="full-width" />
      </q-form>
    </q-card-section>
  </q-card>
</q-dialog>
    </q-page>
  </template>
 
  <script>
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { db } from 'boot/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
 
 
export default {
  beforeMount() {
    const isReloaded = localStorage.getItem('isReloaded');
    if (!isReloaded) {
      localStorage.setItem('isReloaded', 'true');
      location.reload();
    } else {
      localStorage.removeItem('isReloaded');
    }
  },
  setup() {
    const route = useRoute();
    const programId = route.params.programId;
    const selectedDay = ref(null);
    const exercises = ref([]);
    const exercisesOptions = ref([]);
    const selectedExerciseId = ref('');
    const selectedExercise = ref({});
    const showUpdateModal = ref(false);
    const originalExerciseId = ref('');
    const dayOptions = [
      { label: 'Ponedjeljak', value: 'Ponedjeljak' },
      { label: 'Utorak', value: 'Utorak' },
      { label: 'Srijeda', value: 'Srijeda' },
      { label: 'Četvrtak', value: 'Četvrtak' },
      { label: 'Petak', value: 'Petak' },
      { label: 'Subota', value: 'Subota' },
      { label: 'Nedjelja', value: 'Nedjelja' },
    ];
 
    onMounted(async () => {
      await loadExercisesOptions();
    });
 // učitava sve dostupne vježbe za odabir
    const loadExercisesOptions = async () => {
      try {
        const snapshot = await getDocs(collection(db, "vjezbe"));
        exercisesOptions.value = snapshot.docs.map(doc => ({
          label: doc.data().name,
          value: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error("Error loading exercises options:", error);
      }
    };
   // prati promjene u odabranom danu i dohvaća vježbe za taj dan
    watch(selectedDay, async (newDay) => {
      if (newDay) {
        await fetchExercisesForDay(newDay);
      }
    });
 // dohvaća vježbe iz baze podataka za odabrani dan
    const fetchExercisesForDay = async (day) => {
      try {
        const exercisesRef = collection(db, `programi/${programId}/${day}`);
        const snapshot = await getDocs(exercisesRef);
        exercises.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        console.error("Error fetching exercises:", error);
      }
    };
 // otvara modalni prozor za ažuriranje odabrane vježbe i prikazuje podatke o toj vježbi
    const openUpdateExerciseModal = (exercise) => {
  originalExerciseId.value = exercise.id;
  selectedExercise.value = { ...exercise };
  showUpdateModal.value = true;
};
 //  omogućuje odabir i prikaz detalja druge vježbe unutar tog istog modalnog prozora, omogućavajući korisniku da lako promijeni odabir vježbe tijekom procesa ažuriranja.
const handleExerciseSelection = (id) => {
  const exercise = exercisesOptions.value.find(e => e.value === id);
  if (exercise) {
    selectedExerciseId.value = id;
    selectedExercise.value = { ...exercise };
  } else {
    selectedExercise.value = {};
  }
};
 // sprema ažurirane podatke o vježbi u bazu podataka
const saveUpdatedExercise = async () => {
  if (!originalExerciseId.value) return;
  try {
    const exerciseRef = doc(db, `programi/${programId}/${selectedDay.value}/${originalExerciseId.value}`);
    await updateDoc(exerciseRef, {
      name: selectedExercise.value.name,
      description: selectedExercise.value.description,
      imageUrl: selectedExercise.value.imageUrl
    });
    console.log("Exercise updated successfully");
    showUpdateModal.value = false;
    await fetchExercisesForDay(selectedDay.value);
  } catch (error) {
    console.error("Error updating exercise:", error);
  }
};  
// briše odabranu vježbu
    const deleteExercise = async (exerciseId) => {
      try {
        const exerciseRef = doc(db, `programi/${programId}/${selectedDay.value}/${exerciseId}`);
        await deleteDoc(exerciseRef);
        console.log("Exercise deleted successfully");
        await fetchExercisesForDay(selectedDay.value);
      } catch (error) {
        console.error("Error deleting exercise:", error);
      }
    };
 // dodaje novu vježbu u program
    const addNewExercise = async () => {
  if (!selectedDay.value) return;
  try {
    const dayCollectionRef = collection(db, `programi/${programId}/${selectedDay.value}`);
    const newExerciseData = {
      name: "Nova vježba",
      description: "Opis nove vježbe",
      imageUrl: "URL slike nove vježbe"
    };
    await addDoc(dayCollectionRef, newExerciseData);
    console.log("New exercise added successfully");
    // Resetiranje odabranih vježbi kako bi se prikazala prazna polja
    selectedExerciseId.value = '';
    selectedExercise.value = {};
    showUpdateModal.value = false;
    await fetchExercisesForDay(selectedDay.value);
  } catch (error) {
    console.error("Error adding new exercise:", error);
  }
};
    return {
      selectedDay,
      exercises,
      dayOptions,
      exercisesOptions,
      selectedExercise,
      showUpdateModal,
      openUpdateExerciseModal,
      handleExerciseSelection,
      saveUpdatedExercise,
      deleteExercise,
      addNewExercise
    };
  }
};
</script>