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
              <h4>Profil klijenta</h4>
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
                  <input type="text" class="form-input" v-model="clientData.ime_korisnika" readonly />
                </div>
                <div class="form-field">
                  <label class="form-label">Prezime:</label>
                  <input type="text" class="form-input" v-model="clientData.prezime_korisnika" readonly />
                </div>
                <div class="form-field">
                  <label class="form-label">Kontakt broj:</label>
                  <input type="text" class="form-input" v-model="clientData.kontakt_korisnika" readonly />
                </div>
                <div class="form-field">
                  <label class="form-label">E-mail:</label>
                  <input type="email" class="form-input" v-model="clientData.email" readonly />
                </div>
              </div>
            </div>
          </div>
          <div style="margin-left: 50px;">
            <h5 style="visibility: hidden;">Drugi podaci</h5>
            <div class="form-container">
              <div class="form-field">
                <label class="form-label">Spol:</label>
                <input type="text" class="form-input" v-model="clientData.shape" readonly />
              </div>
              <div class="form-field">
                <label class="form-label">Težina:</label>
                <input type="text" class="form-input" v-model="clientData.tezina_korisnika" readonly />
              </div>
              <div class="form-field">
                <label class="form-label">Visina:</label>
                <input type="text" class="form-input" v-model="clientData.visina_korisnika" readonly />
              </div>
              <div class="form-field">
                <label class="form-label">Datum rođenja:</label>
                <input type="date" class="form-input" v-model="clientData.datumrod_korisnika" readonly />
              </div>
            </div>
          </div>
        </div>
      </q-card>
    </div>
  </template>
  
  <script>
  import { getDoc, doc, collection } from 'firebase/firestore';
  import { db } from 'boot/firebase';
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
    data() {
      return {
        clientData: {
          ime_korisnika: '',
          prezime_korisnika: '',
          kontakt_korisnika: '',
          email: '',
          shape: '',
          tezina_korisnika: '',
          visina_korisnika: '',
          datumrod_korisnika: '',
        },
      };
    },
    mounted() {
      this.fetchClientData();
    },
    methods: {
      // dohvaća ID klijenta iz URL-a i provjerava autentikaciju korisnika, ako je autentificiran, pokreće funkciju za dohvat podataka o klijentu
      async fetchClientData() {
        try {
          const clientId = this.$route.params.id;
          let trainerId = ''; 
          const auth = getAuth();
          
          
          onAuthStateChanged(auth, (user) => {
            if (user) {
              
              trainerId = user.uid;
              this.getClientData(clientId, trainerId);
            } else {
              
              console.log('User is not authenticated');
            }
          });
        } catch (error) {
          console.error('Error fetching client data:', error);
        }
      },
      // dohvaćanje podataka o klijentu na temelju ID-a trenera i klijenta
      async getClientData(clientId, trainerId) {
        try {
          const clientDoc = await getDoc(
            doc(db, 'Treneri', trainerId, 'Clients', clientId)
          );
          if (clientDoc.exists()) {
            this.clientData = clientDoc.data();
          } else {
            console.log('Client document does not exist');
          }
        } catch (error) {
          console.error('Error fetching client data:', error);
        }
      },
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
  