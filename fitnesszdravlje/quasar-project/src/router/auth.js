import { getAuth, onAuthStateChanged } from 'firebase/auth';

const auth = getAuth(); // Instanca provjere autentičnosti

// Pregledava ako je korisnik logiran
export function isLoggedIn() {
  return auth.currentUser !== null;
}

// zahtijeva autentifikaciju za zaštićene rute
export function requireAuth(to, from, next) {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      // Korisnik je autenticiran, dopušta pristup rutama
      next();
    } else {
      // Korisnik nije autenticiran i prebacuje ga na login
      next('/login');
    }
    unsubscribe();
  });
}