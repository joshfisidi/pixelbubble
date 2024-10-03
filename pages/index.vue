<template>
  <div class="container">
    <header class="header">
      <h1 class="matemasie-regular">PixelBubble</h1>
      <p class="subtitle">Dive into a world of 3D and Pixel Art</p>
    </header>
    <nav class="navigation">
      <NuxtLink to="/">Home</NuxtLink>
      <NuxtLink to="/gallery">Gallery</NuxtLink>
      <button @click="openUploadPopup" class="upload-button">Upload</button>
      <NuxtLink to="/about">About</NuxtLink>
    </nav>
    
    <!-- Upload Popup -->
    <div v-if="isUploadPopupOpen" class="upload-popup-overlay">
      <div class="upload-popup">
        <h2>Upload Your Art</h2>
        <form @submit.prevent="handleUpload">
          <input type="file" @change="handleFileChange" accept="image/*" required>
          <input v-model="uploadTitle" type="text" placeholder="Title" required>
          <textarea v-model="uploadDescription" placeholder="Description"></textarea>
          <button type="submit" :disabled="!selectedFile">Upload</button>
        </form>
        <button @click="closeUploadPopup" class="close-button">Close</button>
      </div>
    </div>

    <!-- Centered Image -->
    <div class="centered-image-container">
      <img src="/public/logo.jpeg" alt="PixelBubble Logo" class="centered-image">
    </div>

    <!-- Image Gallery -->
    <div class="image-container">
      <div class="image-list" ref="imageList">
        <div v-for="image in sortedImages" :key="image.id" class="image-item">
          <img :src="image.url" :alt="image.name" class="gallery-image">
        </div>
      </div>
    </div>

    <main class="main-content">
      <p>Welcome to PixelBubble, your community hub for sharing and exploring amazing 3D and pixel art creations from artists around the globe.</p>
    </main>
    <footer class="footer">
      <p>&copy; {{ currentYear }} PixelBubble. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useHead } from '#imports';
import { useNuxtApp } from '#app';
import UploadPopup from '~/components/UploadPopup.vue';

useHead({
  title: 'PixelBubble - Share Your 3D and Pixel Art',
  meta: [
    {
      name: 'description',
      content: 'PixelBubble is a community platform for sharing and exploring 3D and pixel art.',
    },
    {
      name: 'keywords',
      content: 'PixelBubble, 3D art, pixel art, art sharing, digital art, community',
    },
  ],
});

const currentYear = new Date().getFullYear();
const images = ref([]);
const imageList = ref(null);
const isUploadPopupOpen = ref(false);
const selectedFile = ref(null);
const uploadTitle = ref('');
const uploadDescription = ref('');

const { $supabase } = useNuxtApp();

const sortedImages = computed(() => {
  return images.value.slice().sort((a, b) => a.name.localeCompare(b.name));
});

onMounted(async () => {
  await fetchImages();
});

async function fetchImages() {
  const { data, error } = await $supabase
    .storage
    .from('images') // Replace {bucket_name} with your actual bucket name
    .list('public', { 
      limit: 100, 
      offset: 0, 
      sortBy: { column: 'name', order: 'asc' },
      search: '.jpg, .png, .jpeg, .gif, .bmp, .tiff, .webp' // Only fetch .jpg files
    });

  if (error) {
    console.error('Error fetching images:', error);
    alert('Failed to load images. Please try again later.');
    return;
  }

  if (data) {
    images.value = data.map(file => ({
      name: file.name,
      url: $supabase.storage.from('images').getPublicUrl(`public/${file.name}`).data.publicUrl
    }));
  }
}

const openUploadPopup = () => {
  isUploadPopupOpen.value = true;
};

const closeUploadPopup = () => {
  isUploadPopupOpen.value = false;
  selectedFile.value = null;
  uploadTitle.value = '';
  uploadDescription.value = '';
};

const handleFileChange = (event) => {
  selectedFile.value = event.target.files[0];
};

const handleUpload = async () => {
  if (!selectedFile.value) return;

  const file = selectedFile.value;
  if (!file.name.toLowerCase().endsWith('.png')) {
    alert('Only Png files are allowed.');
    return;
  }

  const fileName = `${Date.now()}_${file.name}`;
  const filePath = `public/${fileName}`;

  const { data, error } = await $supabase.storage
    .from('images') // Replace {bucket_name} with your actual bucket name
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Upload Error:', error);
    alert('Failed to upload image. Please try again.');
    return;
  }

  const { data: urlData } = $supabase.storage
    .from('{bucket_name}') // Replace {bucket_name} with your actual bucket name
    .getPublicUrl(filePath);

  const newImage = {
    name: fileName,
    url: urlData.publicUrl,
  };

  images.value.push(newImage);
  closeUploadPopup();
  await fetchImages(); // Refresh the image list
};

const handleUploadSuccess = (newImage) => {
  images.value.unshift(newImage); // Add the new image to the beginning of the array
  closeUploadPopup();
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Matemasie&family=Rubik+Bubbles&display=swap');

.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: Arial, sans-serif;
  color: #333;
}

.header {
  background-color: #f5f5f5;
  padding: 2rem;
  text-align: center;
}

.matemasie-regular {
  font-family: "Matemasie", sans-serif;
  font-weight: 400;
  font-size: xx-large;
  font-style: normal;
}

.subtitle {
  font-size: 1.5rem;
  color: #777;
}

.navigation {
  background-color: #333;
  padding: 1rem;
  text-align: center;
}

.navigation a {
  color: #fff;
  margin: 0 1rem;
  text-decoration: none;
}

.navigation a:hover {
  text-decoration: underline;
}

.main-content {
  flex: 1;
  padding: 2rem;
}

.footer {
  background-color: #f5f5f5;
  padding: 1rem;
  text-align: center;
}

.image-container {
  width: 100%;
  overflow-x: auto;
  padding: 2rem 0;
}

.image-list {
  display: flex;
  gap: 1rem;
  padding: 0 1rem;
}

.image-item {
  flex: 0 0 auto;
}

.gallery-image {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
}

.gallery-image:hover {
  transform: scale(1.05);
}

.upload-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 5px;
}

.upload-button:hover {
  background-color: #45a049;
}

/* Responsive Design Enhancements */
@media (max-width: 600px) {
  .gallery-image {
    width: 150px;
    height: 150px;
  }

  .upload-button {
    padding: 8px 16px;
    font-size: 14px;
  }
}

/* New styles for the centered image */
.centered-image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 0;
  background-color: #f0f0f0; /* Light gray background */
}

.centered-image {
  max-width: 80%;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
}

.centered-image:hover {
  transform: scale(1.05);
}

/* Responsive design for the centered image */
@media (max-width: 600px) {
  .centered-image {
    max-width: 90%;
  }
}

.upload-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.upload-popup {
  background-color: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
}

.upload-popup form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.upload-popup input,
.upload-popup textarea,
.upload-popup button {
  padding: 0.5rem;
  font-size: 1rem;
}

.close-button {
  margin-top: 1rem;
  background-color: #f44336;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 5px;
}
</style>