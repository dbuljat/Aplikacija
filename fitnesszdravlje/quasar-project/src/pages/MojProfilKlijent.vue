
<template>
  <div class="q-pa-md">
    <q-header elevated class="vrh">
      <q-toolbar>
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon class="ikonanavrhu">
              <img src="https://icons.veryicon.com/png/128/miscellaneous/iron-police/user-643.png" />
            </q-icon>
          </q-item-section>
          <q-item-section>
            <h4>Moj profil</h4>
          </q-item-section>
        </q-item>
      </q-toolbar>
    </q-header>

    <q-card>
    <div style="display: flex;">
      <div style="margin-left: 60px;">
        <div style="margin-right: 60px;">
        
          <h5>Osobni podaci</h5>
        
          <div class="form-container">
            <div class="form-field">
              <label class="form-label">Ime:</label>
              <input type="text" class="form-input" v-model="ime_korisnika" :readonly="!editing" />
            </div>
            <div class="form-field">
              <label class="form-label">Prezime:</label>
              <input type="text" class="form-input" v-model="prezime_korisnika" :readonly="!editing" />
            </div>
            <div class="form-field">
              <label class="form-label">Kontakt broj:</label>
              <input type="text" class="form-input" v-model="kontakt_korisnika" :readonly="!editing" />
            </div>
            <div class="form-field">
              <label class="form-label">E-mail:</label>
              <input type="email" class="form-input" v-model="email" :readonly="!editing" />
            </div>
          </div>
        </div>
      </div>
      <div style="margin-left: 50px;">
        <h5 style="visibility: hidden;">Drugi podaci</h5>
        <div class="form-container">
          <div class="form-field">
            <label class="form-label">Spol:</label>
            <input type="text" class="form-input" v-model="shape" :readonly="!editing" />
          </div>
          <div class="form-field">
            <label class="form-label">Težina:</label>
            <input type="text" class="form-input" v-model="tezina_korisnika" :readonly="!editing" />
          </div>
          <div class="form-field">
            <label class="form-label">Visina:</label>
            <input type="text" class="form-input" v-model="visina_korisnika" :readonly="!editing" />
          </div>
          <div class="form-field">
            <label class="form-label">Datum rođenja:</label>
            <input type="date" class="form-input" v-model="datumrod_korisnika" :readonly="!editing" />
          </div>
        </div>
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
  @click="toggleEditing"
  class="glossy"
  color="primary"
  rounded
>
SPREMI
</q-btn>
  </q-card>
  </div>
  
  <!-- FooterL -->
  <q-footer  class="footer">
        <q-toolbar>
          <q-toolbar-title>© 2024 Fitness i zdravlje
            
          </q-toolbar-title>
         
        </q-toolbar>
      </q-footer>
</template>

<script>
import { ref, onMounted } from "vue";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "boot/firebase.js";
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
    const ime_korisnika = ref("");
    const prezime_korisnika = ref("");
    const kontakt_korisnika = ref("");
    const email = ref("");
    const shape = ref("");
    const tezina_korisnika = ref("");
    const visina_korisnika = ref("");
    const datumrod_korisnika = ref("");
    const editing = ref(false);

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        
        const uid = user.uid;
        
        const docRef = doc(db, "Klijenti", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          ime_korisnika.value = data.ime_korisnika;
          prezime_korisnika.value = data.prezime_korisnika;
          kontakt_korisnika.value = data.kontakt_korisnika;
          email.value = data.email;
          shape.value = data.shape;
          tezina_korisnika.value = data.tezina_korisnika;
          visina_korisnika.value = data.visina_korisnika;
          datumrod_korisnika.value = data.datumrod_korisnika || null;

        } else {
          console.log("No such document!");
        }
      } else {
        // Korisnik je odjavljen
        // ...
      }
    });
// metoda za prebacivanje između načina uređivanja i pregleda
    const toggleEditing = () => {
      editing.value = !editing.value;

      if (!editing.value) {
        updateTrener();
      }
    };
// metoda za ažuriranje podataka o klijentu
    const updateTrener = async () => {
      const user = auth.currentUser;
      const docRef = doc(db, "Klijenti", user.uid);

      const updatedData = {
        ime_korisnika: ime_korisnika.value,
        prezime_korisnika: prezime_korisnika.value,
        kontakt_korisnika: kontakt_korisnika.value,
        email: email.value,
        shape: shape.value,
        tezina_korisnika: tezina_korisnika.value,
        visina_korisnika: visina_korisnika.value,
        datumrod_korisnika: datumrod_korisnika.value

      };

      await updateDoc(docRef, updatedData);
    };

    return {
      ime_korisnika,
      prezime_korisnika,
      kontakt_korisnika,
      email,
      shape,
      tezina_korisnika,
      visina_korisnika,
      datumrod_korisnika,
      editing,
      toggleEditing,
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
  max-width: 300px;
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
.ikonanavrhu{
    width: 50px;
    height: 50px;
    color: white;
  } 
  .edit-btn {
  margin-left: 600px;
}
.vrh {
  border-style: solid;
  color: rgb(255, 255, 255);
} 

.footer{
  background-color: rgba(2, 122, 227, 0.849);
 border: solid;
  color: rgb(245, 243, 243);
  size: 30px;
}
.glossy{
  margin-left: 125px;
  
  margin-right: 80px;
  margin-top: 20px;
  margin-bottom:20px;
}
</style>