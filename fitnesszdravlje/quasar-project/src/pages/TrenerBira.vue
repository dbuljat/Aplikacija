<template>
  <q-header elevated class="vrh">
    <q-toolbar>
      <q-item clickable v-ripple class="menunavrhu">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-item-section avatar>
          <q-icon class="ikonanavrhu">
            <img src="https://i.pinimg.com/originals/0c/3b/3a/0c3b3adb1a7530892e55ef36d3be6cb8.png">
          </q-icon>
        </q-item-section>
        <q-item-section>
          <h2>{{ clientName }}</h2>
        </q-item-section>
      </q-item>
    </q-toolbar>
  </q-header>

  <div style="display:flex;">
    <div class="card-container" @click="navigateToTrenerPV">
      <q-card class="my-card" style="max-width: 3000px; margin: 50px 0 0 50px; background-color: #f2f2f2;">
        <q-img src="https://img.freepik.com/free-vector/cute-man-lifting-barbell-gym-cartoon-vector-icon-illustration-people-sport-icon-concept-isolated_138676-6223.jpg?w=2000" style="max-height: 3000px;">
          <div class="absolute-bottom text-h6 center">
            Program vježbi
          </div>
        </q-img>
        <q-card-section style="font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 50px;">
          Ovdje dodajte prilagođeni plan vježbanja za klijenta
        </q-card-section>
      </q-card>
    </div>

    <div class="card-container" @click="navigateToTrenerAzuriranjePVBrisanje">
      <q-card class="my-card" style="max-width: 350px; margin: 50px 0 0 50px; background-color: #f2f2f2;">
        <q-img src="https://cdn.pixabay.com/photo/2017/06/06/00/33/edit-icon-2375785_1280.png" style="max-height: 3000px;">
          <div class="absolute-bottom text-h6 center">
            Ažuriranje programa vježbi
          </div>
        </q-img>
        <q-card-section style="font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 50px;">
          Ovdje možete ažurirati/obrisati Vaš program vježbi!
        </q-card-section>
      </q-card>
    </div>

    <div class="card-container" @click="navigateToTrenerPlanPrehrane">
      <div class="card-container">
        <q-card class="my-card" style="max-width: 3000px; margin: 50px 0 0 50px; background-color: #f2f2f2;">
          <q-img src="https://cdn-icons-png.flaticon.com/512/6774/6774898.png" style="max-height: 3000px;">
            <div class="absolute-bottom text-h6 center">
              Plan prehrane
            </div>
          </q-img>
          <q-card-section style="font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 50px;">
            Ovdje dodajte prilagođeni plan prehrane za klijenta
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="card-container" @click="navigateToTrenerAzuriranjePPBrisanje">
      <div class="card-container">
        <q-card class="my-card" style="max-width: 3000px; margin: 50px 0 0 50px; background-color: #f2f2f2;">
          <q-img src="https://cdn.pixabay.com/photo/2017/06/06/00/33/edit-icon-2375785_1280.png" style="max-height: 3000px;">
            <div class="absolute-bottom text-h6 center">
              Ažuriranje plana prehrane
            </div>
          </q-img>
          <q-card-section style="font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 50px;">
            Ovdje možete ažurirati/obrisati Vaš plan prehrane!
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="card-container" @click="navigateToPodacioKlijentu">
      <q-card class="my-card" style="max-width: 3000px; margin: 50px 0 0 50px; background-color: #f2f2f2;">
        <q-img src="https://cdn-icons-png.flaticon.com/512/3588/3588516.png" style="max-height: 3000px;">
          <div class="absolute-bottom text-h6 center">
            Podaci o klijentu
          </div>
        </q-img>
        <q-card-section style="font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 50px;">
          Ovdje možete vidjeti sve podatke o vašem klijentu
        </q-card-section>
      </q-card>
    </div>

    <div class="card-container" @click="navigateToUvidUKlijentovNapredak">
      <q-card class="my-card" style="max-width: 3000px; margin: 50px 0 0 50px; background-color: #f2f2f2;">
        <q-img src="https://cdn-icons-png.flaticon.com/512/4992/4992624.png" style="max-height: 3000px;">
          <div class="absolute-bottom text-h6 center">
            Napredak klijenta
          </div>
        </q-img>
        <q-card-section style="font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 50px;">
          Ovdje možete vidjeti tjedni napredak Vašeg klijenta
        </q-card-section>
      </q-card>
    </div>
   
  
    
</div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { getDoc, doc } from 'firebase/firestore';
import { db } from 'boot/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
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
    const docId = ref(null);
    const clientName = ref('');
    const route = useRoute();
    const router = useRouter();
    // provjerava status autentifikacije korisnika i dohvaća ime klijenta.
    onMounted(() => {
      const authInstance = getAuth();
      onAuthStateChanged(authInstance, (user) => {
        if (user) {
          docId.value = route.params.id;
          fetchClientName();
        } else {
          clientName.value = '';
        }
      });
    });
 // Dohvaća ime klijenta iz baze podataka na temelju ID-a klijenta.
    const fetchClientName = async () => {
      const authInstance = getAuth();
      if (authInstance.currentUser && docId.value) {
        const trainerId = authInstance.currentUser.uid;

        const clientDoc = await getDoc(doc(db, 'Treneri', trainerId, 'Clients', docId.value));
        if (clientDoc.exists()) {
          const data = clientDoc.data();
          clientName.value = `${data?.ime_korisnika} ${data?.prezime_korisnika}`;
        }
      }
    };

    const navigateToTrenerPV = () => {
      if (docId.value) {
        router.push({ name: 'TrenerPV', params: { id: docId.value } });
      }
    };

    const navigateToPodacioKlijentu = () => {
      if (docId.value) {
        router.push({ name: 'TrenerPodacioKlijentu', params: { id: docId.value } });
      }
    };
    const navigateToTrenerPlanPrehrane = () => {
      if (docId.value) {
        router.push({ name: 'TrenerPP', params: { id: docId.value } });
      }
    };
    const navigateToUvidUKlijentovNapredak = () => {
      if (docId.value) {
        router.push({ name: 'TrenerUvidUKlijentovNapredak', params: { id: docId.value } });
      }
    };
    const navigateToTrenerAzuriranjePVBrisanje = () => {
      if (docId.value) {
        router.push({ name: 'TrenerAzuriranjePVBrisanje', params: { id: docId.value } });
      }
    };
    const navigateToTrenerAzuriranjePPBrisanje = () => {
      if (docId.value) {
        router.push({ name: 'TrenerAzuriranjePPBrisanje', params: { id: docId.value } });
      }
    };
    

    return {
      clientName: computed(() => clientName.value),
      navigateToTrenerPV,
      navigateToPodacioKlijentu,
      navigateToTrenerPlanPrehrane,
       navigateToUvidUKlijentovNapredak,
       navigateToTrenerAzuriranjePVBrisanje,
       navigateToTrenerAzuriranjePPBrisanje
      
    };
  },
};
</script>

<style>
.card-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
