<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title style="text-align: center;">
          Fitness i zdravlje
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>
          Essential Links
        </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>

      <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
        <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">
          <q-list padding>
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon>
                  <img src="https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small/user-profile-icon-free-vector.jpg" />
                </q-icon>
              </q-item-section>

              <q-item-section>
                <router-link to="/trener/MojProfilTrener" class="text">
                  <div class="text">Moj profil</div>
                </router-link>
              </q-item-section>
            </q-item>

            <q-item active clickable v-ripple>
              <q-item-section avatar>
                <q-icon>
                  <img src="https://icons.veryicon.com/png/o/system/rounded-linear-icon/homepage-27.png" />
                </q-icon>
              </q-item-section>

              <q-item-section>
                <router-link to="/trener/PocetnaTrener" class="text">
                  <div class="text">Početna stranica</div>
                </router-link>
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon>
                  <img src="https://www.iconpacks.net/icons/2/free-storage-icon-1452-thumb.png" />
                </q-icon>
              </q-item-section>
              
              <q-item-section>
                <router-link to="/trener/TrenerVHunos" class="text">
                  <div class="text">Dodaj vježbu/hranu</div>
                </router-link>
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon>
                  <img src="https://cdn3.iconfinder.com/data/icons/ui-thick-outline-5-of-5/100/ui_09_of_10_-08-512.png" />
                </q-icon>
              </q-item-section>

              <q-item-section>
                <router-link to="/trener/TrenerovPopisKlijenta" class="text">
                  <div class="text">Klijenti</div>
                </router-link>
              </q-item-section>
            </q-item>

           
            
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="help" />
              </q-item-section>

              <q-item-section>
                <router-link to="/trener/Nasa_Pomoc" class="text">
                  <div class="text">Pomoć</div>
                </router-link>
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon>
                  <img src="https://icons.veryicon.com/png/o/education-technology/distance-learning/calculator-196.png" />
                </q-icon>
              </q-item-section>

              <q-item-section>
                <router-link to="/trener/NasKalkulator" class="text">
                  <div class="text text-grey-10">Kalkulator kalorija</div>
                </router-link>
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon>
                  <img src="https://logowik.com/content/uploads/images/chat3893.logowik.com.webp" />
                </q-icon>
              </q-item-section>

              <q-item-section>
                <router-link to="/trener/ChatTrenerBira" class="text">
                  <div class="text text-grey-10">Chat</div>
                </router-link>
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon>
                  <img src="https://icons.veryicon.com/png/o/education-technology/plush-three-year-old-icon-gallery/sign-out-7.png" />
                </q-icon>
              </q-item-section>

              <q-item-section>
                <router-link to="/login" class="text" @click="signOutUser">
                  <div class="text text-grey-10">Odjava</div>
                </router-link>
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
        <q-img
  class="absolute-top"
  src="https://cdn.quasar.dev/img/material.png"
  style="height: 150px;"
>
  <div class="absolute-bottom bg-transparent" style="display: flex; align-items: center;">
    <q-avatar size="80px" class="q-mb-sm" style="margin-left: 10px;">
      <img :src="avatarUrl">
    </q-avatar>
    <div style="margin-left: 10px; font-size: 24px;">
      <div class="text-weight-bold" style="font-size: 28px; color: black;">{{ ime_korisnika }}</div>
      <div style="font-size: 20px;">{{ email }}</div>
    </div>
  </div>
</q-img>

      </q-drawer>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>


<script>
import { defineComponent, ref, onMounted, watch } from 'vue';
import EssentialLink from 'components/EssentialLink.vue';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'vue-router';

const linksList = [
  // Essential Links array...
];

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  setup() {
    const ime_korisnika = ref('');
    const leftDrawerOpen = ref(false);
    const email = ref('');
    const router = useRouter();
    const user = ref(null);
    const avatarUrl = ref('');
    const shape = ref('');

    const getAvatarUrlAsync = async () => {
      if (shape.value === 'Muško') {
        return 'https://cdn.quasar.dev/img/boy-avatar.png';
      } else if (shape.value === 'Žensko') {
        return 'https://img.freepik.com/premium-vector/face-cute-girl-avatar-young-girl-portrait-vector-flat-illustration_192760-82.jpg?w=2000';
      } else {
        return 'https://default-avatar-url.com';
      }
    };

    onMounted(async () => {
      const auth = getAuth();
      onAuthStateChanged(auth, async (currentUser) => {
        user.value = currentUser;
        if (currentUser) {
          const userId = currentUser.uid;
          const db = getFirestore();
          const treneriRef = doc(db, 'Treneri', userId);
          const treneriSnap = await getDoc(treneriRef);

          if (treneriSnap.exists()) {
            ime_korisnika.value = treneriSnap.data().ime_korisnika;
            email.value = currentUser.email;
            shape.value = treneriSnap.data().shape;
          } else {
            console.log('No such document for Treneri!');
          }
        } else {
          console.log('No user is signed in.');
        }
      });
    });

    // Odjava prijavljenog korisnika
    const signOutUser = async () => {
      const auth = getAuth();
      try {
        await signOut(auth);
        console.log('User signed out successfully.');
        router.push('/login'); // Prebacivanje na login stranicu
      } catch (error) {
        console.error('Sign-out error:', error);
      }
    };

    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    };

    watch(shape, async (newValue) => {
      avatarUrl.value = await getAvatarUrlAsync();
    });

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      ime_korisnika,
      email,
      signOutUser,
      avatarUrl,
      toggleLeftDrawer,
    };
  },
});
</script>




<style>
.text {
  text-decoration: none;
}
</style>