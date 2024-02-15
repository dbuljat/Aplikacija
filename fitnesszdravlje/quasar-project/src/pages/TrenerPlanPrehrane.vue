<template>
  <q-page padding>
    <div class="text-center q-pb-lg">
      <div class="text-h4 q-pb-md" style="color: #027be3;">Unos Hrane</div>
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

      <q-select
        v-if="selectedDay"
        filled
        v-model="selectedMeal"
        :options="mealOptions"
        label="Odaberite obrok"
        emit-value
        map-options
        class="q-mb-md"
      />
      
      <div v-if="selectedMeal">
        <div v-for="(foodItem, index) in selectedMealFoodItems" :key="index">
          <q-card flat bordered class="q-pa-md q-mb-lg">
            <q-select
              filled
              v-model="foodItem.id"
              :options="foodOptions"
              label="Odaberite hranu"
              emit-value
              map-options
              class="q-mb-md"
              @update:model-value="id => updateSelectedFoodItem(index, id)"
            />
            <q-input
              filled
              v-model="foodItem.description"
              label="Opis hrane"
              type="textarea"
              class="q-mb-md"
              readonly
            />
            <div v-if="foodItem.imageUrl">
              <img :src="foodItem.imageUrl" alt="Hrana" class="q-mt-md" style="max-width: 500px; max-height: 500px;">
            </div>
          </q-card>
        </div>

        <q-btn
          label="Dodaj hranu"
          color="primary"
          @click="addNewFoodItem"
          class="q-mb-md"
        />

        <q-btn
          label="Spremi"
          color="secondary"
          :disabled="selectedMealFoodItems.length === 0 || !isAllFoodItemsValid"
          @click="saveFoodItems"
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
import { collection, getDocs, query, where, doc, getDoc, setDoc } from 'firebase/firestore'; 

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
    const dietPlanId = ref(route.params.dietPlanId);
    const selectedDay = ref(null);
    const selectedMeal = ref(null);
    const selectedMealFoodItems = reactive([]);
    const isLoading = ref(false);
    const error = ref(null);
    const foodOptions = ref([]);
    const dayOptions = ref([
      { label: 'Ponedjeljak', value: 'Ponedjeljak' },
      { label: 'Utorak', value: 'Utorak' },
      { label: 'Srijeda', value: 'Srijeda' },
      { label: 'Četvrtak', value: 'Cetvrtak' },
      { label: 'Petak', value: 'Petak' },
      { label: 'Subota', value: 'Subota' },
      { label: 'Nedjelja', value: 'Nedjelja' },
    ]);
    const mealOptions = ref([
      { label: 'Doručak', value: 'Dorucak' },
      { label: 'Ručak', value: 'Rucak' },
      { label: 'Užina', value: 'Uzina' },
      { label: 'Večera', value: 'Vecera' },
    ]);
    
    

    // dohvaćanje jela iz baze podataka
    const fetchFoodItems = async () => {
      isLoading.value = true;
      try {
        const foodSnapshot = await getDocs(collection(db, "hrana"));
        foodOptions.value = foodSnapshot.docs.map(doc => ({
          label: doc.data().name,
          value: doc.id,
          description: doc.data().description,
          imageUrl: doc.data().imageUrl
        }));
      } catch (err) {
        console.error("Error fetching data:", err);
        error.value = err;
      } finally {
        isLoading.value = false;
      }
    };

    onMounted(() => {
      fetchFoodItems();
    });

    // Ažuriranje hrane kad se odabere iz dropdowna
    const updateSelectedFoodItem = (index, id) => {
      const food = foodOptions.value.find(f => f.value === id);
      if (food) {
        selectedMealFoodItems[index] = {
          id: food.value,
          description: food.description,
          imageUrl: food.imageUrl
        };
      }
    };

    // Dodavanje nove hrane 
    const addNewFoodItem = () => {
      selectedMealFoodItems.push({
        id: null,
        description: '',
        imageUrl: ''
      });
    };

    // Provjera ako je sva hrana valid
    const isAllFoodItemsValid = computed(() => {
      return selectedMealFoodItems.every(foodItem => 
        foodItem.id && foodItem.description && foodItem.imageUrl
      );
    });

// Spremanje hrane u bazu podataka
const saveFoodItems = async () => {
  if (!dietPlanId.value || !selectedDay.value || !selectedMeal.value || selectedMealFoodItems.length === 0) {
    console.error('Missing diet plan ID, selected day, selected meal, or food items data. Cannot save.');
    return;
  }

  try {
    for (const foodItem of selectedMealFoodItems) {
      // Stvaranje nove reference dokumenta za svaku stavku hrane unutar kolekcije 'jela'
      const foodItemDocRef = doc(db, `PlanPrehrane/${dietPlanId.value}/${selectedDay.value}/${selectedMeal.value}/jela`, foodItem.id);

      // Priprema podataka o stavci hrane
      const foodItemData = {
        name: foodOptions.value.find(f => f.value === foodItem.id)?.label || '',
        description: foodItem.description,
        imageUrl: foodItem.imageUrl
      };

      // Postavljanje podataka u novi dokument stavke hrane
      await setDoc(foodItemDocRef, foodItemData);
    }

    console.log('All food items saved successfully for the meal:', selectedMeal.value);

     // Resetiranje stanja nakon spremanja
     selectedDay.value = null;
    selectedMeal.value = null;
    selectedMealFoodItems.splice(0, selectedMealFoodItems.length); // Čisti cijeli niz

    
  } catch (error) {
    console.error('Error saving food items:', error);
  }
};

    return {
      selectedDay,
      selectedMeal,
      selectedMealFoodItems,
      foodOptions,
      dayOptions,
      mealOptions,
      isLoading,
      error,
      updateSelectedFoodItem,
      addNewFoodItem,
      isAllFoodItemsValid,
      saveFoodItems
    };
  }
};
</script>
