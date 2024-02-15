<template>
    <q-page class="q-pa-md">
      <!-- Naslov -->
      <div class="text-center q-pb-lg">
        <h5>Ažuriranje postojećeg plana prehrane</h5>
      </div>
  
      <!-- Dropdown za odabir dana -->
      <div class="q-mb-md">
        <q-select filled v-model="selectedDay" :options="dayOptions" label="Odaberite dan u tjednu" emit-value map-options />
      </div>
  
      <!-- Dropdown za odabir obroka -->
      <div v-if="selectedDay" class="q-mb-md">
        <q-select filled v-model="selectedMeal" :options="mealOptions" label="Odaberite obrok" emit-value map-options />
      </div>
  
      <!-- Lista jela za odabrani obrok -->
      <div v-if="selectedMeal">
        <div v-for="(meal, index) in meals" :key="index" class="q-mb-md">
          <q-card>
            <q-card-section>
              <div class="text-h6">{{ meal.name }}</div>
              <div>{{ meal.description }}</div>
              <q-img :src="meal.imageUrl" style="max-width: 200px; max-height: 200px;" />
            </q-card-section>
            <q-card-actions align="right">
              <q-btn label="Ažuriraj" color="primary" @click="openUpdateMealModal(meal)" />
              <q-btn label="Obriši" color="negative" @click="deleteMeal(meal.id)" />
            </q-card-actions>
          </q-card>
        </div>
        <div class="text-right q-mb-md">
  <q-btn label="Dodaj novo jelo" color="positive" @click="addNewMeal" />
</div>
      </div>
  
      <!-- Dijaloški prozor za ažuriranje jela -->
      <q-dialog v-model="showUpdateModal" full-width max-width="400px">
        <q-card>
          <q-card-section>
            <div class="text-h6" style="color: #027be3;">Ažuriranje jela</div>
            <q-form @submit.prevent="saveUpdatedMeal">
              <q-select filled v-model="selectedMealId" :options="mealsOptions" label="Odaberite jelo" emit-value map-options @update:model-value="handleMealSelection" class="q-mb-md" />
              <q-input filled v-if="updatedMeal.description" v-model="updatedMeal.description" label="Opis jela" type="textarea" class="q-mb-md" />
              <q-img v-if="updatedMeal.imageUrl" :src="updatedMeal.imageUrl" style="max-width: 200px; max-height: 200px;" />
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
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc, getDoc } from 'firebase/firestore';

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
    const dietPlanId = route.params.dietPlanId;
    const selectedDay = ref(null);
    const selectedMeal = ref(null);
    const meals = ref([]);
    const mealsOptions = ref([]);
    const selectedMealId = ref('');
    const updatedMeal = ref({ name: '', description: '', imageUrl: '' });
    const showUpdateModal = ref(false);
    const originalMealId = ref('');

    // Definicija opcija za dropdown menije
    const dayOptions = [
      { label: 'Ponedjeljak', value: 'Ponedjeljak' },
      { label: 'Utorak', value: 'Utorak' },
      { label: 'Srijeda', value: 'Srijeda' },
      { label: 'Četvrtak', value: 'Cetvrtak' },
      { label: 'Petak', value: 'Petak' },
      { label: 'Subota', value: 'Subota' },
      { label: 'Nedjelja', value: 'Nedjelja' },
    ];
    const mealOptions= [
      { label: 'Doručak', value: 'Dorucak' },
      { label: 'Ručak', value: 'Rucak' },
      { label: 'Užina', value: 'Uzina' },
      { label: 'Večera', value: 'Vecera' },
    ];


    // Učitavanje opcija za jela
    onMounted(async () => {
  await loadMealsOptions();
});

    // Pratimo promjene u odabiru dana i obroka
    watch([selectedDay, selectedMeal], async () => {
      if (selectedDay.value && selectedMeal.value) {
        await fetchMealsForSelectedDayAndMeal();
      }
    });

    // Dohvaćanje jela za odabrani dan i obrok
    const fetchMealsForSelectedDayAndMeal = async () => {
      try {
        const mealsRef = collection(db, `PlanPrehrane/${dietPlanId}/${selectedDay.value}/${selectedMeal.value}/jela`);
        const snapshot = await getDocs(mealsRef);
        meals.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        console.error("Error fetching meals:", error);
      }
    };
