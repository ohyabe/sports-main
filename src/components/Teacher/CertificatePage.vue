<template>
    <div class="certificate-container">
      <h1>生成獎狀</h1>
  
      <div class="certificate">
        <svg width="500" height="700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 700">
          <!-- 外框 -->
          <rect x="20" y="20" width="460" height="660" fill="none" stroke="#D4AF37" stroke-width="10" />
          <!-- 國旗 -->
          <rect x="200" y="20" width="100" height="60" fill="#FEFEFE" stroke="none" />
          <rect x="200" y="20" width="100" height="60" fill="red" />
          <polygon points="250,20 275,20 275,45 300,45 300,70 250,70" fill="blue" />
          <circle cx="275" cy="45" r="12" fill="white" />
          <!-- 星星 -->
          <polygon points="275,34 278,41 285,41 279,45 281,52 275,48 269,52 271,45 265,41 272,41" fill="white" />
          <!-- 內框 -->
          <rect x="40" y="40" width="420" height="620" fill="none" stroke="#D4AF37" stroke-width="4" />
          <!-- 內容 -->
          <foreignObject x="50" y="80" width="400" height="560">
            <div xmlns="http://www.w3.org/1999/xhtml" class="certificate-content">
              <h2>參加中華民國{{ year }}年高級中學運動會</h2>
              <p>成績優異 特頒獎狀以茲鼓勵</p>
              <p>單位：國立小吉高級中學</p>
              <p>選手：{{ name }}</p>
              <p>項目：{{ event }}</p>
              <p>班級：{{ className }}</p>
              <p>名次：{{ rank }}</p>
            </div>
          </foreignObject>
        </svg>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRoute } from 'vue-router';
  
  const route = useRoute();
  
  const event = ref(route.params.event || '');
  const className = ref(route.params.className || '');
  const name = ref(route.params.name || '');
  const rank = ref(route.params.rank || '');
  const year = ref(route.params.year || new Date().getFullYear());
  </script>
  
  <style scoped>
  .certificate-container {
    padding: 20px;
    max-width: 600px;
    margin: 0 auto;
    text-align: center;
  }
  
  .certificate {
    margin-top: 30px;
    position: relative;
    display: inline-block;
  }
  
  .certificate svg {
    width: 100%;
    height: auto;
  }
  
  .certificate-content {
    font-size: 16px;
    color: black;
  }
  
  .certificate-content h2 {
    font-size: 18px;
    font-weight: bold;
    margin: 10px 0;
  }
  
  .certificate-content p {
    margin: 5px 0;
  }
  </style>
  