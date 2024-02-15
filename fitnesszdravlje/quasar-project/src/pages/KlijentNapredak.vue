<template>
  <q-page padding>
    <div class="text-center q-pb-lg">
      <h4>Tjedna mjerenja</h4>
    </div>

    <div class="q-pa-md">
      <div class="form-container">
        <div class="form-field">
          <label class="form-label">Datum:</label>
          <input type="date" class="form-input" v-model="mjerenjeDatum" :readonly="!editing" required />
        </div>
        <div class="form-field">
          <label class="form-label">Težina (kg):</label>
          <input type="number" class="form-input" v-model="tezina" :readonly="!editing" required />
        </div>
        <div class="form-field">
          <label class="form-label">Visina (cm):</label>
          <input type="number" class="form-input" v-model="visina" :readonly="!editing" required />
        </div>
        <div class="form-field">
          <label class="form-label">Obujam struka (cm):</label>
          <input type="number" class="form-input" v-model="obujamStruka" :readonly="!editing" required />
        </div>
        <div class="form-field">
          <label class="form-label">Obujam bicepsa (cm):</label>
          <input type="number" class="form-input" v-model="obujamBicepsa" :readonly="!editing" required />
        </div>
        <div class="form-field">
          <label class="form-label">Obujam bedra (cm):</label>
          <input type="number" class="form-input" v-model="obujamBedra" :readonly="!editing" required />
        </div>
        <div class="form-field">
          <label class="form-label">Obujam prsa (cm):</label>
          <input type="number" class="form-input" v-model="obujamPrsa" :readonly="!editing" required />
        </div>
        <div class="form-field">
          <label class="form-label">Tjelesna masnoća (%):</label>
          <input type="number" class="form-input" v-model="tjelesnaMasnoca" :readonly="!editing" required />
        </div>
        <div class="form-field">
          <label class="form-label">BMI:</label>
          <input type="number" class="form-input" v-model="BMI" readonly />
        </div>
      </div>

      <q-btn 
        v-if="!editing"
        icon="edit"
        @click="toggleEditing"
        class="glossy"
        color="primary"
        rounded
      >
        UREDI
      </q-btn>
      <q-btn 
        v-else
        icon="save"
        @click="saveMeasurements"
        :disabled="!isFormValid"
        class="glossy"
        color="primary"
        rounded
      >
        SPREMI
      </q-btn>
    </div>
  </q-page>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { db } from 'boot/firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
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
    
    const auth = getAuth();
    const mjerenjeDatum = ref("");
    const tezina = ref(0);
    const visina = ref(0);
    const obujamStruka = ref(0);
    const obujamBicepsa = ref(0);
    const obujamBedra = ref(0);
    const obujamPrsa = ref(0);
    const tjelesnaMasnoca = ref(0);
    const BMI = ref(0);
    const editing = ref(false);
    const userEmail = ref("");
    const docId = ref(null);
    

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        userEmail.value = user.email;
        await fetchOrCreateMeasurements(user.email);
      }
    });
   //metoda za prebacivanje između načina uređivanja i pregleda
    const toggleEditing = () => {
      editing.value = !editing.value;
      if (!editing.value) {
        saveMeasurements();
      }
    };
  // metoda za dohvaćanje postojećih mjerenja iz baze ili unosi nova mjerenja 
    const fetchOrCreateMeasurements = async (email) => {
      const mjerenjaQuery = query(collection(db, "Mjerenja"), where("userEmail", "==", email));
      const querySnapshot = await getDocs(mjerenjaQuery);

      if (!querySnapshot.empty) {
        const docData = querySnapshot.docs[0].data();
        docId.value = querySnapshot.docs[0].id;
        mjerenjeDatum.value = docData.datum;
        tezina.value = docData.tezina;
        visina.value = docData.visina;
        obujamStruka.value = docData.obujamStruka;
        obujamBicepsa.value = docData.obujamBicepsa;
        obujamBedra.value = docData.obujamBedra;
        obujamPrsa.value = docData.obujamPrsa;
        tjelesnaMasnoca.value = docData.tjelesnaMasnoca;
        BMI.value = docData.BMI;
      } else {
        
      }
    };
 // metoda za spremanje korisnikovih mjerenja u bazu i računa BMI
    const saveMeasurements = async () => {
      const visinaM = visina.value / 100;
      BMI.value = (tezina.value / (visinaM * visinaM)).toFixed(2);

      const mjerenjeData = {
        datum: mjerenjeDatum.value,
        tezina: tezina.value,
        visina: visina.value,
        obujamStruka: obujamStruka.value,
        obujamBicepsa: obujamBicepsa.value,
        obujamBedra: obujamBedra.value,
        obujamPrsa: obujamPrsa.value,
        tjelesnaMasnoca: tjelesnaMasnoca.value,
        BMI: BMI.value,
        userEmail: userEmail.value
      };

      try {
        if (docId.value) {
          await updateDoc(doc(db, "Mjerenja", docId.value), mjerenjeData);
        } else {
          await addDoc(collection(db, "Mjerenja"), mjerenjeData);
        }
        console.log("Measurements successfully updated/saved!");
      } catch (error) {
        console.error("Error updating/saving measurements:", error);
      }
    };

    const isFormValid = computed(() => {
      return mjerenjeDatum.value && 
             tezina.value > 0 &&
             visina.value > 0 &&
             obujamStruka.value > 0 &&
             obujamBicepsa.value > 0 &&
             obujamBedra.value > 0 &&
             obujamPrsa.value > 0 &&
             tjelesnaMasnoca.value > 0; 
    });

    return {
      mjerenjeDatum,
      tezina,
      visina,
      obujamStruka,
      obujamBicepsa,
      obujamBedra,
      obujamPrsa,
      tjelesnaMasnoca,
      BMI,
      editing,
      toggleEditing,
      saveMeasurements,
      userEmail,
      isFormValid
    };
  },
};
</script>

<style>
.form-container {
  display: flex;
  flex-direction: column;
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
