<template>
  <q-page class="row items-start q-pa-md justify-center">
    <div class="form-container col-12 col-md-6 q-pa-md q-gutter-sm" style="border-radius: 10px; background: #fff; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
      <div class="form-header text-h6 text-center" style="color: #027be3;">Unos plana prehrane</div>
      
      <q-form class="q-gutter-md" @submit.prevent="saveDietPlanAndContinue">
        <q-input filled v-model="dietPlan.name" label="Naziv plana" class="q-mb-md" />
        <q-input filled v-model="dietPlan.description" label="Opis plana" type="textarea" class="q-mb-md" />
        
        <div class="text-center q-pt-md">
          <q-btn label="Dalje" type="submit" color="primary" class="full-width" :disabled="!canProceed" />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { db } from 'boot/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

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
    const router = useRouter();
    const auth = getAuth();
    const user = ref(auth.currentUser);
    const trainerId = computed(() => user.value?.uid);

    onAuthStateChanged(auth, (currentUser) => {
      user.value = currentUser;
      if (!user.value) {
        router.push('/login');
      }
    });

    const clientId = route.params.id;
    const dietPlan = ref({
      name: '',
      description: ''
    });
    const canProceed = ref(true);
  // metoda za spremanje plana prehrane i navigacija na stranicu TrenerPlanPrehrane
    const saveDietPlanAndContinue = async () => {
      if (!dietPlan.value.name || !dietPlan.value.description) {
        console.error('All fields must be filled out to continue.');
        return;
      }
      try {
        const docRef = await addDoc(collection(db, 'PlanPrehrane'), {
          name: dietPlan.value.name,
          description: dietPlan.value.description,
          trainerId: trainerId.value,
          clientId: clientId
        });
        console.log('Diet plan saved successfully with ID:', docRef.id);
        router.push({ name: 'TrenerPlanPrehrane', params: { dietPlanId: docRef.id, clientId: clientId } });
        
      } catch (error) {
        console.error('Error saving diet plan:', error);
      }
    };

    return {
      dietPlan,
      saveDietPlanAndContinue,
      canProceed
    };
  }
};
</script>
