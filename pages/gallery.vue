<template>
  <div>
    <div v-if="isLoading">Loading images...</div>
    <div v-if="fetchError">{{ fetchError }}</div>
    <div v-if="images.length" class="image-grid">
      <div v-for="image in images" :key="image.name" class="image-item">
        <img :src="image.url" :alt="image.name" class="gallery-image" />
        <p>{{ image.name }}</p>
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
    console.log('Fetching images from storage...');
    const { data: files, error } = await $supabase.storage
      .from('images')
      .list('public');

    if (error) {
      console.error('Error fetching files:', error);
      throw error;
    }

    console.log('Fetched files:', files);

    if (!files || files.length === 0) {
      console.log('No files found in the public folder');
      images.value = [];
      return;
    }

    const newImages = await Promise.all(files.map(async (file) => {
      try {
        console.log('Processing file:', file.name);
        const { data: urlData } = $supabase.storage
          .from('images')
          .getPublicUrl(`public/${file.name}`);

        if (!urlData || !urlData.publicUrl) {
          console.error('Failed to get public URL for:', file.name);
          return null;
        }

        console.log('Image URL:', urlData.publicUrl);

        return {
          name: file.name,
          url: urlData.publicUrl,
        };
      } catch (err) {
        console.error('Error processing image:', file.name, err);
        return null;
      }
    }));

    console.log('Processed images:', newImages);
    images.value = newImages.filter(img => img !== null);
    
    if (images.value.length === 0) {
      console.log('No valid images found after processing');
    }
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
