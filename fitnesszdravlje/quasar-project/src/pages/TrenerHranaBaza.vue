<template>
    <q-page class="flex flex-center">
      <div class="form-container">
        <div class="form-header text-h6 text-center q-py-md">Unos hrane</div>
    
        <q-form class="q-gutter-md" @submit="submitFood">
          <q-input filled v-model="food.name" label="Naziv hrane" class="q-mb-md" />
          <q-input filled v-model="food.description" label="Opis hrane" type="textarea" class="q-mb-md" />
          
          <div class="q-my-md">
            <q-uploader
              ref="uploader"
              class="uploader"
              flat
              bordered
              accept="image/*"
              auto-upload
              :factory="file => uploadImage(file)"
              @uploaded="handleUpload"
            />
          </div>
    
          <div class="text-center">
            <q-btn label="Spremi Hranu" type="submit" color="primary" class="full-width" :disabled="isSubmitButtonDisabled" />
          </div>
        </q-form>
      </div>
    </q-page>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { db, storage } from 'boot/firebase';
  import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
  import { collection, addDoc } from 'firebase/firestore';
  
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
      const food = ref({
        name: '',
        description: '',
        imageUrl: ''
      });
      
      const uploader = ref(null);
      const isUploading = ref(false);
      const isSubmitButtonDisabled = ref(true);
   //   Funkcija za učitavanje slike hrane u Firebase Storage
      const uploadImage = async (files) => {
  const file = files[0];
  if (!file) {
    console.error('No file is selected for upload.');
    isUploading.value = false; 
    return;
  }
  isUploading.value = true; 
  console.log('File name is:', file.name); 
  try {
    const imageRef = storageRef(storage, `food_images/${file.name}`);
    const snapshot = await uploadBytes(imageRef, file);
    const url = await getDownloadURL(snapshot.ref);
    console.log('Uploaded image URL is:', url); 
    food.value.imageUrl = url;
    isSubmitButtonDisabled.value = false; 
  } catch (error) {
    console.error('There was an error uploading the image:', error);
    isSubmitButtonDisabled.value = true; 
  } finally {
    isUploading.value = false; 
  }
};
    const handleUpload = (file) => {
       
      }; 
   // sprema informacije o hrani u bazu podataka 
      const submitFood = async () => {
        if (!food.value.name || !food.value.description || !food.value.imageUrl) {
          console.error('All fields must be filled.');
          return;
        }
        try {
          await addDoc(collection(db, 'hrana'), {
            name: food.value.name,
            description: food.value.description,
            imageUrl: food.value.imageUrl
          });
          console.log('Food has been saved successfully.');
          
          food.value = {
            name: '',
            description: '',
            imageUrl: ''
          };
          if (uploader.value) {
            uploader.value.reset();
          }
          isSubmitButtonDisabled.value = true;
        } catch (error) {
          console.error('There was an error saving the food:', error);
        }
      };
  
      return {
        food,
        uploadImage,
        submitFood,
        isSubmitButtonDisabled,
        uploader
      };
    }
  };
  </script>
<style>
.q-page {
  background-color: #ffffff;
}

.form-container {
  width: 100%;
  max-width: 700px;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.form-header {
  color: #5c6bc0;
  font-weight: bold;
}

.q-btn.full-width {
  width: 100%;
}

.q-uploader {
  width: 100%;
  max-width: 300px; 
  margin: auto;
}


.q-uploader__trigger {
  width: 100%; 
  margin: 0; 
}


.q-uploader__list {
  width: 100%; 
}


.q-uploader__progress {
  width: 100%; 
}


.q-uploader__file, .q-uploader__thumbnail {
  width: 100%; 
}


.q-uploader__file-name, .q-uploader__file-size {
  text-align: center;
}


.q-uploader__thumbnail, .q-uploader__thumbnail-container {
  margin: 0 auto; 
}
</style>
