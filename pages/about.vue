<template>
  <section class="about-container max-w-4xl mx-auto mt-10">
    <div class="header-text">
      Introducing PixelBubble: The Exclusive Platform for 3D and Pixelated Art
    </div>
    <div class="description-text">
      <p>
        <span class="highlight">PixelBubble</span> is an innovative app dedicated solely to
        showcasing <span class="highlight">3D</span> and <span class="highlight">pixelated digital artwork</span>. Artists can
        freely upload their creations, knowing that our advanced machine
        learning algorithms ensure only genuine 3D and pixelated art make it
        through the validation process. This curation maintains a
        high-quality gallery that truly celebrates these unique art forms.
      </p>
      <br />
      <p>
        As a secure and free gallery for <span class="highlight">web3 artists</span>,
        PixelBubble leverages blockchain technology to protect artists' rights
        and authenticate ownership. By embedding art on the blockchain, we
        provide a transparent and immutable record that safeguards your
        intellectual property.
      </p>
      <br />
      <p>
        Join PixelBubble to share your art with a community that values
        creativity and originality, all while maintaining full control over
        your work.
      </p>
    </div>

    <!-- Placeholder Image Section -->
    <div class="mt-10 flex justify-center">
      <img :src="placeholderImage" alt="PixelBubble Art Example" class="rounded-lg shadow-md" />
    </div>
  </section>
</template>

<script setup>
// In case you want to handle dynamic logic in the future
const placeholderImage = 'https://via.placeholder.com/400x300';

</script>

<style scoped>
.about-container {
  @apply bg-gray-100 p-8 rounded-lg shadow-lg;
}

.header-text {
  @apply text-4xl font-bold text-center mb-6 text-gray-800;
}

.description-text {
  @apply text-lg leading-relaxed text-gray-700;
}

.highlight {
  @apply text-blue-500 font-semibold;
}

img {
  @apply rounded-lg shadow-md;
}

</style>
