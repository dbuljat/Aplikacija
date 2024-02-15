<template>
    <q-card class="my-card">
      <q-carousel
        animated
        v-model="slide"
        arrows
        navigation
        infinite
      >
        <q-carousel-slide :name="1" img-src="https://cdn.wallpapersafari.com/40/97/4jmHRy.jpg" />
        <q-carousel-slide :name="2" img-src="https://wallpaper.dog/large/20480587.jpg" />
        <q-carousel-slide :name="3" img-src="https://trumpwallpapers.com/wp-content/uploads/Workout-Wallpaper-08-2560-x-1440.jpg" />
        <q-carousel-slide :name="4" img-src="https://i.pinimg.com/originals/42/78/9a/42789a46eb0f94b196d90252c08baff2.jpg" />
      </q-carousel>
        <q-card-section>
          <div class="text-h6">Train insane or remain the same</div>
          <div class="text-subtitle2">by Dario Buljat</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div class="text-h5">Odaberite aktivnost koju volite! To može biti bilo što od trčanja i hodanja do dizanja utega i plesa.</div>
        </q-card-section>
      </q-card>
      <div class="q-pa-md example-row-column-width">
  <div class="row">
    <div class="col">
      <q-card class="my-card" flat bordered>
          <q-img
            src="https://w0.peakpx.com/wallpaper/491/727/HD-wallpaper-mediterranean-diet-diet-mediterranean-habits-entertainment-healthy-lifestyle-pyramid-healthy-food.jpg"
          />
          <q-card-section>
            <div class="text-overline text-orange-9">https://fitka.hr/</div>
              <div class="text-overline text-orange-9">https://fitka.hr/</div>
            <div class="text-h5 q-mt-sm q-mb-xs">Fitka</div>
            <div class="text-caption text-grey">
              Web stranicu o fitnessu i prehrani – po tvojoj jedinstvenoj mjeri. Za osjećaj da te tijelo ne sputava već ti omogućava ti da živiš i radiš ono što voliš. Punom snagom i najvećim intenzitetom!
            </div>
          </q-card-section>
          <q-card-actions>
            <q-btn flat color="primary" @click="openFitkaPage" label="Otvori" />
    <q-space />
  </q-card-actions>
          <q-slide-transition>
            <div v-show="expanded">
              <q-separator />
              <q-card-section class="text-subitle2">
          
              </q-card-section>
            </div>
          </q-slide-transition>
        </q-card>
        <q-card class="my-card" flat bordered style="max-width: 1000px;">
        <q-img src="https://static.vecteezy.com/system/resources/previews/003/456/055/non_2x/fitness-club-logo-vector.jpg" />
  
        <q-card-section>
          <div class="text-overline text-orange-9">https://budi-fit.hr/fitness-blog/</div>
          <div class="text-h5 q-mt-sm q-mb-xs">Budi fit!</div>
          <div class="text-caption text-grey">
            Najveći fitness portal u Hrvatskoj. Svakodnevno pratite naše stručne savjete vezano za vježbanje, zdravu prehranu, mršavljenje i zdravlje.
          </div>
        </q-card-section>
        <q-card-actions>
          <q-btn flat color="primary" @click="openFitnessPage" label="Otvori" />
          <q-space />
        </q-card-actions>
        <q-slide-transition>
          <div v-show="expanded">
            <q-separator />
            <q-card-section class="text-subitle2">
            
            </q-card-section>
          </div>
        </q-slide-transition>
      </q-card>
    </div>
    <div class="col-6">
      <q-card class="my-card" flat bordered>
          <q-img
            src="https://wallpaperaccess.com/full/2591617.jpg"
          />
          <q-card-section>
            <div class="text-h5 q-mt-sm q-mb-xs">Još nemate trenera?</div>
            <div class="text-caption text-grey">
              Preko padajućeg izbornika izaberite svojeg trenera
            </div>
  
            <q-select
    v-model="selectedOption"
    :options="options"
    option-value="id"
    option-label="name"
    label="Odaberite trenera"
  />
          </q-card-section>
          <q-card-actions>
            <q-btn flat color="primary" label="Spremi" type="submit" @click.prevent="submitForm" />
            <q-space />
          </q-card-actions>
          <q-slide-transition>
            <div v-show="expanded">
              <q-separator />
              <q-card-section class="text-subitle2">
                {{ lorem }}
              </q-card-section>
            </div>
          </q-slide-transition>
        </q-card>
    </div>
    <div class="col">
      <div class="q-px-lg q-py-md">
        <q-card>
        <q-card-section>
      <q-timeline color="secondary">
        <q-timeline-entry heading body="Komentari naših trenera" />
  
        <q-timeline-entry
          title="Kako započeti?"
          subtitle="by Miljenko Kokot"
          avatar="https://cdn.quasar.dev/img/avatar3.jpg"
          :body="body1"
        />
  
        <q-timeline-entry
          title="Koje vježbe koristiti?"
          subtitle="by Dorijan Golja"
          icon="delete"
          :body="body2"
        />
  
        <q-timeline-entry heading body="15. siječnja 2023. godine" />
  
        <q-timeline-entry
          title="Event Title"
          subtitle="February 22, 1986"
          :body="body"
        />
  
        <q-timeline-entry
          title="Event Title"
          subtitle="February 22, 1986"
          :body="body"
        />
  
        <q-timeline-entry
          title="Event Title"
          subtitle="February 22, 1986"
          color="orange"
          icon="done_all"
          :body="body"
        />
  
        <q-timeline-entry
          title="Event Title"
          subtitle="February 22, 1986"
          :body="body"
        />
  
        <q-timeline-entry
          title="Event Title"
          subtitle="February 22, 1986"
          :body="body"
        />
      </q-timeline>
    </q-card-section>
  </q-card>
    </div>
   
    </div>
  </div>
  </div>
  <q-header reveal elevated class="vrh" >
                  
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
                                  <img  src="https://icons.veryicon.com/png/128/business/color-round-office-icon/home-477.png">
  
                              </q-icon>
                              </q-item-section>
                              <q-item-section>
                                  <h5>Home</h5>
                              </q-item-section>
                          </q-item>
                  
              </q-header>
              
    <div class="q-pa-md row items-start q-gutter-md">
     
    </div>
  </template>
  
  
  <script>
  import { ref, onMounted } from 'vue';
  import { collection, getDocs, getDoc, doc, addDoc } from 'firebase/firestore';
  import { db } from 'boot/firebase';
  import { getAuth } from 'firebase/auth';
  
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
      const authInstance = getAuth();
      const selectedOption = ref(null);
      const options = ref([]);
  // metoda za dohvaćanje trenera 
      const fetchTrainers = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, 'Treneri'));
          options.value = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return { id: doc.id, name: `${data.ime_korisnika} ${data.prezime_korisnika}` };
          });
        } catch (error) {
          console.error('Error fetching trainers:', error);
        }
      };
  
      onMounted(fetchTrainers);
  
      const openFitnessPage = () => {
        window.open('https://www.fitness.com.hr/', '_blank');
      };
  
      const openFitPage = () => {
        window.open('https://budi-fit.hr/fitness-blog/', '_blank');
      };
  
      const openFitkaPage = () => {
        window.open('https://fitka.hr/', '_blank');
      };
   // metoda za spremanje odabranog trenera
      const submitForm = async () => {
    console.log('submitForm is called'); 
    const selectedTrainer = selectedOption.value;
  
    console.log('selectedTrainer', selectedTrainer); 
  
    if (authInstance.currentUser) {
      const clientId = authInstance.currentUser.uid;
      const clientDoc = await getDoc(doc(db, 'Klijenti', clientId));
      const clientData = { ...clientDoc.data() }; 
  
      console.log('clientData', clientData); 
  
      try {
        await addDoc(collection(db, 'Treneri', selectedTrainer.id, 'Clients'), clientData);
      } catch (error) {
        console.error('Error adding client to trainer:', error);
      }
    } else {
      console.error('User is not authenticated');
    }
  };
      return {
        slide: ref(1),
        selectedOption,
        options,
        openFitnessPage,
        openFitPage,
        openFitkaPage,
        submitForm,
        body1: 'Postavite ciljeve: Postavljanje ciljeva može vam pomoći da se usredotočite i motivirate. Ciljevi bi trebali biti specifični, mjerljivi, ostvarivi, relevantni i vremenski ograničeni.',
      body2: 'Uključite raznolikost u svoj trening: Uključivanje različitih aktivnosti u svoj trening može vam pomoći da izbjegnete dosadu i poboljšate svoju kondiciju. Možete isprobati različite vrste vježbi poput kružnog treninga ili intervalnog treninga visokog intenziteta.'
      };
    },
  };
  </script>
  
  <style> 
  .ikonanavrhu {
    width: 50px;
    height: 50px;
    color: white;
  } 
  
  .vrh {
    border-style: solid;
    color: rgb(255, 255, 255);
    size: 2px;
  } 
  
  .note-form-container {
    display: center;
    justify-content: flex-end;
    flex-grow: 1;
  }
  .footer{
    background-color: rgba(2, 122, 227, 0.831);
  height: 50px;
  }
  
  
  </style>