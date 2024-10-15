<template>
    <div class="tabs-container">
      <a-tabs defaultActiveKey="1" @change="handleTabChange" centered>
        <a-tab-pane key="1" tab="名次榜單">
          <div class="container">
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
            </a-form>
  
            <a-table :dataSource="filteredScores" :columns="columns" rowKey="id" style="margin-top: 20px">
              <template #headerCell="{ column }">
                <div>
                  {{ column.title }}
                </div>
              </template>
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'projectPerformance'">
                  <span>{{ record.projectPerformance }}</span>
                </template>
                <template v-else-if="column.key === 'rank'">
                  <span>{{ record.rank }}</span>
                </template>
                <template v-else>
                  {{ record[column.key] }}
                </template>
              </template>
            </a-table>
          </div>
        </a-tab-pane>
        <a-tab-pane key="2" tab="總錦標榜單">
          <div class="container">
            <a-form layout="inline">
              <a-form-item label="年度">
                <a-select v-model="selectedYear" style="width: 100px" @change="handleYearChange">
                  <a-select-option v-for="year in academicYears" :key="year" :value="year">
                    {{ year }}
                  </a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="年級">
                <a-select v-model="selectedTotalGrade" style="width: 100px" @change="handleTotalGradeChange">
                  <a-select-option value="高一">高一</a-select-option>
                  <a-select-option value="高二">高二</a-select-option>
                  <a-select-option value="高三">高三</a-select-option>
                </a-select>
              </a-form-item>
            </a-form>
  
            <a-table :dataSource="filteredTotalScores" :columns="totalColumns" rowKey="classes" style="margin-top: 20px">
              <template #headerCell="{ column }">
                <div>{{ column.title }}</div>
              </template>
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'totalRank'">
                  <span>{{ record.totalRank }}</span>
                </template>
                <template v-else>
                  {{ record[column.key] }}
                </template>
              </template>
            </a-table>
          </div>
        </a-tab-pane>
        <a-tab-pane key="3" tab="破紀錄榜單">
          <div class="container">
            <a-table :dataSource="breakRecords" :columns="breakColumns" rowKey="id" style="margin-top: 20px">
              <template #headerCell="{ column }">
                <div>{{ column.title }}</div>
              </template>
              <template #bodyCell="{ column, record }">
                <template v-if="record[column.key]">
                  {{ record[column.key] }}
                </template>
              </template>
            </a-table>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </template>
  
  <script setup>
  import { useScoreStore } from '@/stores/score.js';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref, watch } from 'vue';
  
  const scoreStore = useScoreStore();
  const { events, scores, selectedEvent, selectedType, selectedGrade } = storeToRefs(scoreStore);
  
  const currentYear = new Date().getFullYear();
  const selectedYear = ref(null);
  const academicYears = ref([]);
  const selectedTotalGrade = ref(null);
  const totalScores = ref([]);
  const breakRecords = ref([]);
  
  const columns = ref([
    { title: '歷史成績', dataIndex: 'historicalPerformance', key: 'historicalPerformance' },
    { title: '賽程項目', dataIndex: 'courseItem', key: 'courseItem' },
    { title: '預決賽', dataIndex: 'preMatch', key: 'preMatch' },
    { title: '班級代碼', dataIndex: 'classes', key: 'classes' },
    { title: '姓名', dataIndex: 'studentName', key: 'studentName' },
    { title: '成績', dataIndex: 'projectPerformance', key: 'projectPerformance' },
    { title: '名次', dataIndex: 'rank', key: 'rank' }
  ]);
  
  const totalColumns = ref([
    { title: '班級代碼', dataIndex: 'classes', key: 'classes' },
    { title: '總積分', dataIndex: 'totalScore', key: 'totalScore' },
    { title: '總錦標名次', dataIndex: 'totalRank', key: 'totalRank' }
  ]);
  
  const breakColumns = ref([
    { title: '歷史成績', dataIndex: 'historicalPerformance', key: 'historicalPerformance' },
    { title: '賽程項目', dataIndex: 'courseItem', key: 'courseItem' },
    { title: '預決賽', dataIndex: 'preMatch', key: 'preMatch' },
    { title: '班級代碼', dataIndex: 'classes', key: 'classes' },
    { title: '姓名', dataIndex: 'studentName', key: 'studentName' },
    { title: '成績', dataIndex: 'projectPerformance', key: 'projectPerformance' },
    { title: '名次', dataIndex: 'ranking', key: 'ranking' }
  ]);
  
  const filteredScores = computed(() => {
    return scores.value.filter(score => score.rank && score.rank <= 3);
  });
  
  const filteredTotalScores = computed(() => {
    return totalScores.value.filter(score => score.totalRank && score.totalRank <= 3);
  });
  
  watch([selectedEvent, selectedType, selectedGrade, selectedYear], async () => {
    await generateScores();
  });
  
  const handleEventChange = async event => {
    selectedEvent.value = event;
    await generateScores();
  };
  
  const handleTypeChange = async type => {
    selectedType.value = type;
    await generateScores();
  };
  
  const handleGradeChange = async grade => {
    selectedGrade.value = grade;
    await generateScores();
  };
  
  const handleTotalGradeChange = async grade => {
    selectedTotalGrade.value = grade;
    await generateTotalScores();
  };
  
  const handleYearChange = async year => {
    selectedYear.value = year;
    await generateScores();
  };
  
  const handleTabChange = async key => {
    if (key === '3') {
      await fetchBreakRecords();
    }
  };
  
  const generateScores = async () => {
    if (selectedEvent.value && selectedType.value && selectedGrade.value && selectedYear.value) {
      await scoreStore.generateScores(selectedEvent.value, selectedType.value, selectedGrade.value);
    }
  };
  
  const generateTotalScores = async () => {
    const response = await fetch('http://localhost:8080/score/individualPerformances/item/1');
    const data = await response.json();
  
    const classRange = {
      '高一': ['101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112', '113', '114', '115', '116'],
      '高二': ['201', '202', '203', '204', '205', '206', '207', '208', '209', '210', '211', '212', '213', '214', '215', '216'],
      '高三': ['301', '302', '303', '304', '305', '306', '307', '308', '309', '310', '311', '312', '313', '314', '315', '316']
    }[selectedTotalGrade.value];
  
    const filteredData = data.filter(item => classRange.includes(item.classes) && item.preMatch === '預賽');
    const classScores = filteredData.reduce((acc, curr) => {
      acc[curr.classes] = (acc[curr.classes] || 0) + curr.totalScore;
      return acc;
    }, {});
  
    const sortedClassScores = Object.entries(classScores)
      .map(([classes, totalScore]) => ({ classes, totalScore }))
      .sort((a, b) => b.totalScore - a.totalScore);
  
    sortedClassScores.forEach((item, index) => {
      item.totalRank = index + 1;
    });
  
    totalScores.value = sortedClassScores;
  };
  
  const fetchBreakRecords = async () => {
    const response = await fetch('http://localhost:8080/score/individualPerformances/breakRecord');
    const data = await response.json();
    breakRecords.value = data;
  };
  
  const fetchAcademicYears = async () => {
    try {
      const response = await fetch('http://localhost:8080/score/individualPerformances'); // 假設此API可以返回完整成績列表
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data); // 日誌記錄數據，幫助調試
      const years = [...new Set(data.map(item => item.academicYear))];
      academicYears.value = years;
      if (years.length > 0) {
        selectedYear.value = years[0]; // 設定默認選擇的年度
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
  .tabs-container {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    margin-bottom: 20px;
  }
  
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
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
  </style>
  