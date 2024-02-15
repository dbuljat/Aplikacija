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
            <img src="https://www.iconpacks.net/icons/2/free-storage-icon-1452-thumb.png">
          </q-icon>
        </q-item-section>
        <q-item-section>
          <h2> Unos podataka</h2>
        </q-item-section>
      </q-item>
    </q-toolbar>
  </q-header>

    <div class="q-pa-md row justify-center">
      
      <div class="row justify-center q-gutter-md">
  
        
        <q-card class="card-container" @click= "navigateToTrenerVjezbeBaza" style="width: 300px">
          <q-img src="https://img.freepik.com/free-vector/cute-man-lifting-barbell-gym-cartoon-vector-icon-illustration-people-sport-icon-concept-isolated_138676-6223.jpg?w=2000" style="height: 200px; object-fit: cover">
            <div class="absolute-bottom text-h6">
              Vježbe
            </div>
          </q-img>
          <q-card-section class="text-center" style="font-family: Arial, sans-serif; height: 50px;">
            Ovdje možete dodati nove vježbe u sustav
          </q-card-section>
        </q-card>
  
     
        <q-card class="card-container" @click="navigateToTrenerHranaBaza" style="width: 300px">
          <q-img src="https://cdn-icons-png.flaticon.com/512/6774/6774898.png" style="height: 200px; object-fit: cover">
            <div class="absolute-bottom text-h6">
              Hrana
            </div>
          </q-img>
          <q-card-section class="text-center" style="font-family: Arial, sans-serif; height: 50px;">
            Ovdje možete dodati novu hranu u sustav
          </q-card-section>
        </q-card>
  
      </div>
    </div>
  </template>
  
  
  <script>
  import { useRouter } from 'vue-router';
  
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
      const router = useRouter();
  
      const navigateToTrenerVjezbeBaza = () => {
        router.push({ path: '/trener/TrenerVjezbeBaza' });

      };
      const navigateToTrenerHranaBaza = () => {
        router.push({ path: '/trener/TrenerHranaBaza' }); 
      };
  
    
  
      return {
        navigateToTrenerVjezbeBaza,
        navigateToTrenerHranaBaza,
      };
    },
  };
  </script>
  
  <style>
  .bg-primary {
    background: #5e92f3; 
  }
  </style>
  