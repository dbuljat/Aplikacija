<template>
    <div class="q-pa-md">
      <q-select
        filled
        v-model="selectedDay"
        :options="dayOptions"
        label="Odaberite dan"
        emit-value
        map-options
        class="q-mb-md"
        @input="fetchExercises"
      />
   
      <q-table
        v-if="exercises.length > 0"
        :rows="exercises"
        :columns="columns"
        row-key="name"
        class="full-width"
      >
        <template v-slot:body-cell-image="props">
          <q-td :props="props">
            <img :src="props.row.imageUrl" alt="Exercise" style="width: 500px; height: 500px;">
          </q-td>
        </template>
      </q-table>
    </div>
  </template>
   
  <script>
  import { ref, watch, onMounted } from 'vue';
  import { db } from 'boot/firebase';
  import { collection, getDocs, query, where } from 'firebase/firestore';
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
      const auth = getAuth();
      const user = auth.currentUser;
      const programId = ref(null);
      const selectedDay = ref(null);
      const exercises = ref([]);
   
      const dayOptions = ref([
        { label: 'Ponedjeljak', value: 'Ponedjeljak' },
        { label: 'Utorak', value: 'Utorak' },
        { label: 'Srijeda', value: 'Srijeda' },
        { label: 'Četvrtak', value: 'Cetvrtak' },
        { label: 'Petak', value: 'Petak' },
        { label: 'Subota', value: 'Subota' },
        { label: 'Nedjelja', value: 'Nedjelja' },
      
      ]);
   
      const columns = [
        { name: 'name', label: 'Naziv vježbe', field: 'name', align: 'left', sortable: true },
        { name: 'description', label: 'Opis vježbe', field: 'description', align: 'left', sortable: true },
        { name: 'image', label: 'Slika', field: 'image', align: 'center', sortable: false }
      ];
     // metoda za dohvaćanje ID klijenta u podkolekciji Clients
      const getClientIdInTrainerSubcollection = async (email) => {
        const trainersRef = collection(db, 'Treneri');
        const querySnapshot = await getDocs(trainersRef);
        let clientIdInTrainerSubcollection = '';
   
        for (const trainerDoc of querySnapshot.docs) {
          const clientsRef = collection(db, 'Treneri', trainerDoc.id, 'Clients');
          const clientsSnapshot = await getDocs(clientsRef);
   
          clientsSnapshot.forEach((clientDoc) => {
            if (clientDoc.data().email === email) {
              clientIdInTrainerSubcollection = clientDoc.id;
            }
          });
   
          if (clientIdInTrainerSubcollection) {
            break;
          }
        }
   
        if (!clientIdInTrainerSubcollection) {
          throw new Error(`No client found in the Clients subcollection with the email: ${email}`);
        }
   
        return clientIdInTrainerSubcollection;
      };
   // metoda za dohvaćanje vježbi za odabrani dan 
      const fetchExercises = async (day) => {
        console.log("Fetching exercises for day:", day, "and program ID:", programId.value);
        if (day && programId.value) {
          try {
            const dayRef = collection(db, `programi/${programId.value}/${day}`);
            const exercisesSnapshot = await getDocs(dayRef);
            exercises.value = exercisesSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            console.log("Exercises fetched:", exercises.value);
          } catch (err) {
            console.error("Error fetching exercises:", err);
          }
        }
      };
   // pokreće se fetchExercises kad se promijeni selectedDay
      watch(selectedDay, fetchExercises);
   // provjerava se postoji li korisnik, zatim dohvaća ID klijenta na temelju emaila. Zatim se pretražuje postoji li program
      onMounted(async () => {
        if (user) {
          try {
            const clientId = await getClientIdInTrainerSubcollection(user.email);
            const programsQuery = query(collection(db, "programi"), where("clientId", "==", clientId));
            const programsSnapshot = await getDocs(programsQuery);
   
            if (!programsSnapshot.empty) {
              programId.value = programsSnapshot.docs[0].id;
              console.log("Program ID set to:", programId.value);
            }
          } catch (err) {
            console.error(err.message);
          }
        }
      });
   
      return {
        selectedDay,
        exercises,
        dayOptions,
        columns
      };
    }
  };
  </script>