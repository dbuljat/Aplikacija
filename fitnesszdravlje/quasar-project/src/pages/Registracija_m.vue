<template>
     <q-page  >
      <div class="your-component">
    <div class="row">
      <div class="col-12 col-md-8"> <div class="q-pa-md">
        <div class="q-pa-md">
    <q-carousel square  class="q-pa-lg "
      swipeable
      animated
      v-model="slide"
      :autoplay="autoplay"
      ref="carousel"
      infinite
      height="800px">
      <q-carousel-slide :name="1" img-src="https://cdn.wallpapersafari.com/40/97/4jmHRy.jpg"/>
      <q-carousel-slide :name="2" img-src="https://wallpaper.dog/large/20480587.jpg" />
      <q-carousel-slide :name="3" img-src="https://trumpwallpapers.com/wp-content/uploads/Workout-Wallpaper-08-2560-x-1440.jpg" />
      <q-carousel-slide :name="4" img-src="https://i.pinimg.com/originals/42/78/9a/42789a46eb0f94b196d90252c08baff2.jpg" />
      <template v-slot:control>
        <q-carousel-control
          position="top-right"
          :offset="[18, 18]"
          class="text-white rounded-borders"
          style="background: rgba(0, 0, 0, .3); padding: 4px 8px;" >
          <q-toggle dense dark color="orange" v-model="autoplay" label="Auto Play" />
        </q-carousel-control>
        <q-carousel-control
          position="bottom-right"
          :offset="[18, 18]"
          class="q-gutter-xs">
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
        <div>
        </div>
      <div class="column" >
        <div class="row">
          <q-card  class="q-pa-lg   row justify-center items-center bg-dark">
            <q-card square bordered class="q-pa-lg ">
    <q-card-section>
      <q-form class="q-gutter-md" @submit.prevent="register">
      <h5 class="text-h3 text-dark q-my-md ">Registracija</h5>
      <p class="italic">Molimo Vas da ispunite polja ispod, kako bi registracija bila uspješna!</p>
         <q-input square filled clearable v-model="ime_korisnika" type="text" label="Vaše ime" class="shadow-10" :rules="[validateName]"/>
         <q-input square filled clearable v-model="prezime_korisnika" type="text" label="Vaše prezime" class="shadow-10" :rules="[validateSurname]"/>
         <q-select
                      dense
                      v-model="role"
                      :options="['Trener/ica', 'Klijent/ica']"
                      label="Odaberi ulogu"
                      color="primary"
                      @input="handleRoleChange"
                    />
         <q-input square filled clearable v-model="username_korisnika" type="text" label="Vaše korisničko ime" class="shadow-10" :rules="[validateUsername]"/>
         <q-input square filled clearable v-model="email" type="email" label="Vaš email" class="shadow-10" :rules="[val => (val && val.length > 0) || 'Email adresa je obavezna', validateEmail]"/>
      <q-input square filled clearable v-model="password" type="password" label="Lozinka" class="shadow-10" :rules="[validatePassword]" />
         <q-input square filled clearable v-model="kontakt_korisnika" type="text" label="Vaš kontakt broj" class="shadow-10" :rules="[validatePhoneNumber]" />
         <q-input square filled clearable v-model="datumrod_korisnika" type="date" label="Datum rođenja" class="shadow-10"  :rules="[validateDateOfBirth]"/>

         <q-radio dense v-model="shape" val="Muško" label="Muško" :rules="[validateGender]" />
         <q-radio dense v-model="shape" val="Žensko" label="Žensko" :rules="[validateGender]"/>

         
         <q-input square filled clearable v-model="visina_korisnika" type="text" label="Vaša visina (u metrima)" class="shadow-10" :rules="[validateHeight]"/>
         <q-input square filled clearable v-model="tezina_korisnika" type="text" label="Vaša težina (u kg)" class="shadow-10" :rules="[validateWeight]"/>
       </q-form>
     </q-card-section>
     <q-card-actions class="q-px-md">
       <q-btn unelevated color="light-blue-7" size="lg" class="full-width" label="Registracija" @click="register" :disabled="isSubmitDisabled" />
      </q-card-actions>
     <q-card-actions class="q-px-md">
       <router-link to="/login" class="link-style">
     <p class="text-center-grey-10-">Imate račun? Prijava!</p>
     </router-link>
     </q-card-actions>
     <q-card-section class="text-center q-pa-none">
     </q-card-section>
   </q-card>
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
        </div>
      </div></div> 
    </div>
    </div>
  </q-page>
  </template>
  
  <script>
