<template>
  <div class="tabs-container">
    <a-tabs defaultActiveKey="1" @change="handleTabChange" centered>
      <a-tab-pane key="1" tab="輸入成績與名次">
        <div class="container">
          <!-- 其他表單和按鈕 -->
          <a-form layout="inline">
            <a-form-item label="年度">
              <a-select v-model="selectedYear" style="width: 100px" @change="handleYearChange">
                <a-select-option v-for="year in academicYears" :key="year" :value="year">
                  {{ year }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="賽事項目">
              <a-select v-model="selectedEvent" style="width: 200px" @change="handleEventChange">
                <a-select-option v-for="event in events" :key="event.id" :value="event.id">
                  {{ event.id }} {{ event.name }} {{ event.group }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="類型">
              <a-select v-model="selectedType" style="width: 100px" @change="handleTypeChange">
                <a-select-option value="預賽">預賽</a-select-option>
                <a-select-option value="決賽">決賽</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="年級">
              <a-select v-model="selectedGrade" style="width: 100px" @change="handleGradeChange">
                <a-select-option value="高一">高一</a-select-option>
                <a-select-option value="高二">高二</a-select-option>
                <a-select-option value="高三">高三</a-select-option>
              </a-select>
            </a-form-item>
            <a-button type="primary" @click="submitScores" style="margin-left: 10px; background-color: rgb(97 192 205);">送出成績</a-button>
            <!-- <a-button type="primary" @click="openGroupRanking" style="margin-left: 10px; background-color: rgb(97 192 205);">分組排名</a-button> -->
          </a-form>

          <a-table :dataSource="scores" :columns="filteredColumns" rowKey="id" style="margin-top: 20px">
            <template #headerCell="{ column }">
              <template v-if="column.key === 'rank'">
                <div>
                  {{ column.title }}
                  <a-button type="primary" @click="generateRanks" style="margin-left: 10px;background-color: rgb(97 192 205);">產生名次</a-button>
                </div>
              </template>
              <template v-else>
                {{ column.title }}
              </template>
            </template>
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'projectPerformance'">
                <a-input v-model:value="record.projectPerformance" @change="e => handleChange(record.id, selectedEvent, 'projectPerformance', e.target.value)" />
              </template>
              <template v-else-if="column.key === 'rank'">
                <span v-if="showRanks">{{ record.rank }}</span>
              </template>
              <template v-else>
                {{ record[column.key] }}
              </template>
            </template>
          </a-table>
        </div>
      </a-tab-pane>

      <!-- 新增的分組排名分頁 -->
      <a-tab-pane key="2" tab="分組排名">
        <div class="container">
          <a-form layout="inline">
            <a-form-item label="年度">
              <a-select v-model="groupSelectedYear" style="width: 100px" @change="handleGroupYearChange">
                <a-select-option :value="113">113</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="賽事項目">
              <a-select v-model="groupSelectedEvent" style="width: 200px" @change="handleGroupEventChange">
                <a-select-option v-for="event in groupEvents" :key="event.id" :value="event.id">
                  {{ event.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="類型">
              <a-select v-model="groupSelectedType" style="width: 100px" @change="handleGroupTypeChange">
                <a-select-option value="預賽">預賽</a-select-option>
              </a-select>
            </a-form-item>
            <a-button type="primary" @click="loadGroupRanking" style="margin-left: 10px; background-color: rgb(97 192 205);">導向分組排名</a-button>
          </a-form>

          <!-- 加載動畫 -->
          <div v-if="isLoading" class="spinner">
            <pacman-loader :loading="true" :color="'rgb(97, 192, 205)'" :size="'25px'"></pacman-loader>
          </div>

          <!-- 內嵌的iframe顯示分組排名 -->
          <iframe v-if="!isLoading && groupRankingUrl" :src="groupRankingUrl" width="100%" height="600px" style="border:none; margin-top: 20px;"></iframe>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup>
import { useScoreStore } from '@/stores/score.js';
import { storeToRefs } from 'pinia';
import Swal from 'sweetalert2';
import { computed, onMounted, ref, watch } from 'vue';
import PacmanLoader from 'vue-spinner/src/PacmanLoader.vue';

const scoreStore = useScoreStore();
const { events, scores, selectedEvent, selectedType, selectedGrade } = storeToRefs(scoreStore);

const selectedYear = ref(null);
const academicYears = ref([]);
const showRanks = ref(false);

// 新增分組排名相關的狀態
const groupSelectedYear = ref(2024);
const groupSelectedEvent = ref(null);
const groupSelectedType = ref('預賽');
const groupRankingUrl = ref(null);
const isLoading = ref(false);

// 賽事項目與URL的對應關係
const groupEvents = [
  { id: '1', name: '1 100公尺 男子', url: 'https://script.google.com/macros/s/AKfycbyl9NrKfMP9aWSz7UJje7u_RT2SiJiNBG4K9Uee5blYh6a3OuN91v1iuZ7Yw8lf6_OC/exec' },
  { id: '2', name: '2 100公尺 女子', url: 'https://script.google.com/macros/s/AKfycbyD7UODXEjEoGgYRgAZGw4HkP9O-g0vZvcq_CqLbvsEI1HgO67ojAXmEal18JF6nBLY/exec' },
  { id: '3', name: '3 200公尺 男子', url: 'https://script.google.com/macros/s/AKfycbxleXeAbvP6Bb_59vJWAMLZ2EFI10vuer3h91CT2u5N0h5DY-G8uH9uQj_MPO1QWg2-1A/exec' },
  { id: '4', name: '4 200公尺 女子', url: 'https://script.google.com/macros/s/AKfycbwJlIlNTMD5aITW1TKS952fgEHOMHtTrrRBOWMyj8sKhuQFoFTQqg80ExHZrDVseOKS/exec' },
  { id: '5', name: '5 400公尺 男子', url: 'https://script.google.com/macros/s/AKfycbzEXbv17ryLaii2FQr4CJxZETESBIE9I80FeUL_DIT7WLF34Aatg4KCnjpX0pEKk8VOgw/exec' },
  { id: '6', name: '6 400公尺 女子', url: 'https://script.google.com/macros/s/AKfycbxWMhtBBGkLPjPyuvf-nnVpFCuwNM6b7Y_9HxXspl6VRLWH2BlCDkSCu7ChL7xXGSjV/exec' },
  { id: '17', name: '17 400公尺接力 混合', url: 'https://script.google.com/macros/s/AKfycbxVUnh-fPsv7qEXZDg4jXGhxYMeU-eFhxkaiDswFoBPIR7hEBz-cOu2SoI-EADsPsE/exec' },
  { id: '18', name: '18 大隊接力 混合', url: 'https://script.google.com/macros/s/AKfycbxASroSwZUQ09k7XHFUwF7SlNYQHJ5somcINtDSmGhzTiTwU5tfA59mR6KLyXNBGNcZMg/exec' },
];

const columns = ref([
  { title: '歷史成績', dataIndex: 'historicalPerformance', key: 'historicalPerformance' },
  { title: '賽程項目', dataIndex: 'courseItem', key: 'courseItem' },
  { title: '預決賽', dataIndex: 'preMatch', key: 'preMatch' },
  { title: '班級代碼', dataIndex: 'classes', key: 'classes' },
  { title: '姓名', dataIndex: 'studentName', key: 'studentName' },
  { title: '成績', dataIndex: 'projectPerformance', key: 'projectPerformance' },
  { title: '名次', dataIndex: 'rank', key: 'rank', customRender: ({ text }) => showRanks.value ? text : '' },
]);

const filteredColumns = computed(() => {
  const eventId = selectedEvent.value;
  return columns.value.filter(column => {
    if (eventId >= 17 && eventId <= 19 && column.key === 'studentName') {
      return false;
    }
    return true;
  });
});

watch([selectedEvent, selectedType, selectedGrade, selectedYear], async () => {
  showRanks.value = false;
  await generateScores();
});

const handleEventChange = async event => {
  selectedEvent.value = event;
  showRanks.value = false;
  await generateScores();
};

const handleTypeChange = async type => {
  selectedType.value = type;
  showRanks.value = false;
  await generateScores();
};

const handleGradeChange = async grade => {
  selectedGrade.value = grade;
  showRanks.value = false;
  await generateScores();
};

const handleYearChange = async year => {
  selectedYear.value = year;
  showRanks.value = false;
  await generateScores();
};

const generateScores = async () => {
  if (selectedEvent.value && selectedType.value && selectedGrade.value && selectedYear.value) {
    await scoreStore.generateScores(selectedEvent.value, selectedType.value, selectedGrade.value);
  }
};

const generateRanks = () => {
  scoreStore.updateRanks();
  showRanks.value = true;
};

const handleChange = (id, itemId, field, value) => {
  scoreStore.updateScore(id, itemId, field, value);
};

const submitScores = async () => {
  if (!showRanks.value) {
    Swal.fire({
      icon: "warning",
      title: "送出失敗",
      text: "請先產生名次再送出!"
    });
    return;
  }

  try {
    await scoreStore.submitScores();
    Swal.fire({
      title: "送出成功!",
      text: "已成功送出成績!",
      icon: "success"
    });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "送出失敗",
      text: "成績送出失敗!"
    });
  }
};

const openGroupRanking = () => {
  window.open('https://script.google.com/macros/s/AKfycbynBg6IR-1fNTqj_t4supnIzzxBJgkH6XS6br_X-H550WnMGITIpacn_phugzkhpIw/exec', '_blank');
};

// 處理分組排名的選項變更
const handleGroupYearChange = (year) => {
  groupSelectedYear.value = year;
};

const handleGroupEventChange = (event) => {
  groupSelectedEvent.value = event;
};

const handleGroupTypeChange = (type) => {
  groupSelectedType.value = type;
};

// 處理分組排名按鈕點擊事件
const loadGroupRanking = () => {
  const selectedEvent = groupEvents.find(event => event.id === groupSelectedEvent.value);
  if (selectedEvent) {
    isLoading.value = true;
    setTimeout(() => {
      groupRankingUrl.value = selectedEvent.url;
      isLoading.value = false;
    }, 6000); // 延遲6秒模擬動畫時長
  } else {
    Swal.fire({
      icon: "error",
      title: "錯誤",
      text: "無法找到對應的分組排名連結!"
    });
  }
};

const fetchAcademicYears = async () => {
  try {
    const response = await fetch('http://localhost:8080/score/individualPerformances');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    const years = [...new Set(data.map(item => item.academicYear))];
    academicYears.value = years;
    if (years.length > 0) {
      selectedYear.value = years[0];
    }
  } catch (error) {
    console.error('Error fetching academic years:', error);
  }
};

onMounted(async () => {
  await fetchAcademicYears();
  await generateScores();
});
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.tabs-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 20px;
}

.spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 600px;
}

:where(.css-dev-only-do-not-override-19iuou).ant-table-wrapper {
  clear: both;
  margin: 50px;
  max-width: 100%;
}

:where(.css-dev-only-do-not-override-19iuou).ant-form {
  margin: 30px 60px;
}
.ant-table-tbody > tr:nth-child(odd) > td {
  background-color: #eaf4f9 !important; 
}

.ant-table-tbody > tr:nth-child(even) > td {
  background-color: #ffffff !important; 
}

@keyframes pacman-rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.pacman-loader {
  animation: pacman-rotate 6s linear infinite;
}

.pacman-loader > div {
  animation-duration: 3s;
}
</style>
