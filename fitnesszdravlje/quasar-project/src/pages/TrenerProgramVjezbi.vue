<template>
    <q-page padding>
      <div class="text-center q-pb-lg">
        <div class="text-h4 q-pb-md" style="color: #027be3;">Unos Vježbi</div>
        <div style="height: 4px; width: 100px; background-color: #027be3; margin: 0 auto;"></div>
      </div>
   
      <div class="q-pa-md">
        <q-select
          filled
          v-model="selectedDay"
          :options="dayOptions"
          label="Odaberite dan"
          emit-value
          map-options
          class="q-mb-md"
        />
       
        <div v-if="selectedDay">
          <div v-for="(exercise, index) in selectedDayExercises" :key="index">
            <q-card flat bordered class="q-pa-md q-mb-lg"> <!-- Dodana veća margina na dno -->
              <q-select
                filled
                v-model="exercise.id"
                :options="exercisesOptions"
                label="Odaberite vježbu"
                emit-value
                map-options
                class="q-mb-md"
                @update:model-value="id => updateSelectedExercise(index, id)"
              />
              <q-input
    filled
    v-model="exercise.description"
    label="Opis vježbe"
    type="textarea"
    class="q-mb-md"
  />
              <div v-if="exercise.imageUrl">
                <img :src="exercise.imageUrl" alt="Vježba" class="q-mt-md" style="max-width: 500px; max-height: 500px;">
              </div>
            </q-card>
          </div>
   
          <div class="q-mt-lg"> <!-- Dodana veća margina na vrh gumba 'Dodaj vježbu' -->
            <q-btn
              label="Dodaj vježbu"
              color="primary"
              @click="addNewExercise"
              class="q-mb-md"
            />
          </div>
   
          <q-btn
            label="Spremi"
            color="secondary"
            :disabled="!isAllExercisesValid"
            @click="saveExercises"
            class="full-width"
          />
        </div>
      </div>
    </q-page>
  </template>
   
   
  <script>
  import { ref, reactive, computed, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { db } from 'boot/firebase';
  import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';
   
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
      const clientId = ref(route.params.clientId);
      const programId = ref(route.params.programId);
      const selectedDay = ref(null);
      const selectedDayExercises = reactive([]);
      const exercisesOptions = ref([]);
      const dayOptions = ref([
        { label: 'Ponedjeljak', value: 'Ponedjeljak' },
        { label: 'Utorak', value: 'Utorak' },
        { label: 'Srijeda', value: 'Srijeda' },
        { label: 'Četvrtak', value: 'Cetvrtak' },
        { label: 'Petak', value: 'Petak' },
        { label: 'Subota', value: 'Subota' },
        { label: 'Nedjelja', value: 'Nedjelja' },
      ]);
      const clientPrograms = ref([]);
      const isLoading = ref(false);
      const error = ref(null);
   
    // učitava dostupne vježbe iz baze i sprema ih u exercisesOptions u dropdown
      const fetchExercises = async () => {
        isLoading.value = true;
        try {
          const exercisesSnapshot = await getDocs(collection(db, "vjezbe"));
          exercisesOptions.value = exercisesSnapshot.docs.map(doc => ({
            label: doc.data().name,
            value: doc.id,
            description: doc.data().description,
            imageUrl: doc.data().imageUrl
          }));
   
         
          if (clientId.value) {
            const programsQuery = query(
              collection(db, "programi"),
              where("clientId", "==", clientId.value)
            );
            const programsSnapshot = await getDocs(programsQuery);
            clientPrograms.value = programsSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
          }
        } catch (err) {
          console.error("Error fetching data:", err);
          error.value = err;
        } finally {
          isLoading.value = false;
        }
      };
   
      onMounted(() => {
    console.log('Route parameters:', route.params);
    fetchExercises();
  });
   // služi za ažuriranje input polja s onom vježbom koju je korisnik odabrao u dropdownu
      const updateSelectedExercise = (index, id) => {
        const exercise = exercisesOptions.value.find(ex => ex.value === id);
        if (exercise) {
          selectedDayExercises[index] = {
            id: exercise.value,
            description: exercise.description,
            imageUrl: exercise.imageUrl
          };
        }
      };
      console.log(route.params);
      // za dodavanje nove vježbe 
      const addNewExercise = () => {
        selectedDayExercises.push({
          id: null,
          description: '',
          imageUrl: ''
        });
      };
   
      const isAllExercisesValid = computed(() => {
   
    return selectedDay.value && selectedDayExercises.length > 0 &&
      selectedDayExercises.every(exercise =>
        exercise.id && exercise.description.trim() !== '' && exercise.imageUrl
      );
  });
      const fetchProgramIdForClient = async (clientId) => {
    try {
      const programsQuery = query(
        collection(db, "programi"),
        where("clientId", "==", clientId)
      );
      const programsSnapshot = await getDocs(programsQuery);
   
     
      if (!programsSnapshot.empty) {
        const programDocument = programsSnapshot.docs[0];
        return programDocument.id;
      } else {
        console.error('No program found for the client ID:', clientId);
        return null; // Nema programa za klijenta
      }
    } catch (error) {
      console.error('Error fetching program ID for client:', clientId, error);
      return null; // Vraćanje null u slučaju greške
    }
  };
   // sprema vježbe u bazu podataka 
  const saveExercises = async () => {
    console.log('Client ID:', clientId.value);
    console.log('Selected Day:', selectedDay.value);
    console.log('Selected Day Exercises:', selectedDayExercises);
    if (!clientId.value || !selectedDay.value || selectedDayExercises.length === 0) {
      console.error('Missing client ID, selected day, or exercises data. Cannot save.');
      return;
    }
   
    try {
      if (!programId.value) {
        console.error('No program ID provided. Cannot save exercises.');
        return;
      }
   
      const dayCollectionRef = collection(db, `programi/${programId.value}/${selectedDay.value}`);
   
      for (const exercise of selectedDayExercises) {
        const exerciseData = {
          name: exercisesOptions.value.find(ex => ex.value === exercise.id).label,
          description: exercise.description,
          imageUrl: exercise.imageUrl
        };
   
        await addDoc(dayCollectionRef, exerciseData);
      }
   
      console.log('Exercises saved successfully for the day:', selectedDay.value);
   
      // Resetiranje niza vježbi
      selectedDayExercises.splice(0, selectedDayExercises.length);
    } catch (error) {
      console.error('Error saving exercises:', error);
    }
  };
   
      return {
        selectedDay,
        selectedDayExercises,
        exercisesOptions,
        dayOptions,
        clientPrograms,
        isLoading,
        error,
        updateSelectedExercise,
        addNewExercise,
        isAllExercisesValid,
        saveExercises
      };
    }
  };
  </script>