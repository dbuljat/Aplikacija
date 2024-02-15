<template>
  <q-page class="q-pa-md">
    <q-header elevated class="vrh">
      <q-toolbar>
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon class="ikonanavrhu">
              <img src="https://icons.veryicon.com/png/o/education-technology/distance-learning/calculator-196.png" />
            </q-icon>
          </q-item-section>
          <q-item-section>
            <h4>Kalkulator kalorija</h4>
          </q-item-section>
        </q-item>
      </q-toolbar>
    </q-header>

    <div class="q-gutter-md">
      <q-input outlined v-model="godine" label="Vaše godine" type="number" />
      <q-input outlined v-model="tezina" label="Vaša kilaža (kg)" type="number" />
      <q-input outlined v-model="visina" label="Vaša visina (cm)" type="number" />
      <q-select outlined v-model="spol" :options="spolovi" label="Spol" />
      <q-select outlined v-model="aktivnost" :options="aktivnosti" label="Aktivnost" />
      <q-select outlined v-model="cilj" :options="ciljevi" label="Vaš cilj" />
      <q-btn :disable="!formIsValid" label="Izračunaj kalorije" color="primary" @click="calculateCalories" />
      <q-card class="q-mt-md" v-if="kalorije !== null">
        <q-card-section>
          <div class="text-h6">Potreban vam je unos {{kalorije }} kalorija po danu</div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>

  <q-footer  class="footer">
    <q-toolbar>
      <q-toolbar-title>© 2024 Fitness i zdravlje
      </q-toolbar-title>
    </q-toolbar>
  </q-footer>
</template>

<script>
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
      godine: null,
      tezina: null,
      visina: null,
      spol: null,
      aktivnost: null,
      cilj: null,
      kalorije: null,
      aktivnosti: [
        { label: 'Loš', value: 1.2 },
        { label: 'Lagano aktivan', value: 1.375 },
        { label: 'Srednje akitvan', value: 1.55 },
        { label: 'Jako aktivan', value: 1.725 },
        { label: 'Ekstra aktivan', value: 1.9 },
      ],
      ciljevi: [
        { label: 'Izgubi težinu (1 kg/tjedno)', value: -1000 },
        { label: 'Izgubi težinu (0.5 kg/tjedno)', value: -500 },
        { label: 'Održavaj kilažu', value: 0 },
        { label: 'Povećaj kilažu (0.5 kg/tjedno)', value: 500 },
        { label: 'Povećaj kilažu (1 kg/tjedno)', value: 1000 },
      ],
      spolovi: [
        { label: 'Muškarac', value: 5 },
        { label: 'Žena', value: -161 },
      ],
    };
  },
  computed: {
    formIsValid() {
      return (
        this.godine &&
        this.tezina &&
        this.visina &&
        this.spol &&
        this.aktivnost &&
        this.cilj
      );
    },
  },
  methods: {
    calculateCalories() {
      // Harris-Benedict kalkulacija
      let bmr;
      if (this.spol.value === 5) {
        bmr = 88.362 + (13.397 * this.tezina) + (4.799 * this.visina) - (5.677 * this.godine);
      } else {
        bmr = 447.593 + (9.247 * this.tezina) + (3.098 * this.visina) - (4.33 * this.godine);
      }

      
      const kalorije = Math.round(bmr * this.aktivnost.value);

      
      this.kalorije = kalorije + this.cilj.value;
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

.ikonanavrhu {
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

.footer {
  background-color: rgba(2, 122, 227, 0.849);
  border: solid;
  color: rgb(245, 243, 243);
  size: 30px;
}

.glossy {
  margin-left: 125px;
  margin-right: 80px;
  margin-top: 20px;
  margin-bottom:20px;
}
</style>
