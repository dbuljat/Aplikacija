<template>
    <q-page class="row items-start q-pa-md justify-center">
      <div class="form-container col-12 col-md-6 q-pa-md q-gutter-sm" style="border-radius: 10px; background: #fff; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <div class="form-header text-h6 text-center" style="color: #027be3;">Ažuriranje Programa Vježbi</div>
       
        <q-form class="q-gutter-md">
          <q-select
            filled
            v-model="selectedProgramId"
            :options="programsOptions"
            label="Odaberite program"
            emit-value
            map-options
            class="q-mb-md"
            @update:model-value="fetchProgramDetails"
          />
   
          <q-input filled v-model="selectedProgram.name" label="Naziv programa" class="q-mb-md" />
          <q-input filled v-model="selectedProgram.description" label="Opis programa" type="textarea" class="q-mb-md" />
   
          <div class="text-center q-pt-md">
            <q-btn label="Ažuriraj" color="primary" class="q-mr-md" @click="updateProgram" />
            <q-btn label="Obriši" color="negative" @click="deleteProgram" />
          </div>
        </q-form>
      </div>
    </q-page>
  </template>
   
  <script>
  import { ref, onMounted } from 'vue';
  import { db } from 'boot/firebase';
  import { collection, getDocs, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
  import { useRoute, useRouter } from 'vue-router';
   
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
      const programsOptions = ref([]);
      const selectedProgramId = ref('');
      const selectedProgram = ref({ name: '', description: '' });
      const route = useRoute();
      const router = useRouter();
   
      onMounted(async () => {
        await fetchPrograms();
      });
    // dohvaća sve dostupne programe vježbanja iz baze podataka za popunjavanje dropdowma
      const fetchPrograms = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, "programi"));
          programsOptions.value = querySnapshot.docs.map(doc => ({ label: doc.data().name, value: doc.id }));
        } catch (error) {
          console.error("Error fetching programs:", error);
        }
      };
   // kada se odabere program, dohvaća detalje tog programa za prikaz u formu
      const fetchProgramDetails = async (programId) => {
        const docRef = doc(db, "programi", programId);
        try {
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            selectedProgram.value = {
              name: docSnap.data().name,
              description: docSnap.data().description
            };
          } else {
            console.log("No such document!");
            selectedProgram.value = { name: '', description: '' };
          }
        } catch (error) {
          console.error("Error fetching program details:", error);
        }
      };
   // ažurira odabrani program vježbanja u bazi podataka s novim informacijama
      const updateProgram = async () => {
    if (!selectedProgram.value.name || !selectedProgram.value.description) {
      console.error('All fields must be filled out to continue.');
      return;
    }
    try {
      const docRef = doc(db, "programi", selectedProgramId.value);
      await updateDoc(docRef, {
        name: selectedProgram.value.name,
        description: selectedProgram.value.description
      });
      console.log("Program updated successfully");
   
      const clientId = route.params.id;
      if (!clientId) {
        console.error('No clientId provided.');
        return;
      }
   
      router.push({
        name: 'TrenerAzuriranjeVjezbiUProgramuBrisanje',
        params: {
          clientId: clientId,
          programId: selectedProgramId.value
        }
      });
    } catch (error) {
      console.error("Error updating program:", error);
    }
  };
  // briše odabrani program vježbanja, uključujući sve vježbe povezane s tim programom za svaki dan u tjednu
      const deleteProgram = async () => {
        if (!selectedProgramId.value) {
          console.error('No program ID provided. Cannot delete program.');
          return;
        }
   
        try {
          const programDocRef = doc(db, 'programi', selectedProgramId.value);
   
          // Definiranje dana u tjednu i iterativno brisanje svih vježbi unutar svakog dana
          const days = ['Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak', 'Subota', 'Nedjelja'];
          for (const day of days) {
            const dayCollectionRef = collection(programDocRef, day);
            const exercisesSnapshot = await getDocs(dayCollectionRef);
            for (const exerciseDoc of exercisesSnapshot.docs) {
              await deleteDoc(doc(dayCollectionRef, exerciseDoc.id));
            }
          }
   
          selectedProgramId.value = '';
          selectedProgram.value = { name: '', description: '' };
          await fetchPrograms();
   
          await deleteDoc(programDocRef);
          console.log('Program and all its subcollections deleted successfully');
        } catch (error) {
          console.error('Error deleting program and its subcollections:', error);
        }
      };
   
      return {
        programsOptions,
        selectedProgramId,
        selectedProgram,
        fetchProgramDetails,
        updateProgram,
        deleteProgram
      };
    }
  };
  </script>