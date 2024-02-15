<template>
    <q-page class="row items-start q-pa-md justify-center">
      <div class="form-container col-12 col-md-6 q-pa-md q-gutter-sm" style="border-radius: 10px; background: #fff; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <div class="form-header text-h6 text-center" style="color: #027be3;">Unos Programa Vježbi</div>
       
        <q-form class="q-gutter-md" @submit.prevent="saveProgramAndContinue">
          <q-input filled v-model="program.name" label="Naziv programa" class="q-mb-md" />
          <q-input filled v-model="program.description" label="Opis programa" type="textarea" class="q-mb-md" />
     
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
   
      const clientId = route.params.id; // ID klijenta preuzet iz rute
      const program = ref({
        name: '',
        description: ''
      });
      const canProceed = computed(() => program.value.name.trim() !== '' && program.value.description.trim() !== '');
   // metoda za spremanje programa vježbi i navigacija na stranicu TrenerProgramVjezbi
      const saveProgramAndContinue = async () => {
        if (!program.value.name || !program.value.description) {
          console.error('All fields must be filled out to continue.');
          return;
        }
        try {
          const docRef = await addDoc(collection(db, 'programi'), {
            name: program.value.name,
            description: program.value.description,
            trainerId: trainerId.value,
            clientId: clientId
          });
          console.log('Program saved successfully with ID:', docRef.id);
          router.push({ name: 'TrenerProgramVjezbi', params: { programId: docRef.id, clientId: clientId } });
        } catch (error) {
          console.error('Error saving program:', error);
        }
      };
   
      return {
        program,
        saveProgramAndContinue,
        canProceed
      };
    }
  };
  </script>