import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { boot } from 'quasar/wrappers';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDmmjqiZlUeMmUjNqiFNythPg3sbZa7ZsI",
  authDomain: "fitnesizdravlje-e8bee.firebaseapp.com",
  projectId: "fitnesizdravlje-e8bee",
  storageBucket: "fitnesizdravlje-e8bee.appspot.com",
  messagingSenderId: "454980776112",
  appId: "1:454980776112:web:1607cbd18e6fb83bc5cb75",
  measurementId: "G-CERJ41B9P7"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const marcaTiempo = serverTimestamp();

export function useAuth() {
  
  const user = auth.currentUser;

  return { user };
}

export { db, auth, storage, collection, addDoc };

export default boot(({ app, store }) => {
  app.provide('firebase', { db, auth, collection, addDoc });

  
  onAuthStateChanged(auth, user => {
    if (user) {
      store.commit('setUser', user);
    } else {
      store.commit('setUser', null);
    }
  });
});