// metoda koja učitava sve dostupne opcije jela za odabir u dijaloškom prozoru
    const loadMealsOptions = async () => {
        try{
      const snapshot = await getDocs(collection(db, "hrana"));
      mealsOptions.value = snapshot.docs.map(doc => ({
        label: doc.data().name,
        value: doc.id,
        ...doc.data()
    }));
      } catch (error) {
        console.error("Error loading exercises options:", error);
      
    };
};
// otvara modal za ažuriranje jela i postavlja trentne vrijednosti za uređivanje
const openUpdateMealModal = (meal) => {
    console.log("Otvaram modal za ažuriranje jela s ID:", meal.id);
  originalMealId.value = meal.id;
  updatedMeal.value = { ...meal };
  showUpdateModal.value = true;
};
// postavlja ažurirano na temelju odabira iz dropdown izbornika
const handleMealSelection = async (id) => {
  const mealDoc = await getDoc(doc(db, "hrana", id));
  if (mealDoc.exists()) {
    updatedMeal.value = {
      name: mealDoc.data().name,
      description: mealDoc.data().description,
      imageUrl: mealDoc.data().imageUrl
    };
   
  }
};
// metoda za spremanje promjena na ažurirano jelo u bazu podataka
const saveUpdatedMeal = async () => {
  if (!originalMealId.value) return;
  console.log("Spremam ažuriranje za jelo s ID:", originalMealId.value);
  try {
    const mealRef = doc(db, `PlanPrehrane/${dietPlanId}/${selectedDay.value}/${selectedMeal.value}/jela`, originalMealId.value);
    await updateDoc(mealRef, {
      name: updatedMeal.value.name,
      description: updatedMeal.value.description,
      imageUrl: updatedMeal.value.imageUrl
    });

    showUpdateModal.value = false;
    await fetchMealsForSelectedDayAndMeal(selectedDay.value, selectedMeal.value);
  } catch (error) {
    console.error("Error updating meal:", error);
  }
};

// metoda koja briše odabrano jelo iz baze podataka
const deleteMeal = async (mealId) => {
  try {
    const mealRef = doc(db, `PlanPrehrane/${dietPlanId}/${selectedDay.value}/${selectedMeal.value}/jela`, mealId);
    await deleteDoc(mealRef);
    console.log("Meal deleted successfully");
    await fetchMealsForSelectedDayAndMeal();
  } catch (error) {
    console.error("Error deleting meal:", error);
  }
};
// dodaje novo jelo u plan prehrane
const addNewMeal = async () => {
  if (!selectedDay.value || !selectedMeal.value) return;
  try {
    const mealCollectionRef = collection(db, `PlanPrehrane/${dietPlanId}/${selectedDay.value}/${selectedMeal.value}/jela`);
    const newMealData = {
      name: "Novo jelo",
      description: "Opis novog jela",
      imageUrl: "URL slike novog jela"
    };
    await addDoc(mealCollectionRef, newMealData);
    console.log("New meal added successfully");
    // Resetiranje odabranih jela kako bi se prikazala prazna polja
    selectedMealId.value = '';
    updatedMeal.value = { name: '', description: '', imageUrl: '' };
    showUpdateModal.value = false; 
    await fetchMealsForSelectedDayAndMeal();
  } catch (error) {
    console.error("Error adding new meal:", error);
  }
};
    return {
      selectedDay,
      selectedMeal,
      meals,
      mealsOptions,
      updatedMeal,
      selectedMealId,
      showUpdateModal,
      originalMealId,
      dayOptions,
      mealOptions,
      openUpdateMealModal,
      handleMealSelection,
      saveUpdatedMeal,
      loadMealsOptions,
      deleteMeal,
      addNewMeal
    };
}
  };
</script>
