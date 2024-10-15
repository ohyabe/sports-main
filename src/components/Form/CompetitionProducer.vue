<template>
  <div class="main">
    <div class="app1">
    <h1>預賽人數</h1>
    <div class="controls">
      <button @click="addTrack">增加組別</button>
      <button @click="removeTrack">減少組別</button>
    </div>
    <div class="tracks">
      <div v-for="(track, index) in tracks" :key="index" class="track">
        <label :for="'track' + index">組別 {{ index + 1 }} 人數: </label>
        <input
          type="number"
          v-model.number="tracks[index]"
          :id="'track' + index"
          min="0"
          max="6"
          @input="updateTotal"
        />
        <svg v-if="tracks[index] >= 2 && tracks[index] <= 6" width="50" height="50" viewBox="0 0 100 100">
          <polygon :points="getPolygonPoints(tracks[index])" style="fill:lime;stroke:purple;stroke-width:1" />
        </svg>
      </div>
    </div>
    <div class="result">
      <h3>分配結果:</h3>
      <p>{{ allocationResult }}</p>
    </div>
    <div class="final">
      <h2>決賽人數</h2>
      <label for="finalTrack">決賽人數: </label>
      <input
        type="number"
        v-model.number="finalTrack"
        id="finalTrack"
        min="1"
        max="8"
        @input="updateTotal"
      />
      <svg v-if="finalTrack >= 1 && finalTrack <= 8" width="100" height="100" viewBox="0 0 100 100">
        <polygon :points="getPolygonPoints(finalTrack)" style="fill:violet;stroke:blue;stroke-width:1" />
      </svg>
    </div>
    <div class="total">
      <h3>總人數: {{ total }}</h3>
    </div>
    <div class="actions">
      <button @click="drawLots">抽籤分配人數</button>
      
      <button @click="generateJPG">匯成JPG</button>
    </div>
  </div>
    <section>
      <GeneratorView />
    </section>
  </div>
  
</template>

<script>
// 腳本部分保持不變
import html2canvas from 'html2canvas';

export default {
  data() {
    return {
      tracks: [0, 0, 0, 0, 0, 0, 0, 0], // 預設有八組
      total: 0,
      finalTrack: 0,
      allocationResult: '',
    };
  },
  methods: {
    // 方法保持不變
    updateTotal() {
      this.total = this.tracks.reduce((sum, num) => sum + num, 0) + this.finalTrack;
    },
    addTrack() {
      if (this.tracks.length < 8) {
        this.tracks.push(0);
      } else {
        alert("最多只能有八組！");
      }
    },
    removeTrack() {
      if (this.tracks.length > 1) {
        this.tracks.pop();
        this.updateTotal();
      } else {
        alert("至少需要一組！");
      }
    },
    drawLots() {
      const totalPeople = this.tracks.reduce((sum, num) => sum + num, 0);
      const numGroups = this.tracks.length;
      
      let numbers = Array.from({ length: totalPeople }, (_, i) => i + 1);
      numbers = this.shuffleArray(numbers);

      let result = [];
      let index = 0;

      for (let i = 0; i < numGroups; i++) {
        let group = [];
        for (let j = 0; j < this.tracks[i]; j++) {
          if (index < numbers.length) {
            group.push(numbers[index]);
            index++;
          }
        }
        result.push(group.join(','));
      }

      this.allocationResult = result.join(' || ');
    },
    shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    },
    generateJPG() {
      html2canvas(document.querySelector(".app1")).then(canvas => {
        const link = document.createElement('a');
        link.download = 'result.jpg';
        link.href = canvas.toDataURL();
        link.click();
      });
    },
    getPolygonPoints(sides) {
      const radius = 40;
      const centerX = 50;
      const centerY = 50;
      let points = '';
      for (let i = 0; i < sides; i++) {
        const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        points += `${x},${y} `;
      }
      return points.trim();
    },
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.main {
  display: flex;
  justify-content: space-between;
  padding: 5%;
  width: 70%;
  height: 100%;
  margin: 0 auto;
  text-align: center;
}

h1 {
  font-weight: bolder;
  font-size: 30px;
}

.results {
  /* margin-top: 15px; */
}
h2 {
  font-weight: bolder;
}

h3 {
  font-weight: bolder;
}

.area {
  /* width: 100%; */
  padding-top: 5%;
  padding-bottom: 5%;
}
button {
  border-radius: 5px;
  padding: 0.5rem;
  margin: 2rem;
  background-color: hsl(197, 54%, 65%);
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.group-container {
  display: flex;
  flex-wrap: wrap;
  /* gap: 5%; */
}

.group {
  margin-bottom: 20px;
}

.schedule {
  display: grid;
  justify-content: center;
  align-content: center;
  margin: 0 auto;
  text-align: center;
}

.download-button {
  margin: 0 auto;
  margin-left:450px;

}
.app1 {
  font-family: Arial, sans-serif;
  text-align: center;
  background-color: #000;
  color: #fff;
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

h1, h2, h3 {
  margin-bottom: 20px;
}

.controls, .actions {
  margin-bottom: 20px;
}

button {
  /* background-color: #333; */
  color: #fff;
  border: none;
  padding: 10px 15px;
  margin: 5px;
  cursor: pointer;
}

.tracks {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 20px;
}

.track, .final {
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

input[type="number"] {
  width: 50px;
  /* background-color: #333; */
  color:black;
  border: 1px solid black;
  text-align: center;
  padding: 5px;
}

.result {
  margin-top: 20px;
  margin-bottom: 20px;
}

svg {
  margin-top: 10px;
}
</style>
