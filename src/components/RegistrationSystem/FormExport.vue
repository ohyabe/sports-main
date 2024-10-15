<template>
    <div class="tabs-container">
      <a-tabs defaultActiveKey="1" @change="handleTabChange" centered>
        <a-tab-pane key="1" tab="檢錄單匯出">
          <div class="container">
            <a-form layout="inline" :style="{ display: 'flex', alignItems: 'center' }">
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
              <a-form-item>
                <a-button type="primary" @click="downloadPDF" style="background-color: rgb(97 192 205);">下載PDF</a-button>
              </a-form-item>
            </a-form>
  
            <div id="contentToPrint">
              <div v-if="tableInfo" class="table-info">
                {{ tableInfo }}
              </div>
              <a-table :dataSource="scores" :pagination="false" :columns="filteredColumns" rowKey="id" style="margin-top: 20px">
                <template #headerCell="{ column }">
                  <template v-if="column.key !== 'rank'">
                    {{ column.title }}
                  </template>
                </template>
                <template #bodyCell="{ column, record }">
                  <template v-if="column.key === 'projectPerformance'">
                    <a-input v-model:value="record.tempProjectPerformance" placeholder=" " @change="e => handleChange(record.id, selectedEvent, 'tempProjectPerformance', e.target.value)" />
                  </template>
                  <template v-else-if="column.key === 'rank'">
                    <a-input v-model:value="record.tempRank" placeholder=" " @change="e => handleChange(record.id, selectedEvent, 'tempRank', e.target.value)" />
                  </template>
                  <template v-else-if="column.key === 'group'">
                    <a-input v-model:value="record.group" placeholder=" " @change="e => handleChange(record.id, selectedEvent, 'group', e.target.value)" />
                  </template>
                  <template v-else-if="column.key === 'groupRank'"> <!-- 新增組別排名的輸入框 -->
                    <a-input v-model:value="record.groupRank" placeholder=" " @change="e => handleChange(record.id, selectedEvent, 'groupRank', e.target.value)" />
                  </template>
                  <template v-else>
                    {{ record[column.key] }}
                  </template>
                </template>
              </a-table>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </template>
  
  <script setup>
  import { useScoreStore } from '@/stores/score.js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref, watch } from 'vue';
  
  const scoreStore = useScoreStore();
  const { events, scores, selectedEvent, selectedType, selectedGrade } = storeToRefs(scoreStore);
  
  const selectedYear = ref(null);
  const academicYears = ref([]);
  
  const columns = ref([
    { title: '賽程項目', dataIndex: 'courseItem', key: 'courseItem' },
    { title: '預決賽', dataIndex: 'preMatch', key: 'preMatch' },
    { title: '班級代碼', dataIndex: 'classes', key: 'classes', width: 100 },
    { title: '姓名', dataIndex: 'studentName', key: 'studentName' },
    { title: '組別', dataIndex: 'group', key: 'group', width: 100 },
    { title: '組別名次', dataIndex: 'groupRank', key: 'groupRank', width: 100 }, // 新增組別排名
    { title: '成績', dataIndex: 'projectPerformance', key: 'projectPerformance' },
    { title: '名次', dataIndex: 'rank', key: 'rank', width: 100 },
  ]);
  
  const filteredColumns = computed(() => {
    if ([1, 2, 3, 4, 5, 6, 17].includes(selectedEvent.value) && selectedType.value === '預賽') {
      return columns.value;
    }
    return columns.value.filter(column => column.key !== 'group');
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
  
  const handleYearChange = async year => {
    selectedYear.value = year;
    await generateScores();
  };
  
  const generateScores = async () => {
    if (selectedEvent.value && selectedType.value && selectedGrade.value && selectedYear.value) {
      await scoreStore.generateScores(selectedEvent.value, selectedType.value, selectedGrade.value);
    }
    scoreStore.scores.forEach(score => {
      score.tempProjectPerformance = '';
      score.tempRank = '';
      score.groupRank = ''; // 初始化組別排名
    });
  };
  
  const handleChange = (id, itemId, field, value) => {
    scoreStore.updateScore(id, itemId, field, value);
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
  
  const downloadPDF = async () => {
    const content = document.getElementById('contentToPrint');
    const canvas = await html2canvas(content);
  
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('scores.pdf');
  };
  
  const tableInfo = computed(() => {
    if (selectedYear.value && selectedEvent.value && selectedType.value && selectedGrade.value) {
      const event = events.value.find(event => event.id === selectedEvent.value);
      return `${selectedYear.value}年 ${event.name} ${event.group} ${selectedType.value} ${selectedGrade.value} 表單`;
    }
    return '';
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
  
  :where(.css-dev-only-do-not-override-19iuou).ant-table-wrapper {
   clear: both;
   margin: 50px;
   max-width: 100%;
  }
  
  :where(.css-dev-only-do-not-override-19iuou).ant-form {
   margin: 30px 60px;
   display: flex;
   align-items: center;
  }
  .ant-table-tbody > tr:nth-child(odd) > td {
    background-color: #eaf4f9 !important; 
  }
  
  .ant-table-tbody > tr:nth-child(even) > td {
    background-color: #ffffff !important; 
  }
  
  .table-info {
    margin: 20px;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
  }
  </style>
  