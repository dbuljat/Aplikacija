<template>
  <q-page class="bg-dark" >
   
    <div class="row">
      <div class="col-12 col-md-8"> <div class="q-pa-md">
        
        <div class="q-pa-md">
    <q-carousel square bordered class="q-pa-lg shadow-1 bg-grey  "
      swipeable
      animated
      v-model="slide"
      :autoplay="autoplay"
      ref="carousel"
      infinite
      height="800px"
    >
      <q-carousel-slide :name="1" img-src="https://cdn.wallpapersafari.com/40/97/4jmHRy.jpg" />
      <q-carousel-slide :name="2" img-src="https://wallpaper.dog/large/20480587.jpg" />
      <q-carousel-slide :name="3" img-src="https://trumpwallpapers.com/wp-content/uploads/Workout-Wallpaper-08-2560-x-1440.jpg" />
      <q-carousel-slide :name="4" img-src="https://i.pinimg.com/originals/42/78/9a/42789a46eb0f94b196d90252c08baff2.jpg" />

      <template v-slot:control>
        <q-carousel-control
          position="top-right"
          :offset="[18, 18]"
          class="text-white rounded-borders"
          style="background: rgba(0, 0, 0, .3); padding: 4px 8px;"
        >
          <q-toggle dense dark color="orange" v-model="autoplay" label="Auto Play" />
        </q-carousel-control>

        <q-carousel-control
          position="bottom-right"
          :offset="[18, 18]"
          class="q-gutter-xs"
        >
          <q-btn
            push round dense color="orange" text-color="black" icon="arrow_left"
            @click="$refs.carousel.previous()"
          />
          <q-btn
            push round dense color="orange" text-color="black" icon="arrow_right"
            @click="$refs.carousel.next()"
          />
        </q-carousel-control>
      </template>
    </q-carousel>
  </div>

  </div></div>
      <div class="col-12 col-md-4">
        <div></div>
        
      <div class="column" >
        <div class="row">
       
          <q-card  class="q-pa-lg shadow-0  row justify-center items-center bg-dark">
         
        </q-card>
        <q-card  class="q-pa-lg shadow-0  row justify-center items-center bg-dark">
         
        </q-card>
        <q-card  class="q-pa-lg shadow-0  row justify-center items-center bg-dark">
         
        </q-card>
        <q-card  class="q-pa-lg shadow-0  row justify-center items-center bg-dark">
         
        </q-card>
        <q-card  class="q-pa-lg shadow-0  row justify-center items-center bg-dark">
         
        </q-card>
        </div>
        <div class="row">
          <q-card square bordered class="q-pa-lg shadow-10 ">
            <q-card-section>
              <q-card-section>
                <q-form class="q-gutter-md" @submit.prevent="login">
  <h5 class="text-h4 text-dark q-my-md">Prijava</h5>
  <q-input square filled clearable v-model="email" type="email" label="Vaš e-mail" class="shadow-10" />
  <q-input square filled clearable v-model="password" type="password" label="Lozinka" class="shadow-10" />
  
  <p v-if="error" class="text-negative">{{ error }}</p>
</q-form>
    
  </q-card-section>
  <q-card-actions class="q-px-md">
    <q-btn unelevated color="light-blue-7" size="lg" class="full-width" label="Prijava" @click="login" type="submit" />
  </q-card-actions>
  <q-card-section class="text-center q-pa-none">
  <router-link to="/login/Registracija_m" class="link-style">
    <p class="text-grey-10">Nemate račun? Registrirajte se!</p>
  </router-link>
</q-card-section>

          </q-card-section>
          </q-card>
        </div>
      </div></div> 
    </div>

  </q-page>
  </template>
  
  <script>
 import { ref, inject } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex'; // import Vuex
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, getFirestore } from "firebase/firestore"; // import Firestore

export default {
  
  setup () {
    const router = useRouter();
    const email = ref('');
    const password = ref('');

    const error = ref(null);
    const firebase = inject('firebase');
    const { auth } = firebase;
    const store = useStore(); // import Vuex store

    const validateRole = (val) => {
  return !!val || 'Morate odabrati ulogu';
};
 // metoda za prepoznavanje je li korisnik trener ili klijent
const getUserRoleFromFirestore = async (userId) => {
  const db = getFirestore();
  const treneriRef = doc(db, "Treneri", userId); 
  const klijentiRef = doc(db, "Klijenti", userId); 

  const treneriSnap = await getDoc(treneriRef);
  const klijentiSnap = await getDoc(klijentiRef);

  if (treneriSnap.exists()) {
    return 'Trener/ica'; 
  } else if (klijentiSnap.exists()) {
    return 'Klijent/ica'; 
  } else {
    console.log("No such document!");
    return null; 
  }
}

    const login = async () => {
  error.value = '';
  if (!email.value.trim() || !password.value.trim()) {
    error.value = 'Molimo unesite e-mail i lozinku.';
    return;
  }
  try {
    const auth = getAuth();
        const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
        console.log(userCredential);
        email.value = '';
        password.value = '';

        
        const role = await getUserRoleFromFirestore(userCredential.user.uid); 

        
        store.dispatch('setUserRole', role);

        
        if (role === 'Trener/ica') {
          router.push('/trener/PocetnaTrener')
        } else if (role === 'Klijent/ica') {
          router.push('/klijent/PocetnaKlijent')
        } else {
          
          
        }
      } catch (loginError) {
    console.log(loginError);
    error.value = 'Provjerite svoje korisničke podatke i pokušajte ponovno.';
    console.log(error.value);
  }

};
    return {
      slide: ref(1),
      autoplay: ref(false),
      email,
      password,
      login,
      error,
      validateRole
    };
  }
}
  </script>
  
  <style>
  .q-card {
  
    width: 360px;

  }
  .q-page{
    background-color: white;
  }
  
  </style>