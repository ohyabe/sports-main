<template>
  <div class="container">
    <h1>鉛球比賽名單產生器</h1>
    <form @submit.prevent="generateGrids">
      <label for="numParticipants">總參賽人數 (n):</label>
      <input type="number" id="numParticipants" v-model="numParticipants" min="1" required />
      <br /><br />
      <label for="numRows">行數 (m):</label>
      <input type="number" id="numRows" v-model="numRows" min="1" required />
      <br /><br />
      <label for="numFinalists">進入決賽人數 (y):</label>
      <input type="number" id="numFinalists" v-model="numFinalists" min="1" required />
      <br /><br />
      <button type="submit">生成名單</button>
    </form>
    <div class="results" ref="results">
      <div class="preliminary">
        <h2>預賽名單:</h2>
        <div :style="{'grid-template-columns': 'repeat(' + Math.ceil(numParticipants / numRows) + ', 50px)'}" class="grid-container">
          <div v-for="item in preliminaryGrid" :key="item.id" class="grid-item">{{ item.id }}</div>
        </div>
      </div>
      <div class="final">
        <h2>決賽名單:</h2>
        <div :style="{'grid-template-columns': 'repeat(' + Math.ceil(numFinalists / numRows) + ', 50px)'}" class="grid-container">
          <div v-for="item in finalGrid" :key="item.id" class="grid-item finalist">{{ item.id }}</div>
        </div>
      </div>
    </div>
    <button @click="downloadImage">下載結果圖</button>
  </div>
</template>

<script setup>
import html2canvas from 'html2canvas';
import { ref } from 'vue';

const numParticipants = ref(0);
const numRows = ref(0);
const numFinalists = ref(0);
const preliminaryGrid = ref([]);
const finalGrid = ref([]);
const results = ref(null);

const generateGrids = () => {
  if (numFinalists.value > numParticipants.value) {
    alert("決賽人數不能超過參賽總人數！");
    return;
  }

  const numColumnsPrelim = Math.ceil(numParticipants.value / numRows.value);
  const numColumnsFinal = Math.ceil(numFinalists.value / numRows.value);

  preliminaryGrid.value = Array(numParticipants.value)
    .fill()
    .map((_, i) => ({
      id: i + 1,
      isFinalist: false,
    }));

  finalGrid.value = Array(numFinalists.value)
    .fill()
    .map((_, i) => ({
      id: i + 1,
      isFinalist: true,
    }));

  return { numColumnsPrelim, numColumnsFinal };
};

const downloadImage = () => {
  if (!results.value) return;

  html2canvas(results.value).then(canvas => {
    const link = document.createElement('a');
    link.download = 'results.png';
    link.href = canvas.toDataURL();
    link.click();
  });
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  text-align: center;
}

.results {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.preliminary,
.final {
  margin: 0 10px;
}

.grid-container {
  display: grid;
  grid-gap: 5px;
  justify-content: center;
  margin-top: 20px;
}

.grid-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border: 1px solid #ddd;
  font-size: 12px;
  background-color: #f9f9f9;
}

.finalist {
  background-color: #ffcccc;
}

.line {
  width: 100%;
  height: 50px;
  border-bottom: 2px solid #ddd;
  margin: 20px 0;
  position: relative;
}

.line::before {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -15px;
  width: 2px;
  height: 30px;
  background-color: #ddd;
}
</style>
