<template>
  <q-page padding :style="{ maxWidth: '1200px', margin: '0 auto' }">
    <q-card>
      <!-- Trainer Info sekcija -->
      <q-card-section class="row items-center">
        <q-avatar>
          <img :src="trainerInfo.avatarUrl || defaultAvatar">
        </q-avatar>
        <div class="text-h6 q-ml-sm">
          {{ trainerInfo.ime_korisnika }} {{ trainerInfo.prezime_korisnika }}
        </div>
      </q-card-section>

      <q-separator />

      <!-- Chat Messages sekcija -->
      <q-card-section class="chat-window">
        <div v-for="message in messages" :key="message.id" class="q-mb-md">
          <div v-bind:class="getMessageClass(message.sender)">
            <!-- Prikaz imena pošiljatelja -->
            <span class="message-header">
              {{ message.sender === 'client' ? clientInfo.ime_korisnika.split(' ')[0] : trainerInfo.ime_korisnika.split(' ')[0] }}:
            </span>
            <q-chip outline :color="getMessageColor(message.sender)">
              {{ message.content }}
            </q-chip>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <!-- Message Input sekcija -->
      <q-card-section>
        <q-form @submit.prevent="sendMsg" class="row q-gutter-sm">
          <q-input
            filled
            v-model="newMsg"
            type="text"
            placeholder="Type a message..."
            class="col-grow"
          />
          <q-btn icon="send" type="submit" color="primary" />
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { db } from 'boot/firebase';
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
  getDocs
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default {
  data() {
    
    return {
      newMsg: '',
      messages: [],
      clientId: '',
      trainerId: '',
      defaultAvatar: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
      trainerInfo: {
        ime_korisnika: '',
        prezime_korisnika: '',
        avatarUrl: '',
        shape: ''
      },
      clientInfo: {
        ime_korisnika: '',
        prezime_korisnika: '',
        avatarUrl: '',
        shape: ''
      }
    };
  },
  beforeMount() {
    const isReloaded = localStorage.getItem('isReloaded');
    if (!isReloaded) {
      localStorage.setItem('isReloaded', 'true');
      location.reload();
    } else {
      localStorage.removeItem('isReloaded');
    }
  },
  async mounted() {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      await this.getClientIdInTrainerSubcollection(user.email);
      if (this.trainerId) {
        await this.fetchTrainerInfo();
        await this.fetchClientInfo();
        this.listenForMessages();
      }
    } else {
      console.log('No user is signed in.');
    }
  },
  methods: {
    // metoda koja pretražuje kolekciju Treneri kako bi pronašla klijenta s određenim emailom u podkolekciji
    // Clients, ako pronađe odg. klijenta, postavlja clientId i trainerId
    async getClientIdInTrainerSubcollection(email) {
      const trainersRef = collection(db, 'Treneri');
      const querySnapshot = await getDocs(trainersRef);

      for (const doc of querySnapshot.docs) {
        const clientsRef = collection(db, 'Treneri', doc.id, 'Clients');
        const clientsSnapshot = await getDocs(clientsRef);

        for (const clientDoc of clientsSnapshot.docs) {
          if (clientDoc.data().email === email) {
            this.clientId = clientDoc.id;
            this.trainerId = doc.id;
            return;
          }
        }
      }

      console.error(`No client found in the Clients subcollection with the email: ${email}`);
    },
    // metoda dohvaća informacije o treneru iz baze podataka
    async fetchTrainerInfo() {
      const trainerRef = doc(db, 'Treneri', this.trainerId);
      const docSnap = await getDoc(trainerRef);
      if (docSnap.exists()) {
        const trainerData = docSnap.data();
        this.trainerInfo.ime_korisnika = trainerData.ime_korisnika;
        this.trainerInfo.prezime_korisnika = trainerData.prezime_korisnika;
        this.trainerInfo.shape = trainerData.shape;
        this.trainerInfo.avatarUrl = this.getAvatarUrl(trainerData.shape);
      } else {
        console.log('No such trainer!');
      }
    },
    // metoda dohvaća informacije o klijentu iz baze podataka 
    async fetchClientInfo() {
      const clientRef = doc(db, 'Treneri', this.trainerId, 'Clients', this.clientId);
      const docSnap = await getDoc(clientRef);
      if (docSnap.exists()) {
        const clientData = docSnap.data();
        this.clientInfo.ime_korisnika = clientData.ime_korisnika;
        this.clientInfo.prezime_korisnika = clientData.prezime_korisnika;
        // Ostali podaci o klijentu, ako su potrebni
      } else {
        console.log('No such client!');
      }
    },
    // metoda prikazuje avatar ovisno o spolu 
    getAvatarUrl(shape) {
      if (shape === 'Muško') {
        return 'https://cdn.quasar.dev/img/boy-avatar.png';
      } else if (shape === 'Žensko') {
        return 'https://img.freepik.com/premium-vector/face-cute-girl-avatar-young-girl-portrait-vector-flat-illustration_192760-82.jpg?w=2000';
      } else {
        return this.defaultAvatar;
      }
    },
    // metoda se poziva kada korisnik želi poslati novu poruku
    async sendMsg() {
      if (this.newMsg.trim() !== '') {
        const conversationRef = collection(db, 'Treneri', this.trainerId, 'Clients', this.clientId, 'Messages');
        await addDoc(conversationRef, {
          sender: 'client',
          content: this.newMsg,
          createdAt: serverTimestamp()
        });
        this.newMsg = '';
      }
    },
    // metoda prati promjene u char porukama tako da se korisnicima prikazuju nove poruke čim se pojave
    listenForMessages() {
      if (!this.trainerId || !this.clientId) {
        console.error('Trainer or Client ID is not set');
        return;
      }
      const messagesRef = collection(db, 'Treneri', this.trainerId, 'Clients', this.clientId, 'Messages');
      const messagesQuery = query(messagesRef, orderBy('createdAt', 'asc'));
      onSnapshot(messagesQuery, (snapshot) => {
        this.messages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
      });
    },
    // metoda koja ovisno o vrijednosti sendera stavlja poruku lijevo ili desno
    getMessageClass(sender) {
      return sender === 'client' ? 'flex flex-end text-right' : 'flex flex-start';
    },
    getMessageColor(sender) {
      return sender === 'client' ? 'primary' : 'secondary';
    }
  }
};
</script>

<style scoped>
.chat-window {
  background: #f2f2f2;
  height: 500px; /* Fixed height */
  overflow-y: auto;
}

.flex {
  display: flex;
  align-items: center;
}

.flex-start {
  justify-content: flex-start;
}

.flex-end {
  justify-content: flex-end;
}

.message-header {
  margin-bottom: 4px;
  font-weight: bold;
}

.q-chip {
  max-width: 80%;
  word-break: break-word;
}

/* Styling for client's messages */
.client-chip {
  background: #027be3;
  color: white;
}
</style>
