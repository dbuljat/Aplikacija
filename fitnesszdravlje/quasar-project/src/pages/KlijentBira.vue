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
        <h2>Trening</h2>
      </q-item>
    </q-toolbar>
  </q-header>
        
<div style="display:flex;">

  
  
  <router-link to="/klijent/KlijentProgramVjezbi">
      <div class="card-container">
        <q-card class="my-card" style="max-width: 3000px; margin: 50px 0 0 50px; background-color: #f2f2f2;">
          <q-img src="https://img.freepik.com/free-vector/cute-man-lifting-barbell-gym-cartoon-vector-icon-illustration-people-sport-icon-concept-isolated_138676-6223.jpg?w=2000" style="max-height: 3000px;">
            <div class="absolute-bottom text-h6 center">
              Program vježbi
            </div>
          </q-img>

          <q-card-section style="font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 50px; ">
           Ovdje možete vidjeti Vaš prilagođen plan vježbi!
          </q-card-section>
        </q-card>
      </div>
    </router-link>
    

      <router-link to="/klijent/KlijentPlanPrehrane">
      <div class="card-container">
        <q-card class="my-card" style="max-width: 3000px; margin: 50px 0 0 50px; background-color: #f2f2f2;">
          <q-img src="https://cdn-icons-png.flaticon.com/512/6774/6774898.png" style="max-height: 3000px;">
            <div class="absolute-bottom text-h6 center">
              Plan prehrane
            </div>
          </q-img>

          <q-card-section style="font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 50px; ">
            Ovdje možete vidjeti Vaš prilagođeni plan prehrane!
          </q-card-section>
        </q-card>
      </div>
    </router-link>
    


   
    <router-link to="/klijent/KlijentNapredak">
      <div class="card-container">
        <q-card class="my-card" style="max-width: 3000px; margin: 50px 0 0 50px; background-color: #f2f2f2;">
          <q-img src="https://cdn-icons-png.flaticon.com/512/6774/6774898.png" style="max-height: 3000px;">
            <div class="absolute-bottom text-h6 center">
              Napredak klijenta
            </div>
          </q-img>

          <q-card-section style="font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 50px; ">
            Ovdje možete bilježiti Vaš napredak na tjednoj bazi!
          </q-card-section>
        </q-card>
      </div>
    </router-link>
   
  </div>
</template>


<script>
export default{
  beforeMount() {
    const isReloaded = localStorage.getItem('isReloaded');
    if (!isReloaded) {
      localStorage.setItem('isReloaded', 'true');
      location.reload();
    } else {
      localStorage.removeItem('isReloaded');
    }
  },
}
</script>
<style>

.card-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>