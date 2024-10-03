<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Image Gallery</h1>
    <div v-if="isLoading">Loading images...</div>
    <div v-if="fetchError" class="text-red-500">{{ fetchError }}</div>
    <div v-if="images.length" class="image-grid">
      <div v-for="image in images" :key="image.id" class="image-item">
        <img :src="image.url" :alt="image.name" class="gallery-image" />
        <p class="font-bold mt-2">{{ image.name }}</p>
        <p class="text-sm text-gray-600">{{ image.description }}</p>
      </div>
    </div>
    <div v-if="!isLoading && !fetchError && !images.length">No images found.</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useNuxtApp } from '#app';

const { $supabase } = useNuxtApp();
const images = ref([]);
const isLoading = ref(true);
const fetchError = ref(null);

const fetchImages = async () => {
  isLoading.value = true;
  fetchError.value = null;

  try {
    console.log('Fetching image metadata from database...');
    
    const { data: metadata, error } = await $supabase
      .from('image_metadata')
      .select('*')
      .order('uploaded_at', { ascending: false });

    if (error) {
      console.error('Error fetching metadata:', error);
      fetchError.value = 'Error fetching image metadata.';
      return;
    }

    console.log('Fetched image metadata:', metadata);

    if (!metadata || metadata.length === 0) {
      console.log('No image metadata found.');
      images.value = [];
      return;
    }

    images.value = metadata;
  } catch (err) {
    console.error('Unexpected error in fetchImages:', err);
    fetchError.value = 'Failed to load images. Please try again later.';
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchImages();
});
</script>

<style scoped>
.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.image-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.gallery-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
</style>