import { ref, inject, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
export default {
  setup () {
    const router = useRouter();
    const email = ref('');
    const password = ref('');
    const ime_korisnika = ref('');
    const prezime_korisnika = ref('');
    const role = ref('');
    const username_korisnika = ref('');
    const kontakt_korisnika = ref('');
    const datumrod_korisnika = ref('');
    const shape = ref('');
    const visina_korisnika = ref('');
    const tezina_korisnika = ref('');
    const firebase = inject('firebase');
    const { auth } = firebase;

    const validateName = (val) => {
  const pattern = /^[a-zA-Z]+$/;
  if (!val || val.trim().length === 0) {
    return 'Ime je obavezno.'; 
  } else if (!pattern.test(val)) {
    return 'Ime ne smije imati brojke.'; 
  } else {
    return true; // uspješna validacija
  }
};

const validateSurname = (val) => {
  const pattern = /^[a-zA-Z]+$/;

  if (!val || val.trim().length === 0) {
    return 'Prezime je obavezno.'; 
  } else if (!pattern.test(val)) {
    return 'Prezime ne smije imati brojke.'; 
  } else {
    return true; // uspješna validacija
  }
};
const validateUsername = (val) => {
  const pattern = /^[a-zA-Z0-9]+$/;

  if (!val || val.trim().length === 0) {
    return 'Korisničko ime je obavezno.'; 
  } else if (!pattern.test(val)) {
    return 'Korisničko ime ne smije imati specijalne znakove ili razmak.'; 
  } else {
    return true; // uspiješno uneseno
  }
};
    const validateEmail = (val) => {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return pattern.test(val) || 'Nevažeća email adresa';
  };

  const validatePassword = (val) => {
  if (!val) {
    return 'Lozinka je obavezna';
  } else if (val.length < 8) {
    return 'Lozinka mora sadržavat 8 znakova';
  } else if (!/[a-z]/.test(val)) {
    return 'Lozinka mora sadržavati barem jedno malo slovo';
  } else if (!/[A-Z]/.test(val)) {
    return 'Lozinka mora sadržavati barem jedno veliko slovo';
  } else if (!/[0-9]/.test(val)) {
    return 'Lozinka mora sadržavati barem jednu brojku';
  } else {
    return true;
  }
};
const validatePhoneNumber = (val) => {
  if (!val) {
    return 'Broj telefona je obavezan';
  } else if (!/^[0-9]*$/.test(val)) {
    return 'Broj telefona ne smije sadržavati slova';
  } else if (val.length !== 10) {
    return 'Broj telefona mora imati točno 10 brojki';
  } else {
    return true;
  }
};
const validateDateOfBirth = (val) => {
  if (!val) {
    return 'Datum rođenja je obavezan';
  } else {
    const dob = new Date(val);
    const today = new Date();

    // Provjerava ako je datum rođenja u budućnosti
    if (dob > today) {
      return 'Datum rođenja ne može biti u budućnosti';
    }

    const age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    if (age < 18) {
      return 'Morate imati najmanje 18 godina.';
    } else {
      return true;
    }
  }
};
const validateGender = (val) => {
  return !!val || 'Morate odabrati spol';
};
const validateRole = (val) => {
  return !!val || 'Morate odabrati ulogu';
};
const validateHeight = (val) => {
  const height = parseFloat(val);
  const isNumeric = !isNaN(height);
  const isRequired = (val && val.trim().length > 0);
  
  if (!isRequired) {
    return 'Visina je obavezna';
  } else if (!isNumeric) {
    return 'Visina mora biti izražena brojkama';
  } else {
    return true; // uspiješno
  }
};

const validateWeight = (val) => {
  const weight = parseFloat(val);
  const isNumeric = !isNaN(weight);
  const isRequired = (val && val.trim().length > 0);
  
  if (!isRequired) {
    return 'Težina je obavezna';
  } else if (!isNumeric) {
    return 'Težina mora biti izražena brojkama';
  } else {
    return true; // uspješno
  }
};

const handleRoleChange = (value) => {
  console.log('Selected role:', value);
};
// gumb submit
const isSubmitDisabled = computed(() => {
  const nameValidation = validateName(ime_korisnika.value);
  console.log('Name validation: ', nameValidation);

  const surnameValidation = validateSurname(prezime_korisnika.value);
  console.log('Surname validation: ', surnameValidation);

  const usernameValidation = validateUsername(username_korisnika.value);
  console.log('Username validation: ', usernameValidation);

  const roleValidation = validateRole(role.value);
  console.log('Role validation: ', roleValidation);

  const emailValidation = validateEmail(email.value);
  console.log('Email validation: ', emailValidation);

  const passwordValidation = validatePassword(password.value);
  console.log('Password validation: ', passwordValidation);

  const phoneNumberValidation = validatePhoneNumber(kontakt_korisnika.value);
  console.log('Phone number validation: ', phoneNumberValidation);

  const dateOfBirthValidation = validateDateOfBirth(datumrod_korisnika.value);
  console.log('Date of birth validation: ', dateOfBirthValidation);

  const genderValidation = validateGender(shape.value);
  console.log('Gender validation: ', genderValidation);

  const heightValidation = validateHeight(visina_korisnika.value);
  console.log('Height validation: ', heightValidation);

  const weightValidation = validateWeight(tezina_korisnika.value);
  console.log('Weight validation: ', weightValidation);

  return (
    nameValidation !== true ||
    surnameValidation !== true ||
    roleValidation !== true ||
    usernameValidation !== true ||
    emailValidation !== true ||
    passwordValidation !== true ||
    phoneNumberValidation !== true ||
    dateOfBirthValidation !== true ||
    genderValidation !== true ||
    heightValidation !== true ||
    weightValidation !== true
  );
});

    
    const register = async() => {
      if(!email.value.trim() && !password.value.trim()){
        console.log("Both fields are required");
        return;
      }
      try {
    // Registracija
    const auth = getAuth();
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
    const user = userCredential.user;

    
    const db = getFirestore();
    let collectionName = '';
   
    if (role.value === 'Trener/ica') {
      collectionName = 'Treneri';
    } else if (role.value === 'Klijent/ica') {
      collectionName = 'Klijenti';
    } else {
      console.error('Invalid role');
      return;
    }

    await setDoc(doc(db, collectionName, user.uid), {
      ime_korisnika: ime_korisnika.value,
      prezime_korisnika: prezime_korisnika.value,
      role: role.value,
      username_korisnika: username_korisnika.value,
      email: email.value,
      kontakt_korisnika: kontakt_korisnika.value,
      datumrod_korisnika: datumrod_korisnika.value,
      shape: shape.value,
      visina_korisnika: visina_korisnika.value,
      tezina_korisnika: tezina_korisnika.value,
    });

    
    email.value = "";
    password.value = "";
    ime_korisnika.value = "";
    prezime_korisnika.value = "";
    username_korisnika.value = "";
    role.value = "";
    kontakt_korisnika.value = "";
    datumrod_korisnika.value = "";
    shape.value = "";
    visina_korisnika.value = "";
    tezina_korisnika.value = "";
    // Odi na login page
     router.push('/login');
  } catch (error) {
    console.error("Error in registration: ", error);
  }
    }
    return {
      email, password, register, ime_korisnika, prezime_korisnika, role,  username_korisnika, kontakt_korisnika, datumrod_korisnika, shape, visina_korisnika, tezina_korisnika,
      slide: ref(1),
      validateName,
      validateSurname,
      validateUsername,
      validatePassword,
      validatePhoneNumber,
      validateEmail,
      validateDateOfBirth,
      validateGender,
      validateRole,
      validateHeight,
      validateWeight,
      isSubmitDisabled,
      handleRoleChange,
      autoplay: ref(false)
    };
  }
}
  </script>
  <style>
  .q-card {
    width: 360px;
  
  }
  .italic {
    font-style: italic;
  }

  .your-component {
  background-image: url('https://img.freepik.com/free-photo/confident-sportswoman-with-dumbbell-dark_23-2147752923.jpg?size=626&ext=jpg'); /* Adjust the path as per your image location */
  background-repeat: no-repeat;
  background-size: cover; 
}
  </style>