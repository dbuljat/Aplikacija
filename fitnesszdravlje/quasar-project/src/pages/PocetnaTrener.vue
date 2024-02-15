<template>
       <q-header reveal elevated class="vrh" >
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
                            <img  src="https://icons.veryicon.com/png/128/business/color-round-office-icon/home-477.png">
                        </q-icon>
                        </q-item-section>
                        <q-item-section>
                            <h5>Home</h5>
                        </q-item-section>
                    </q-item>
        </q-header>
            <div style="display:flex; justify-content: space-between;">
</div>
            <div class="q-pa-md row items-start q-gutter-md ">
  </div>
  <q-card class="my-card">
    <q-carousel
      animated
      v-model="slide"
      arrows
      navigation
      infinite
    >
      <q-carousel-slide :name="1" img-src="https://cdn.wallpapersafari.com/40/97/4jmHRy.jpg" />
      <q-carousel-slide :name="2" img-src="https://wallpaper.dog/large/20480587.jpg" />
      <q-carousel-slide :name="3" img-src="https://trumpwallpapers.com/wp-content/uploads/Workout-Wallpaper-08-2560-x-1440.jpg" />
      <q-carousel-slide :name="4" img-src="https://i.pinimg.com/originals/42/78/9a/42789a46eb0f94b196d90252c08baff2.jpg" />
    </q-carousel>
      <q-card-section>
        <div class="text-h6">Train insane or remain the same</div>
        <div class="text-subtitle2"></div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <div class="text-h5">Odaberite aktivnost koju volite! To može biti bilo što od trčanja i hodanja do dizanja utega i plesa.</div>
      </q-card-section>
    </q-card>
  <div class="q-pa-md example-row-stacked-to-horizontal">
<div class="row">
  <div class="col-12 col-md"><q-card class="my-card" border flat bordered style="max-width: 1000px;">
      <q-img src="https://static.vecteezy.com/system/resources/previews/003/456/055/non_2x/fitness-club-logo-vector.jpg" />
      <q-card-section>
        <div class="text-overline text-orange-9">https://www.fitness.com.hr/</div>
        <div class="text-h5 q-mt-sm q-mb-xs">Najveći fitness portal u Hrvatskoj</div>
        <div class="text-caption text-grey">
            Najveći fitness portal u Hrvatskoj. Svakodnevno pratite naše stručne savjete vezano za vježbanje, zdravu prehranu, mršavljenje i zdravlje.
        </div>
      </q-card-section>
      <q-card-actions>
        <q-btn flat color="primary" @click="openFitnessPage" label="Otvori" />
        <q-space />
      </q-card-actions>
      <q-slide-transition>
        <div v-show="expanded">
          <q-separator />
          <q-card-section class="text-subitle2">
            {{ lorem }}
          </q-card-section>
        </div>
      </q-slide-transition>
    </q-card></div>
  <div class="col-12 col-md">
            <div class="q-pa-md row items-start q-gutter-md ">
    <div class="note-form-container">
    <q-card class="q-my-md" position="center">

      <q-card-section>
        <h3 style="text-align:center; margin-right: 650px;">Bilješke</h3>
        <q-input v-model="noteTitle" label="Unesite naslov..." :rules="runValidation ? [val => !!val || 'Naslov je obavezan'] : []"> </q-input>
  <q-input v-model="noteContent" label="Unesite sadržaj..." type="textarea" :rules="runValidation ? [val => !!val || 'Sadržaj je obavezan'] : []"></q-input>
  <q-btn :disabled="!noteTitle || !noteContent" @click="saveNote" color="primary">Spremi bilješku</q-btn>
      </q-card-section>

      <q-table
  :rows="notes.sort((a, b) => b.id - a.id)"
  :columns="columns"
  row-key="id">
  <template v-slot:body-cell-edit="props">
    <q-td class="text-center">
      <q-btn color="primary" dense icon="edit" @click="editNote(props.row.id)" />
    </q-td>
  </template>
  <template v-slot:body-cell-delete="props">
    <q-td class="text-center">
      <q-btn color="negative" dense icon="delete" @click="deleteNote(props.row.id)" />
    </q-td>
  </template>
</q-table>

    </q-card>
  </div>
  </div> 
</div>
</div>
</div>
  <div class="q-pa-md row items-start q-gutter-md cards-container" style="display: flex; flex-wrap: wrap; align-items: stretch;">
  <div style="flex: 1; max-width: 1000px; margin-right: 16px;">
    <q-card class="my-card" flat bordered>
      <q-img
        src="https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?cs=srgb&dl=pexels-victor-freitas-841130.jpg&fm=jpg"
      />

      <q-card-section>
        <div class="text-overline text-orange-9">https://budi-fit.hr/fitness-blog/</div>
        <div class="text-h5 q-mt-sm q-mb-xs">Budi fit!</div>
        <div class="text-caption text-grey">
          U fitness blogu pročitajte savjete, informacije i razmišljanja o temama o fitnessu ali i drugim aspektima života. Motivirajmo jedni druge!
        </div>
      </q-card-section>
      <q-card-actions>
        <q-btn flat color="primary" @click="openFitPage" label="Otvori" />
        <q-space />
      </q-card-actions>
      <q-slide-transition>
        <div v-show="expanded">
          <q-separator />
          <q-card-section class="text-subitle2">
            {{ lorem }}
          </q-card-section>
        </div>
      </q-slide-transition>
    </q-card>
  </div>
  <div style="flex: 1; max-width: 1000px;">
    <q-card class="my-card" flat bordered>
      <q-img
        src="https://w0.peakpx.com/wallpaper/491/727/HD-wallpaper-mediterranean-diet-diet-mediterranean-habits-entertainment-healthy-lifestyle-pyramid-healthy-food.jpg"
      />
      <q-card-section>
        <div class="text-overline text-orange-9">https://fitka.hr/</div>
        <div class="text-h5 q-mt-sm q-mb-xs">Fitka</div>
        <div class="text-caption text-grey">
          Web stranicu o fitnessu i prehrani – po tvojoj jedinstvenoj mjeri. Za osjećaj da te tijelo ne sputava već ti omogućava ti da živiš i radiš ono što voliš. Punom snagom i najvećim intenzitetom!
        </div>
      </q-card-section>
      <q-card-actions>
        <q-btn flat color="primary" @click="openFitkaPage" label="Otvori" />
        <q-space />
      </q-card-actions>
      <q-slide-transition>
        <div v-show="expanded">
          <q-separator />
          <q-card-section class="text-subitle2">
            {{ lorem }}
          </q-card-section>
        </div>
      </q-slide-transition>
    </q-card>
  </div>
