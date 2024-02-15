<template>
  <q-page padding :style="{ maxWidth: '1200px', margin: '0 auto' }">
    <q-card>
      <!-- Client Info sekcija -->
      <q-card-section class="row items-center">
        <q-avatar>
          <img :src="clientInfo.avatarUrl || defaultAvatar">
        </q-avatar>
        <div class="text-h6 q-ml-sm">
          {{ clientInfo.ime_korisnika }} {{ clientInfo.prezime_korisnika }}
        </div>
      </q-card-section>

      <q-separator />

       <!-- Chat Messages sekcija -->
       <q-card-section class="chat-window">
    <div v-for="message in messages" :key="message.id" class="q-mb-md">
      <div v-bind:class="getMessageClass(message.sender)">
        <span class="message-header">
  {{ message.sender === 'client' && clientInfo ? clientInfo.ime_korisnika.split(' ')[0] : '' }}
  {{ message.sender !== 'client' && trainerInfo ? trainerInfo.ime_trenera : '' }}:
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
  getDoc
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
        ime_trenera: '',
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
      this.trainerId = user.uid;
      await this.fetchTrainerInfo();
      this.clientId = this.$route.params.id;
      await this.fetchClientInfo();
      this.listenForMessages();
    } else {
      console.log('No user is signed in.');
    }
  },
  methods: {
    // dohvaća informacije o treneru iz baze, ako dokument postoji, dohvaća se ime trenera
    async fetchTrainerInfo() {
      const trainerRef = doc(db, 'Treneri', this.trainerId);
      const docSnap = await getDoc(trainerRef);
      if (docSnap.exists()) {
        const trainerData = docSnap.data();
        this.trainerInfo.ime_trenera = trainerData.ime_korisnika;
      } else {
        console.log('No such trainer!');
      }
    },
    // funkcija koja vraća URL na temelju spola klijenta
    getAvatarUrl(shape) {
      if (shape === 'Muško') {
        return 'https://cdn.quasar.dev/img/boy-avatar.png';
      } else if (shape === 'Žensko') {
        return 'https://img.freepik.com/premium-vector/face-cute-girl-avatar-young-girl-portrait-vector-flat-illustration_192760-82.jpg?w=2000';
      } else {
        return this.defaultAvatar;
      }
    },
    // metoda koja se aktivira kada trener šalje poruku
    async sendMsg() {
      if (this.newMsg.trim() !== '') {
        const conversationRef = collection(db, 'Treneri', this.trainerId, 'Clients', this.clientId, 'Messages');
        await addDoc(conversationRef, {
          sender: 'trainer',
          content: this.newMsg,
          createdAt: serverTimestamp()
        });
        this.newMsg = '';
      }
    },
    // metoda koja postavlja slušatelja na Firestore kolekciju Messages kako bi se u stvarnom vremenu ažurirale poruke između trenera i klijenta
    listenForMessages() {
      const messagesRef = collection(db, 'Treneri', this.trainerId, 'Clients', this.clientId, 'Messages');
      const messagesQuery = query(messagesRef, orderBy('createdAt', 'asc'));
      onSnapshot(messagesQuery, (snapshot) => {
        this.messages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
      });
    },
    // metoda koja dohvaća informacije o klijentu na temelju clientId i TrainerId. 
    async fetchClientInfo() {
      const clientRef = doc(db, 'Treneri', this.trainerId, 'Clients', this.clientId);
      const docSnap = await getDoc(clientRef);
      if (docSnap.exists()) {
        const clientData = docSnap.data();
        this.clientInfo.ime_korisnika = clientData.ime_korisnika;
        this.clientInfo.prezime_korisnika = clientData.prezime_korisnika;
        this.clientInfo.shape = clientData.shape;
        this.clientInfo.avatarUrl = this.getAvatarUrl(clientData.shape) || this.defaultAvatar;
      } else {
        console.error('No such client!');
      }
    },
    // metoda za stiliziranje poruka u chatu, ako trener šalje, onda je s desne strane, ako šalje klijent onda je s lijeve
    getMessageClass(sender) {
  return sender === 'trainer' ? 'flex flex-end text-right' : 'flex flex-start';
},
// metoda za određivanje boje 
    getMessageColor(sender) {
    return sender === 'client' ? 'primary' : 'secondary';
  },
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

/* Styling for trainer's messages */
.trainer-chip {
  background: #027be3;
  color: white;
}
</style>
