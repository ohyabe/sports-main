<template>
    <div>
      <a href="#" class="contact-button" @click.prevent="goToContactUs">聯絡我們</a>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  
  const goToContactUs = () => {
    router.push({ name: 'contact' });
  };
  </script>
  
  <style scoped>
  .contact-button {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: hsl(197, 54%, 65%); 
    color: black; 
    font-weight: bolder;
    border: 2px solid hsl(0, 0%, 100%); 
    padding: 10px 20px; 
    font-size: 16px; 
    border-radius: 5px; 
    transition: background-color 0.5s ease-in-out; 
    text-decoration: none; /* 移除文字底線 */
    cursor: pointer;
  }
  
  .contact-button:hover {
    background-color: hsl(0, 0%, 100%);
    color: rgb(0, 0, 0);
    font-weight: bolder;
    border-color: hsl(0, 0%, 100%);
  }
  </style>
  