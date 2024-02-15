<template>
    <q-page padding>
      <!-- Header sa logom i imenom trenera -->
      <q-header elevated class="bg-primary text-white">
        <q-toolbar>
          <q-toolbar-title>
            <q-avatar>
              <img src="https://i.pinimg.com/originals/0c/3b/3a/0c3b3adb1a7530892e55ef36d3be6cb8.png">
            </q-avatar>
            Chat sustav
          </q-toolbar-title>
        </q-toolbar>
      </q-header>
  
      <!-- Lista klijenata -->
      <q-list bordered separator>
        <q-item-label header>Klijenti</q-item-label>
        <q-item v-for="client in clients" :key="client.id" clickable v-ripple @click="selectClient(client.id)">
          <q-item-section avatar>
            <q-avatar>
              <!-- Ovdje koristimo :src za dinamički prikaz avatara -->
              <img :src="client.avatar">
            </q-avatar>
          </q-item-section>
          <q-item-section>
            {{ client.name }}
          </q-item-section>
          <q-item-section side top>
            <q-btn flat icon="chat" @click.stop="startChatWithClient(client.id)" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-page>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { getAuth, onAuthStateChanged } from 'firebase/auth';
  import { collection, query, getDocs } from 'firebase/firestore';
  import { db } from 'boot/firebase';
  
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
      const clients = ref([]);
  
      // Asinkrona funkcija za dobivanje URL-a avatara
      const getAvatarUrl = async (shape) => {
        if (shape === 'Muško') {
          return 'https://cdn.quasar.dev/img/boy-avatar.png';
        } else if (shape === 'Žensko') {
          return 'https://img.freepik.com/premium-vector/face-cute-girl-avatar-young-girl-portrait-vector-flat-illustration_192760-82.jpg?w=2000';
        } else {
          // Placeholder URL za avatar ako spol nije poznat
          return 'https://via.placeholder.com/150';
        }
      };
  
      onMounted(async () => {
        const authInstance = getAuth();
        onAuthStateChanged(authInstance, async (user) => {
          if (user) {
            const trainerId = user.uid;
            const q = query(collection(db, 'Treneri', trainerId, 'Clients'));
            const querySnapshot = await getDocs(q);
            clients.value = await Promise.all(querySnapshot.docs.map(async (doc) => {
              const data = doc.data();
              const avatarUrl = await getAvatarUrl(data.shape);
              return {
                id: doc.id,
                name: `${data.ime_korisnika} ${data.prezime_korisnika}`,
                avatar: avatarUrl,
              };
            }));
          } else {
            clients.value = [];
          }
        });
      });
  
      const selectClient = (clientId) => {
        // Ova metoda može preusmjeriti na stranicu s detaljima klijenta ako je potrebno
        console.log(`Klijent ${clientId} odabran`);
      };
  
      const startChatWithClient = (clientId) => {
        console.log(`Početak chata s klijentom ${clientId}`);
        // Ažurirana metoda za navigaciju na stranicu 'ChatTrener'
        router.push({ name: 'ChatTrener', params: { id: clientId } });
      };
  
      return {
        clients,
        selectClient,
        startChatWithClient,
      };
    },
  };
  </script>
  