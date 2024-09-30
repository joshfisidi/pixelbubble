<template>
  <div class="gallery-container">
    <h1>Gallery</h1>
    <div ref="scrollContainer" class="image-grid">
      <div v-for="image in images" :key="image.id" class="image-item">
        <img :src="image.url" :alt="image.name" class="gallery-image">
      </div>
    </div>
    <div v-if="isLoading" class="loading">Loading more images...</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useInfiniteScroll } from '@vueuse/core';
import { useNuxtApp } from '#app';

const { $supabase } = useNuxtApp();
const images = ref([]);
const page = ref(0);
const pageSize = 10;
const isLoading = ref(false);
const scrollContainer = ref(null);

const fetchImages = async () => {
  if (isLoading.value) return;
  
  isLoading.value = true;
  try {
    console.log('Fetching images...');
    const { data, error } = await $supabase
      .storage
      .from('images')
      .list('public', {
        limit: pageSize,
        offset: page.value * pageSize,
        sortBy: { column: 'created_at', order: 'desc' },
      });

    if (error) {
      console.error('Error fetching image list:', error);
      return;
    }

    console.log('Fetched data:', data);

    if (data && data.length > 0) {
      const newImages = await Promise.all(data.map(async (file) => {
        try {
          console.log('Processing file:', file.name);
          const { data: urlData, error: urlError } = $supabase
            .storage
            .from('images')
            .getPublicUrl(`public/${file.name}`);

          if (urlError) {
            console.error('Error getting public URL:', urlError);
            return null;
          }

          console.log('Image URL:', urlData.publicUrl);

          return {
            id: file.id,
            name: file.name,
            url: urlData.publicUrl,
          };
        } catch (err) {
          console.error('Error processing image:', file.name, err);
          return null;
        }
      }));

      console.log('Processed images:', newImages);
      images.value.push(...newImages.filter(img => img !== null));
      page.value++;
    } else {
      console.log('No images found or reached end of list');
    }
  } catch (err) {
    console.error('Unexpected error in fetchImages:', err);
  } finally {
    isLoading.value = false;
  }
};

useInfiniteScroll(
  scrollContainer,
  () => {
    fetchImages();
  },
  { distance: 10 }
);

onMounted(() => {
  fetchImages();
});
</script>

<style scoped>
.gallery-container {
  padding: 20px;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.image-item {
  position: relative;
  padding-bottom: 100%;
  overflow: hidden;
}

.gallery-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.gallery-image:hover {
  transform: scale(1.05);
}

.loading {
  text-align: center;
  padding: 20px;
}
</style>