<template>
    <q-page padding>
      <div class="text-center q-pb-lg">
        <h4>Podaci o napretku klijenta</h4>
      </div>
  
      <div v-if="loading" class="q-pa-md">
        Učitavanje podataka...
      </div>
  
      <div v-else class="q-pa-md center-container">
        <div v-if="measurementData">
          <div class="form-field">
            <label class="form-label">Datum zadnjeg mjerenja:</label>
            <input type="text" class="form-input" :value="measurementData.datum" readonly />
          </div>
          <div class="form-field">
            <label class="form-label">Težina (kg):</label>
            <input type="text" class="form-input" :value="measurementData.tezina + ' kg'" readonly />
          </div>
          <div class="form-field">
            <label class="form-label">Visina (cm):</label>
            <input type="text" class="form-input" :value="measurementData.visina + ' cm'" readonly />
          </div>
          <div class="form-field">
            <label class="form-label">Obujam struka (cm):</label>
            <input type="text" class="form-input" :value="measurementData.obujamStruka + ' cm'" readonly />
          </div>
          <div class="form-field">
            <label class="form-label">Obujam bicepsa (cm):</label>
            <input type="text" class="form-input" :value="measurementData.obujamBicepsa + ' cm'" readonly />
          </div>
          <div class="form-field">
            <label class="form-label">Obujam bedra (cm):</label>
            <input type="text" class="form-input" :value="measurementData.obujamBedra + ' cm'" readonly />
          </div>
          <div class="form-field">
            <label class="form-label">Obujam prsa (cm):</label>
            <input type="text" class="form-input" :value="measurementData.obujamPrsa + ' cm'" readonly />
          </div>
          <div class="form-field">
            <label class="form-label">Tjelesna masnoća (%):</label>
            <input type="text" class="form-input" :value="measurementData.tjelesnaMasnoca + ' %'" readonly />
          </div>
          <div class="form-field">
            <label class="form-label">BMI:</label>
            <input type="text" class="form-input" :value="measurementData.BMI" readonly />
          </div>
        </div>
        <div v-else>
          Podaci nisu dostupni.
        </div>
      </div>
    </q-page>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { db } from 'boot/firebase';
  import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
  import { getAuth, onAuthStateChanged } from 'firebase/auth';
  import { useRoute } from 'vue-router';
  
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
      const loading = ref(true);
      const measurementData = ref(null);
   // metoda za dohvacanje podataka mjerenja klijenta
      const fetchClientMeasurementData = async (clientId) => {
        const auth = getAuth();
        const currentUser = auth.currentUser;
  
        if (currentUser) {
          const clientDocRef = doc(db, 'Treneri', currentUser.uid, 'Clients', clientId);
          const clientDocSnap = await getDoc(clientDocRef);
  
          if (clientDocSnap.exists()) {
            const clientData = clientDocSnap.data();
            const email = clientData.email;
  
            const measurementsQuery = query(collection(db, 'Mjerenja'), where('userEmail', '==', email));
            const querySnapshot = await getDocs(measurementsQuery);
  
            if (!querySnapshot.empty) {
              measurementData.value = querySnapshot.docs[0].data();
            } else {
              console.log('Nema pronađenih mjerenja za klijenta.');
            }
          } else {
            console.log('Klijent ne postoji u bazi podataka.');
          }
        } else {
          console.log('Nema trenutno prijavljenog korisnika.');
        }
        loading.value = false;
      };
  
      onMounted(() => {
        const clientId = route.params.id;
        fetchClientMeasurementData(clientId);
      });
  
      return {
        loading,
        measurementData,
      };
    },
  };
  </script>
  
  <style>
  .center-container {
    display: flex;
    justify-content: center;
  }
  
  .form-container {
    display: flex;
    flex-direction: column;
    max-width: 200px; /* Smanjenje duljine input polja */
  }
  
  .form-field {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
  }
  
  .form-label {
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  .form-input {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
    outline: none;
  }
  
  .glossy {
    margin-top: 20px;
  }
  </style>