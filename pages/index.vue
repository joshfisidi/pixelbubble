<template>
    <div class="container">
      <header class="header">
        <h1 class="title">PixelBubble</h1>
        <p class="subtitle">Dive into a world of 3D and Pixel Art</p>
      </header>
      <nav class="navigation">
        <NuxtLink to="/">Home</NuxtLink>
        <NuxtLink to="/gallery">Gallery</NuxtLink>
        <NuxtLink to="/upload">Upload</NuxtLink>
        <NuxtLink to="/about">About</NuxtLink>
      </nav>
      <div class="image-container">
        <img src="/public/logo.jpeg" alt="PixelBubble Logo" class="centered-image">
      </div>
      <main class="main-content">
        <p>Welcome to PixelBubble, your community hub for sharing and exploring amazing 3D and pixel art creations from artists around the globe.</p>
        <!-- Future content like featured artworks or recent uploads will go here -->
      </main>
      <footer class="footer">
        <p>&copy; {{ currentYear }} PixelBubble. All rights reserved.</p>
      </footer>
    </div>
  </template>
  
  <script setup>
import { useHead } from '#imports';

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
</script>

  
  <style scoped>
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
  
  .title {
    font-size: 3rem;
    margin-bottom: 0.5rem;
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
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem 0;
  }

  .centered-image {
    max-width: 100%;
    height: auto;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease-in-out;
  }

  .centered-image:hover {
    transform: scale(1.05);
  }
  </style>
