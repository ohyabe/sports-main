<template>
  <div>
    <div class="tabs-container">
      <a-tabs defaultActiveKey="1" @change="handleTabChange" centered>
        <a-tab-pane key="1" tab="決賽名次">
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
            <a-form-item label="年級">
              <a-select v-model="selectedGrade" style="width: 100px" @change="handleGradeChange">
                <a-select-option value="高一">高一</a-select-option>
                <a-select-option value="高二">高二</a-select-option>
                <a-select-option value="高三">高三</a-select-option>
              </a-select>
            </a-form-item>
          </a-form>

          <a-table :dataSource="finalScores" :columns="finalColumns" rowKey="id" style="margin-top: 20px">
            <template #headerCell="{ column }">
              <div>
                {{ column.title }}
              </div>
            </template>
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'rank'">
                <span>{{ record.rank }}</span>
              </template>
              <template v-else-if="column.key === 'certificate'">
                <span v-if="record.rank <= 3">
                  <a @click="downloadCertificate(record, 'final')">下載獎狀</a>
                </span>
              </template>
              <template v-else>
                {{ record[column.key] }}
              </template>
            </template>
          </a-table>
        </a-tab-pane>
        <a-tab-pane key="2" tab="總錦標">
          <a-form layout="inline">
            <a-form-item label="年度">
              <a-select v-model="selectedYear" style="width: 100px" @change="handleYearChange">
                <a-select-option v-for="year in academicYears" :key="year" :value="year">
                  {{ year }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="年級">
              <a-select v-model="selectedGrade" style="width: 100px" @change="handleTotalGradeChange">
                <a-select-option value="高一">高一</a-select-option>
                <a-select-option value="高二">高二</a-select-option>
                <a-select-option value="高三">高三</a-select-option>
              </a-select>
            </a-form-item>
          </a-form>
          <a-table :dataSource="totalScores" :columns="totalColumns" rowKey="classes" style="margin-top: 20px">
            <template #headerCell="{ column }">
              <div>{{ column.title }}</div>
            </template>
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'totalRank'">
                <span>{{ record.totalRank }}</span>
              </template>
              <template v-else-if="column.key === 'certificate'">
                <span v-if="record.totalRank <= 3">
                  <a @click="downloadCertificate(record, 'total')">下載獎狀</a>
                </span>
              </template>
              <template v-else>
                {{ record[column.key] }}
              </template>
            </template>
          </a-table>
        </a-tab-pane>
        <a-tab-pane key="3" tab="打破紀錄">
          <a-form layout="inline">
          </a-form>
          <a-table :dataSource="breakRecords" :columns="breakColumns" rowKey="id" style="margin-top: 20px">
            <template #headerCell="{ column }">
              <div>{{ column.title }}</div>
            </template>
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'certificate'">
                <a @click="downloadCertificate(record, 'break')">下載獎狀</a>
              </template>
              <template v-else>
                {{ record[column.key] }}
              </template>
            </template>
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </div>
    <div ref="certificateContent" class="certificate-content" style="display: none;">
      <div class="title">國立歸仁高級中學獎狀</div>
      <div class="content" v-if="currentTab === '1'">
        國立歸仁高級中學<span id="academicYear"></span>年運動會<br><br>
        項目：<span id="courseItem"></span><br>
        班級：<span id="classes"></span><br>
        <span v-if="!hideStudentName">姓名：<span id="studentName"></span><br></span>
        成績：<span id="projectPerformance"></span><br>
        名次：第<span id="rank"></span>名<br><br>
        成績優異 特頒獎狀 以資鼓勵
      </div>
      <div class="content" v-else-if="currentTab === '2'">
        國立歸仁高級中學<span id="academicYear"></span>年運動會<br><br>
        項目：<span>年級精神總錦標競賽</span><br>
        班級：<span id="classes"></span><br>
        總積分：<span id="totalScore"></span><br>
        名次：第<span id="rank"></span>名<br><br>
        成績優異 特頒獎狀 以資鼓勵
      </div>
      <div class="content" v-else-if="currentTab === '3'">
        國立歸仁高級中學<span id="academicYear"></span>年運動會<br><br>
        項目：<span id="courseItem"></span><br>
        班級：<span id="classes"></span><br>
        <span v-if="!hideStudentName">姓名：<span id="studentName"></span><br></span>
        成績：<span id="projectPerformance"></span><br>
        成功刷新競賽紀錄<br><br>
        成績優異 特頒獎狀 以資鼓勵
      </div>
      <div class="signature">校長朴敘俊</div>
    </div>
  </div>
</template>

<script setup>
import { useScoreStore } from '@/stores/score';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { storeToRefs } from 'pinia';
import { computed, nextTick, onMounted, ref, watch } from 'vue';

const scoreStore = useScoreStore();
const { events, scores, selectedEvent, selectedGrade } = storeToRefs(scoreStore);

const selectedYear = ref(null);
const academicYears = ref([]);
const currentTab = ref('1');

const finalColumns = ref([
  { title: '歷史成績', dataIndex: 'historicalPerformance', key: 'historicalPerformance' },
  { title: '賽程項目', dataIndex: 'courseItem', key: 'courseItem' },
  { title: '預決賽', dataIndex: 'preMatch', key: 'preMatch' },
  { title: '班級代碼', dataIndex: 'classes', key: 'classes' },
  { title: '姓名', dataIndex: 'studentName', key: 'studentName' },
  { title: '成績', dataIndex: 'projectPerformance', key: 'projectPerformance' },
  { title: '名次', dataIndex: 'rank', key: 'rank' },
  { title: '獎狀', dataIndex: 'certificate', key: 'certificate' }
]);

const totalColumns = ref([
  { title: '班級代碼', dataIndex: 'classes', key: 'classes' },
  { title: '總積分', dataIndex: 'totalScore', key: 'totalScore' },
  { title: '總錦標名次', dataIndex: 'totalRank', key: 'totalRank' },
  { title: '獎狀', dataIndex: 'certificate', key: 'certificate' }
]);

const breakColumns = ref([
  { title: '歷史成績', dataIndex: 'historicalPerformance', key: 'historicalPerformance' },
  { title: '賽程項目', dataIndex: 'courseItem', key: 'courseItem' },
  { title: '預決賽', dataIndex: 'preMatch', key: 'preMatch' },
  { title: '班級代碼', dataIndex: 'classes', key: 'classes' },
  { title: '姓名', dataIndex: 'studentName', key: 'studentName' },
  { title: '成績', dataIndex: 'projectPerformance', key: 'projectPerformance' },
  { title: '名次', dataIndex: 'ranking', key: 'ranking' },
  { title: '獎狀', dataIndex: 'certificate', key: 'certificate' }
]);

const finalScores = ref([]);
const totalScores = ref([]);
const breakRecords = ref([]);

watch([selectedEvent, selectedGrade, selectedYear], async () => {
  await generateScores();
});

const handleEventChange = async event => {
  selectedEvent.value = event;
  await generateScores();
};

const handleGradeChange = async grade => {
  selectedGrade.value = grade;
  await generateScores();
};

const handleTotalGradeChange = async grade => {
  selectedGrade.value = grade;
  await generateTotalScores();
};

const handleYearChange = async year => {
  selectedYear.value = year;
  await generateScores();
};

const handleTabChange = async key => {
  currentTab.value = key;
  if (key === '3') {
    await fetchBreakRecords();
  }
};

const generateScores = async () => {
  if (selectedEvent.value && selectedGrade.value && selectedYear.value) {
    await scoreStore.generateScores(selectedEvent.value, '決賽', selectedGrade.value);
    finalScores.value = scores.value.filter(score => score.preMatch === '決賽');
  }
};

const generateTotalScores = async () => {
  const response = await fetch('http://localhost:8080/score/individualPerformances/item/1');
  const data = await response.json();

  const classRange = {
    '高一': ['101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112', '113', '114', '115', '116'],
    '高二': ['201', '202', '203', '204', '205', '206', '207', '208', '209', '210', '211', '212', '213', '214', '215', '216'],
    '高三': ['301', '302', '303', '304', '305', '306', '307', '308', '309', '310', '311', '312', '313', '314', '315', '316']
  }[selectedGrade.value];

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
  breakRecords.value = data.map(record => ({ ...record, certificate: '下載獎狀' }));
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

const submitScores = async () => {
  await scoreStore.submitScores();
};

const hideStudentName = computed(() => {
  return [17, 18, 19].includes(parseInt(selectedEvent.value));
});

const downloadCertificate = async (record, type) => {
  try {
    const certificateContent = document.querySelector('.certificate-content');
    if (!certificateContent) {
      console.error('Certificate content not found');
      return;
    }

    if (type === 'final') {
      certificateContent.querySelector('#academicYear').textContent = record.academicYear;
      certificateContent.querySelector('#courseItem').textContent = record.courseItem;
      certificateContent.querySelector('#classes').textContent = record.classes;
      if (!hideStudentName.value) {
        certificateContent.querySelector('#studentName').textContent = record.studentName;
      }
      certificateContent.querySelector('#projectPerformance').textContent = record.projectPerformance;
      certificateContent.querySelector('#rank').textContent = record.rank || record.ranking;
    } else if (type === 'total') {
      certificateContent.querySelector('#academicYear').textContent = record.academicYear;
      certificateContent.querySelector('#classes').textContent = record.classes;
      certificateContent.querySelector('#totalScore').textContent = record.totalScore;
      certificateContent.querySelector('#rank').textContent = record.totalRank;
    } else if (type === 'break') {
      certificateContent.querySelector('#academicYear').textContent = record.academicYear;
      certificateContent.querySelector('#courseItem').textContent = record.courseItem;
      certificateContent.querySelector('#classes').textContent = record.classes;
      if (!hideStudentName.value) {
        certificateContent.querySelector('#studentName').textContent = record.studentName;
      }
      certificateContent.querySelector('#projectPerformance').textContent = record.projectPerformance;
    }

    await nextTick();

    certificateContent.style.display = 'block';

    html2canvas(certificateContent).then(canvas => {
      const imgData = canvas.toDataURL('image/jpeg');
      const pdf = new jsPDF('p', 'mm', 'a4');
      console.log('Adding image to PDF');
      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
      console.log('Saving PDF');
      pdf.save(`${type}_certificate_${record.id}.pdf`);

      certificateContent.style.display = 'none';
    }).catch(err => {
      console.error('Error generating PDF:', err);
      certificateContent.style.display = 'none';
    });
  } catch (err) {
    console.error('Error in downloadCertificate function:', err);
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

.certificate-content {
  width: 210mm;
  height: 297mm;
  border: 1px solid #000;
  padding: 20mm;
  margin: 0 auto;
  position: relative;
  background-image: url('/certificate.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  font-family: 'DFKai-SB', '標楷體', serif;
}
.title {
  text-align: center;
  font-size: 45px;
  font-weight: bold;
  margin-top: 20mm;
}
.content {
  text-align: left;
  font-size: 25px;
  margin-top: 30mm;
  margin-left: 20mm;
}
.signature {
  position: absolute;
  bottom: 30mm;
  right: 30mm;
  font-size: 70px;
}
.seal {
  position: absolute;
  bottom: 30mm;
  left: 30mm;
  width: 40mm;
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
