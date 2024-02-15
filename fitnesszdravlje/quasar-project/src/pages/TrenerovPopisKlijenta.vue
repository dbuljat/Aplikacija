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
            <img src="https://cdn3.iconfinder.com/data/icons/ui-thick-outline-5-of-5/100/ui_09_of_10_-08-512.png">
          </q-icon>
        </q-item-section>
        <q-item-section>
          <h2>Popis klijenata</h2>
        </q-item-section>
      </q-item>
    </q-toolbar>
  </q-header>

  <q-table
:rows="clients"
:columns="columns"
row-key="id">
<template v-slot:body-cell-edit="props">
  <q-td class="text-center">
      <q-btn color="primary" dense icon="edit" @click="editClient(props.row.docId)" /> 
  </q-td>
</template>
<template v-slot:body-cell-delete="props">
  <q-td class="text-center">
      <q-btn color="negative" dense icon="delete" @click="deleteClient(props.row.docId)" />

  </q-td>
</template>
</q-table>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from 'boot/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
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
    const clients = ref([]);
    const router = useRouter();
    const columns = ref([
      { name: 'ime_korisnika', required: true, label: 'Ime klijenta', align: 'left', field: 'ime_korisnika' },
      { name: 'prezime_korisnika', required: true, label: 'Prezime klijenta', align: 'left', field: 'prezime_korisnika' },
      { name: 'kontakt_korisnika', required: true, label: 'Kontakt broj', align: 'left', field: 'kontakt_korisnika' },
      { name: 'edit', label: '', align: 'center', sortable: false },
      { name: 'delete', label: '', align: 'center', sortable: false }
    ]);
  // metoda za pushanje id dokumenta odabranog klijenta na slj stranicu
    const editClient = (docId) => {
    router.push({ name: 'TrenerBira', params: { id: docId } });
  };
// metoda za brisanje klijenta 
    const deleteClient = async (docId) => {
      const authInstance = getAuth();
      if (authInstance.currentUser) {
        const trainerId = authInstance.currentUser.uid;
        const clientRef = doc(db, 'Treneri', trainerId, 'Clients', docId);

        
        clients.value = clients.value.filter(client => client.docId !== docId);

        
        try {
          await deleteDoc(clientRef);
          console.log(`Client with docId: ${docId} has been successfully deleted`);
        } catch (error) {
          console.error('Error deleting client:', error);
        }
      }
    };

    let unsubscribe;  
  // dohvaćanje klijenata prijavljenog trenera
    onMounted(() => {
      const authInstance = getAuth();
      onAuthStateChanged(authInstance, (user) => {
        if (user) {
          const trainerId = user.uid;
          const clientCollection = collection(db, 'Treneri', trainerId, 'Clients');

          
          unsubscribe = onSnapshot(clientCollection, (snapshot) => {
            clients.value = snapshot.docs.map((doc) => {
              const data = doc.data();
              return { docId: doc.id, ...data };
            });
          });
        } else {
          
          clients.value = [];
        }
      });
    });

    onUnmounted(() => {
      if (unsubscribe) unsubscribe();  
    });

    return {
      clients,
      columns,
      deleteClient,
      editClient
    };
  },
};
</script>
