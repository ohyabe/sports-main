<template>
    <div class="tabs-container">
      <a-tabs defaultActiveKey="1" centered>
        <a-tab-pane key="1" tab="歷史成績榜單">
          <div class="container">
            <a-form layout="inline">
              <a-form-item label="年度">
                <a-select v-model="selectedYear" style="width: 100px" @change="handleYearChange">
                  <a-select-option value="111">111</a-select-option>
                  <a-select-option value="111">112</a-select-option>
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
  
            <a-table :dataSource="scores" :columns="columns" rowKey="id" style="margin-top: 20px">
              <template #headerCell="{ column }">
                <div>
                  {{ column.title }}
                </div>
              </template>
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'studentName'">
                  <span>{{ maskName(record.studentName) }}</span>
                </template>
                <template v-else>
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
import { ref, watch } from 'vue';
  
  const scoreStore = useScoreStore();
  const { events, scores, selectedEvent, selectedType, selectedGrade } = storeToRefs(scoreStore);
  
  const selectedYear = ref('2022'); // 默認選擇2022
  
  const columns = ref([
    { title: '歷史成績', dataIndex: 'historicalPerformance', key: 'historicalPerformance' },
    { title: '賽程項目', dataIndex: 'courseItem', key: 'courseItem' },
    { title: '預決賽', dataIndex: 'preMatch', key: 'preMatch' },
    { title: '班級代碼', dataIndex: 'classes', key: 'classes' },
    { title: '姓名', dataIndex: 'studentName', key: 'studentName' },
    { title: '成績', dataIndex: 'projectPerformance', key: 'projectPerformance' },
    { title: '名次', dataIndex: 'rank', key: 'rank' }
  ]);
  
  const maskName = (name) => {
    if (name.length === 2) {
      return name[0] + '○';
    } else if (name.length === 3) {
      return name[0] + '○' + name[2];
    }
    return name;
  };
  
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
  
  const handleYearChange = async year => {
    selectedYear.value = year;
    await generateScores();
  };
  
  const generateScores = async () => {
    if (selectedEvent.value && selectedType.value && selectedGrade.value && selectedYear.value) {
      await scoreStore.generateScoresFromHistorical(selectedEvent.value, selectedType.value, selectedGrade.value, selectedYear.value);
    }
  };
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
  