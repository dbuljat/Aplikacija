<template>
    <q-page class="row items-start q-pa-md justify-center">
      <div class="form-container col-12 col-md-6 q-pa-md q-gutter-sm"
           style="border-radius: 10px; background: #fff; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <div class="form-header text-h6 text-center" style="color: #027be3;">Ažuriranje Plana Prehrane</div>
  
        <q-form class="q-gutter-md">
          <q-select
            filled
            v-model="selectedDietPlanId"
            :options="dietPlansOptions"
            label="Odaberite plan prehrane"
            emit-value
            map-options
            class="q-mb-md"
            @update:model-value="fetchDietPlanDetails"
          />
  
          <q-input filled v-model="selectedDietPlan.name" label="Naziv plana prehrane" class="q-mb-md" />
          <q-input filled v-model="selectedDietPlan.description" label="Opis plana prehrane" type="textarea"
                   class="q-mb-md" />
  
          <div class="text-center q-pt-md">
            <q-btn label="Ažuriraj" color="primary" class="q-mr-md" @click="updateDietPlan" />
            <q-btn label="Obriši" color="negative" @click="deleteDietPlan" />
          </div>
        </q-form>
      </div>
    </q-page>
  </template>
  
  <script>
import { ref, onMounted } from 'vue';
import { db } from 'boot/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { useRoute, useRouter } from 'vue-router';

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
    const dietPlansOptions = ref([]);
    const selectedDietPlanId = ref('');
    const selectedDietPlan = ref({ name: '', description: '' });
    const route = useRoute();
    const router = useRouter();

    onMounted(async () => {
      await fetchDietPlans();
    });
// dohvaća sve dostupne planove prehrane i popunjava dropdown izbornik
    const fetchDietPlans = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "PlanPrehrane"));
        dietPlansOptions.value = querySnapshot.docs.map(doc => ({ label: doc.data().name, value: doc.id }));
      } catch (error) {
        console.error("Error fetching diet plans:", error);
      }
    };
// metoda koja kada korisnik odabere plan prehrane, dohvaća i prikazuje detalje odabranog plana
    const fetchDietPlanDetails = async (dietPlanId) => {
      const docRef = doc(db, "PlanPrehrane", dietPlanId);
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          selectedDietPlan.value = {
            name: docSnap.data().name,
            description: docSnap.data().description
          };
        } else {
          console.log("No such document!");
          selectedDietPlan.value = { name: '', description: ''};
        }
      } catch (error) {
        console.error("Error fetching diet plan details:", error);
      }
    };
// metoda koja sprema promjene na odabranom planu prehrane i šalje korisnika na stranicu za ažuriranje hrane u planu
    const updateDietPlan = async () => {
      
      if(!selectedDietPlan.value.name || !selectedDietPlan.value.description)
      {
        console.error('All fields must be filled out to continue');
        return;
      }

      try 
      {
        const docRef = doc(db, "PlanPrehrane", selectedDietPlanId.value);
        await updateDoc(docRef, {
            name: selectedDietPlan.value.name,
            description: selectedDietPlan.value.description
        });
        console.log("Plan updated successfulyy");

        const clientId = route.params.id;
        if(!clientId)
        {
            console.error('No clientId provided');
            return;
        }
        router.push({
            name: 'TrenerAzuriranjeHraneUPlanu',
            params: {
                clientId: clientId,
                dietPlanId: selectedDietPlanId.value
            }
        });
      }
      catch (error)
      {
        console.error("Error updating plan:", error);
      }
    };

// metoda za brisanje odabranog plana prerhane, uključujući sve njegove podkolekcije za svaki dan u tjednu
    const deleteDietPlan = async () => {
      if(!selectedDietPlanId.value) {
        console.error('No plan ID provided. Cannot delete plan.');
        return;
      }
      try {
        const planRef = doc(db, 'PlanPrehrane', selectedDietPlanId.value);
        const days = ['Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak', 'Subota', 'Nedjelja'];
        for (const day of days) {
            const dayCollectionRef = collection(planRef, day);
            const foodSnapshot = await getDocs(dayCollectionRef);
            for(const foodDoc of foodSnapshot.docs) {
                await deleteDoc(doc(dayCollectionRef, foodDoc.id));
            }
        }
         // Pravilno resetiranje odabranih podataka
    selectedDietPlanId.value = '';
    selectedDietPlan.value = { name: '', description: '' };  

    // Osvježavanje liste planova prehrane
    await fetchDietPlans();
        await deleteDoc(planRef);
        console.log('plan and all its subcollections deleted successfully');

      }
      catch (error){
        console.error('Error deleting plan and its subcollections: ', error);
      }
    };

    return {
      dietPlansOptions,
      selectedDietPlanId,
      selectedDietPlan,
      fetchDietPlanDetails,
      updateDietPlan,
      deleteDietPlan
    };
  }
};
</script>