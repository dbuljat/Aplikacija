import { requireAuth } from 'src/router/auth';

const routes = [
  {
    path: '/',
    redirect: '/login', 
  },
  {
    path: '/login',
    component: () => import('layouts/LayoutRegPrijava.vue'),
    children: [
      { path: '', component: () => import('pages/Prijava_m.vue') },
      { path: 'Registracija_m', component: () => import('pages/Registracija_m.vue') },
    ],
  },
  { 
    path: '/trener',
    component: () => import('layouts/MainLayout.vue'),
    beforeEnter: requireAuth,
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'TrenerovPopisKlijenta', component: () => import('pages/TrenerovPopisKlijenta.vue') },
      { path: 'PocetnaTrener', component: () => import('pages/PocetnaTrener.vue') },
      { path: 'TrenerVHunos', component: () => import('pages/TrenerVHunos.vue') },
      { path: 'TrenerVjezbeBaza', component: () => import('pages/TrenerVjezbeBaza.vue') },
      { path: 'MojProfilTrener', component: () => import('pages/MojProfilTrener.vue') },
      { path: 'TrenerHranaBaza', component: () => import('pages/TrenerHranaBaza.vue') },
      { path: 'TrenerBira/:id', component: () => import('pages/TrenerBira.vue'),  name: 'TrenerBira'  },
      { path: 'TrenerPodacioKlijentu/:id', component: () => import('pages/TrenerPodacioKlijentu.vue'), name: 'TrenerPodacioKlijentu'},
      { path: 'TrenerPP/:id', component: () => import('pages/TrenerPP.vue'), name: 'TrenerPP'},
      { path: 'TrenerPlanPrehranei/:clientId/:dietPlanId', component: () => import('pages/TrenerPlanPrehrane.vue'), name: 'TrenerPlanPrehrane' },
      { path: 'TrenerPV/:id', component: () => import('pages/TrenerPV.vue'), name: 'TrenerPV'},
      { path: 'TrenerProgramVjezbi/:clientId/:programId', component: () => import('pages/TrenerProgramVjezbi.vue'), name: 'TrenerProgramVjezbi' },
      { path: 'TrenerAzuriranjePVBrisanje/:id', component: () => import('pages/TrenerAzuriranjePVBrisanje.vue'), name: 'TrenerAzuriranjePVBrisanje' },
      { path: 'TrenerAzuriranjeVjezbiUProgramuBrisanje/:clientId/:programId', component: () => import('pages/TrenerAzuriranjeVjezbiUProgramuBrisanje.vue'), name: 'TrenerAzuriranjeVjezbiUProgramuBrisanje' },

      { path: 'TrenerAzuriranjePPBrisanje/:id', component: () => import('pages/TrenerAzuriranjePPBrisanje.vue'), name: 'TrenerAzuriranjePPBrisanje' },
      { path: 'TrenerAzuriranjeHraneUPlanu/:clientId/:dietPlanId', component: () => import('pages/TrenerAzuriranjeHraneUPlanu.vue'), name: 'TrenerAzuriranjeHraneUPlanu' },
       { path: 'TrenerUvidUKlijentovNapredak/:id', component: () => import('pages/TrenerUvidUKlijentovNapredak.vue'),  name: 'TrenerUvidUKlijentovNapredak'  },
       { path: 'NasKalkulator', component: () => import('pages/NasKalkulator.vue') },
       { path: 'ChatTrenerBira', component: () => import('pages/ChatTrenerBira.vue') },
       { path: 'ChatTrener/:id', component: () => import('pages/ChatTrener.vue'), name: 'ChatTrener' },
       { path: 'Nasa_Pomoc', component: () => import('pages/Nasa_Pomoc.vue') },
    ], 
  }, 
  {
  path: '/klijent',
  component: () => import('layouts/KlijentLayout.vue'),
  beforeEnter: requireAuth,
  children: [
    { path: 'PocetnaKlijent', component: () => import('pages/PocetnaKlijent.vue') },
    { path: 'MojProfilKlijent', component: () => import('pages/MojProfilKlijent.vue') },
    { path: 'KlijentBira', component: () => import('pages/KlijentBira.vue') },
    { path: 'KlijentPlanPrehrane', component: () => import('pages/KlijentPlanPrehrane.vue') },
    { path: 'KlijentProgramVjezbi', component: () => import('pages/KlijentProgramVjezbi.vue') },
    { path: 'KlijentNapredak', component: () => import('pages/KlijentNapredak.vue') },
    { path: 'NasKalkulator', component: () => import('pages/NasKalkulator.vue') },
    { path: 'ChatKlijent', component: () => import('pages/ChatKlijent.vue') },
    { path: 'Nasa_Pomoc', component: () => import('pages/Nasa_Pomoc.vue') },
  ]
},
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  }
] 

export default routes;