<template>
  <Teleport to="body">
    <div v-if="isOpen" class="upload-popup-overlay">
      <div class="upload-popup">
        <h2>Upload Your Art</h2>
        <form @submit.prevent="handleUpload">
          <input type="file" @change="handleFileChange" accept="image/*" required>
          <input type="text" v-model="title" placeholder="Title" required>
          <textarea v-model="description" placeholder="Description"></textarea>
          <button type="submit">Upload</button>
        </form>
        <button @click="closePopup" class="close-button">Close</button>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useNuxtApp } from '#app';
import { v4 as uuidv4 } from 'uuid';

const { $supabase } = useNuxtApp();

const props = defineProps({
  isOpen: Boolean,
});

const emit = defineEmits(['close', 'upload-success']);

const file = ref(null);
const title = ref('');
const description = ref('');

const handleFileChange = (event) => {
  file.value = event.target.files[0];
};

const closePopup = () => {
  emit('close');
};

const handleUpload = async () => {
  if (!file.value) return;

  const fileExtension = file.value.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExtension}`;
  
  const { data: uploadData, error: uploadError } = await $supabase.storage
    .from('images')
    .upload(`public/${fileName}`, file.value);

  if (uploadError) {
    console.error('Error uploading file:', uploadError);
    alert('Failed to upload the image. Please try again.');
    return;
  }

  const { data: urlData } = $supabase.storage
    .from('images')
    .getPublicUrl(`public/${fileName}`);

  const publicUrl = urlData.publicUrl;

  const newImage = {
    id: fileName.split('.')[0], // UUID without extension
    name: title.value,
    description: description.value,
    url: publicUrl,
  };

  // Insert metadata into the image_metadata table
  const { error: metadataError } = await $supabase
    .from('image_metadata')
    .insert(newImage);

  if (metadataError) {
    console.error('Error inserting metadata:', metadataError);
    alert('Failed to save image metadata. Please try again.');
    return;
  }

  emit('upload-success', newImage);

  // Reset form
  file.value = null;
  title.value = '';
  description.value = '';
  closePopup();
};

// Watch for changes in isOpen prop
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    // Reset form when popup is opened
    file.value = null;
    title.value = '';
    description.value = '';
  }
});
</script>

<style scoped>
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

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

input, textarea, button {
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

.close-button:hover {
  background-color: #d32f2f;
}
</style>
