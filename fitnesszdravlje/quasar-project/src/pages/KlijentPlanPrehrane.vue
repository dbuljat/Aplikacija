<template>
  <div class="q-pa-md">
    <q-select
      filled
      v-model="selectedDay"
      :options="dayOptions"
      label="Odaberite dan"
      emit-value
      map-options
      class="q-mb-md"
      @input="fetchDietPlan"
    />

    <!-- Ovaj select će se prikazati samo kada selectedDay ima vrijednost. -->
    <q-select
      v-if="selectedDay"
      filled
      v-model="selectedMeal"
      :options="mealOptions"
      label="Odaberite obrok"
      emit-value
      map-options
      class="q-mb-md"
      @input="fetchMeal"
    />

    <q-table
      v-if="meals.length > 0"
      :rows="meals"
      :columns="columns"
      row-key="name"
      class="full-width"
    >
      <template v-slot:body-cell-image="props">
        <q-td :props="props">
          <img v-if="props.row.imageUrl" :src="props.row.imageUrl" alt="Meal image" style="width: 200px; height: 200px;">
          <div v-else>No image available</div>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue';
import { db } from 'boot/firebase';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';


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
    const auth = getAuth();
    const user = auth.currentUser;
    const dietPlanId = ref(null);
    const selectedDay = ref(null);
    const selectedMeal = ref(null);
    const meals = ref([]);

    const dayOptions = ref([
      { label: 'Ponedjeljak', value: 'Ponedjeljak' },
      { label: 'Utorak', value: 'Utorak' },
      { label: 'Srijeda', value: 'Srijeda' },
      { label: 'Četvrtak', value: 'Četvrtak' },
      { label: 'Petak', value: 'Petak' },
      { label: 'Subota', value: 'Subota' },
      { label: 'Nedjelja', value: 'Nedjelja' },
    ])

    const mealOptions = ref([
      { label: 'Doručak', value: 'Dorucak' },
      { label: 'Ručak', value: 'Rucak' },
      { label: 'Užina', value: 'Uzina' },
      { label: 'Večera', value: 'Vecera' },

    ])

    const columns = [
      { name: 'name', label: 'Naziv jela', field: 'name', align:'left', sortable : true},
      { name: 'description', label: 'Opis jela', field: 'description', align: 'left', sortable: true},
      { name: 'image', label: 'Slika', field: 'image', align: 'center', sortable: false},

    ]
 // metoda za traženje ID klijenta na temelju emaila
    const getClientIdInTrainerSubcollection = async ( email) => {
      const trainersRef = collection(db, 'Treneri');
      const querySnapshot = await getDocs(trainersRef);
      let clientIdInTrainerSubcollection = '';

      for(const trainerDoc of querySnapshot.docs){
        const clientsRef = collection(db, 'Treneri', trainerDoc.id, 'Clients');
        const clientsSnapshot = await getDocs(clientsRef);
        
        clientsSnapshot.forEach((clientDoc) => {
          if(clientDoc.data().email === email) {
            clientIdInTrainerSubcollection = clientDoc.id;
          }
        });
        if (clientIdInTrainerSubcollection)
        {
          break;
        }
      }
      
      if(!clientIdInTrainerSubcollection) {
        throw new Error(`No client found in the Clients subcollection with the email: ${email}`);
  
      }
      return clientIdInTrainerSubcollection;
    };
 // Nakon dohvaćanja ID klijenta, metoda dohvaća ID plana prehrane koji je povezan s tim klijentom
    const fetchDietPlanId = async () => {
      const clientId = await getClientIdInTrainerSubcollection(user.email);
      const dietPlanQuery = query(collection(db, "PlanPrehrane"), where("clientId", "==", clientId));
      const dietPlanSnapshot= await getDocs(dietPlanQuery);
      if(!dietPlanSnapshot.empty){
        dietPlanId.value = dietPlanSnapshot.docs[0].id;
      }
    }
    // metoda koja dohvaća obroke iz baze za odabrani dan i obrok u planu prehrane
    const fetchMeals = async () => {
  console.log('Selected day:', selectedDay.value, 'Selected meal:', selectedMeal.value, 'Diet plan ID:', dietPlanId.value);
  if (selectedDay.value && selectedMeal.value && dietPlanId.value) {
    try {
      // Referenca na podkolekciju 'jela' unutar određenog obroka za odabrani dan
      const mealsRef = collection(db, `PlanPrehrane/${dietPlanId.value}/${selectedDay.value}/${selectedMeal.value}/jela`);

      // Dohvaćanje svih dokumenata unutar te podkolekcije
      const mealsSnapshot = await getDocs(mealsRef);
      meals.value = mealsSnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id, 
        imageUrl: doc.data().imageUrl || 'default-image-url' // Podrazumijevana slika ako ne postoji
      }));

      console.log('Meals fetched:', meals.value);
    } catch (err) {
      console.error("Error fetching meals:", err);
    }
  }
};

watch([selectedDay, selectedMeal], () => {
  if (dietPlanId.value) {
    fetchMeals();
  }
});


// Watch za promjene u selectedDay ili selectedMeal
watch([selectedDay, selectedMeal], () => {
  if (dietPlanId.value) {
    fetchMeals();
  }
});

watch([selectedDay, selectedMeal], () => {
  if (dietPlanId.value) {
    fetchMeals();
  }
});

onMounted(async () => {
  await fetchDietPlanId();
});

    
    onMounted(async () => {
      await fetchDietPlanId();
     
    });

    return {
      selectedDay,
      selectedMeal,
      meals,
      dayOptions,
      mealOptions,
      columns
    };
  }
}

</script>