</div>
<q-card>
  <q-card-section>
  </q-card-section>
</q-card>
</template>

<script>
import { addDoc, collection, onSnapshot, updateDoc, doc, deleteDoc, getDoc, getDocs } from "firebase/firestore";
import { db } from "boot/firebase.js";
import { ref, watchEffect, onMounted } from 'vue';
import { useAuth, } from 'boot/firebase'
import { getAuth, onAuthStateChanged } from 'firebase/auth';

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
  data() {
    const { user } = useAuth()
    return {
      notes: [],
      columns: [
        { name: "title", required: true, label: "Naslov", align: "left", field: "title", sortable: true },
        { name: "content", align: "left", label: "Sadržaj", field: "content", sortable: true },
        { name: "edit", label: "", align: "center", sortable: false },
        { name: "delete", label: "", align: "center", sortable: false }
      ],
      noteTitle: "",
      noteContent: "",
      editNoteId: null,
      user: null, 
      slide: ref(1)
    };
  },
  created() {
  const auth = getAuth();
  // metoda za dohvaćanje bilješki prijavljenog trenera
  onAuthStateChanged(auth, (user) => {
    if (user) {
      this.user = user; 
      const userId = user.uid;
      const notesCollectionRef = collection(db, `Treneri/${userId}/notes`);
      onSnapshot(notesCollectionRef, (snapshot) => {
        const notes = [];
        snapshot.forEach((doc) => {
          const note = doc.data();
          note.id = doc.id;
          notes.push(note);
        });
        this.notes = notes;
      });
    }
  });
},

  methods: {
// metoda koja sprema ili ažurira bilješku trenera
    async saveNote() {
  this.runValidation = true;
 
  if (!this.noteTitle || !this.noteContent) {
    return;
  }

  if (!this.user || !this.user.uid) {
    
    return;
  }

  const userId = this.user.uid;
  let noteRef;
  const newNote = {
    title: this.noteTitle,
    content: this.noteContent,
  };

  
  if (this.editNoteId) {
    noteRef = doc(db, `Treneri/${userId}/notes`, this.editNoteId);
  } else {
    
    noteRef = await addDoc(collection(db, `Treneri/${userId}/notes`), newNote);
    console.log("Note added with ID: ", noteRef.id);
  }

  try {
    
    await updateDoc(noteRef, {
      title: this.noteTitle,
      content: this.noteContent,
    });

   
    const existingNoteIndex = this.notes.findIndex(
      (note) => note.id === noteRef.id
    );
    if (existingNoteIndex !== -1) {
      this.notes[existingNoteIndex].title = this.noteTitle;
      this.notes[existingNoteIndex].content = this.noteContent;
    } else {
      newNote.id = noteRef.id;
      this.notes.push(newNote);
    }

    this.noteTitle = "";
    this.noteContent = "";
    this.editNoteId = null;
  } catch (error) {
    console.error("Error adding/editing document: ", error);
  }
  
  this.runValidation = false;
},
  // metoda koja briše odabranu bilješku trenera
    async deleteNote(id) {
    const userId = this.user.uid;

    
    this.notes = this.notes.filter(note => note.id !== id);

      try {
        const noteDocRef = doc(db, `Treneri/${userId}/notes`, id);
        await deleteDoc(noteDocRef);
        console.log("Document successfully deleted!");
      } catch (error) {
        console.error("Error removing document: ", error);
      }
    },
// postavlja trenutne vrijednosti za uređivanje postojeće bilješke
    async editNote (id) {
      try {
       
        const noteToEdit = this.notes.find(note => note.id === id);

     
        this.noteTitle = noteToEdit.title;
        this.noteContent = noteToEdit.content;

        
        this.editNoteId = id;
      } catch (error) {
        console.error("Error editing document: ", error);
      }
    },

    openFitnessPage() {
      window.open("https://www.fitness.com.hr/", "_blank");
    },
    openFitPage() {
      window.open("https://budi-fit.hr/fitness-blog/", "_blank");
    },
    openFitkaPage() {
      window.open("https://fitka.hr/", "_blank");
    },
  }
}
</script>

<style> 
.ikonanavrhu {
  width: 50px;
  height: 50px;
  color: white;
} 

.vrh {
  border-style: solid;
  color: rgb(255, 255, 255);
  size: 2px;
} 


.footer{
  background-color: rgba(2, 122, 227, 0.831);
height: 50px;
}
 
    .note-form-container {
  display: center;
  justify-content: flex-end;
  flex-grow: 1;
}
</style>