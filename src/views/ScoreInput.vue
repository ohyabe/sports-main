<template>
  <div class="content">
    <a-form layout="inline">
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

    <a-table :dataSource="scores" :columns="columns" rowKey="classCode" style="margin-top: 20px">
      <template #headerCell="{ column }">
        <template v-if="column.key === 'rank'">
          <div>
            {{ column.title }}
            <a-button type="primary" @click="generateRanks" style="margin-left: 10px;background-color: rgb(216, 125, 125)">產生名次</a-button>
            <a-button type="primary" @click="generateAllCertificates" style="margin-left: 10px;">生成所有獎狀</a-button>
          </div>
        </template>
        <template v-else>
          {{ column.title }}
        </template>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'timeOrDistance'">
          <a-input v-model:value="record.timeOrDistance" @change="e => handleChange(record.classCode, 'timeOrDistance', e.target.value)" />
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
</template>

<script setup>
import { ref, watch } from 'vue';
import { useScoreStore } from '../stores/score.js';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

const scoreStore = useScoreStore();
const { events, scores, selectedEvent, selectedType, selectedGrade } = storeToRefs(scoreStore);
const router = useRouter();

const isDistanceEvent = ref(false);

const columns = ref([
  { title: '賽程項目', dataIndex: 'eventName', key: 'eventName' },
  { title: '組別', dataIndex: 'group', key: 'group' },
  { title: '預決賽', dataIndex: 'stage', key: 'stage' },
  { title: '班級代碼', dataIndex: 'classCode', key: 'classCode' },
  { title: '姓名', dataIndex: 'name', key: 'name' },
  { title: '成績(時間)', dataIndex: 'timeOrDistance', key: 'timeOrDistance' },
  { title: '名次', dataIndex: 'rank', key: 'rank' },
]);

watch([selectedEvent, selectedType, selectedGrade], () => {
  generateScores();
});

const handleEventChange = event => {
  selectedEvent.value = event;
  updateColumns();
  generateScores();
};

const handleTypeChange = type => {
  selectedType.value = type;
  generateScores();
};

const handleGradeChange = grade => {
  selectedGrade.value = grade;
  generateScores();
};

const updateColumns = () => {
  const event = events.value.find(e => e.id === selectedEvent.value);
  if (['跳高', '跳遠', '鉛球'].includes(event.name)) {
    columns.value = [
      { title: '賽程項目', dataIndex: 'eventName', key: 'eventName' },
      { title: '組別', dataIndex: 'group', key: 'group' },
      { title: '預決賽', dataIndex: 'stage', key: 'stage' },
      { title: '班級代碼', dataIndex: 'classCode', key: 'classCode' },
      { title: '姓名', dataIndex: 'name', key: 'name' },
      { title: '成績(距離)', dataIndex: 'timeOrDistance', key: 'timeOrDistance' },
      { title: '名次', dataIndex: 'rank', key: 'rank' },
    ];
    isDistanceEvent.value = true;
  } else {
    columns.value = [
      { title: '賽程項目', dataIndex: 'eventName', key: 'eventName' },
      { title: '組別', dataIndex: 'group', key: 'group' },
      { title: '預決賽', dataIndex: 'stage', key: 'stage' },
      { title: '班級代碼', dataIndex: 'classCode', key: 'classCode' },
      { title: '姓名', dataIndex: 'name', key: 'name' },
      { title: '成績(時間)', dataIndex: 'timeOrDistance', key: 'timeOrDistance' },
      { title: '名次', dataIndex: 'rank', key: 'rank' },
    ];
    isDistanceEvent.value = false;
  }
};

const generateScores = () => {
  if (selectedEvent.value && selectedType.value && selectedGrade.value) {
    scoreStore.generateScores(selectedEvent.value, selectedType.value, selectedGrade.value);
  }
};

const generateRanks = () => {
  scoreStore.updateRanks();
};

const handleChange = (classCode, field, value) => {
  scoreStore.updateScore(classCode, field, value);
};

const generateAllCertificates = () => {
  const certificates = scores.value
    .filter(record => [1, 2, 3].includes(record.rank))
    .map(record => ({
      event: record.eventName,
      className: record.classCode,
      name: record.name,
      rank: record.rank,
      year: new Date().getFullYear() // 假設獎狀的學年度是當前年
    }));
  if (certificates.length > 0) {
    router.push({
      name: 'CertificatePage',
      params: { certificates }
    });
  } else {
    alert("沒有前3名的成績可生成獎狀");
  }
};
</script>

<style scoped>
.content {
  padding: 3.5% 0;
  background-color: #f0f0f0;
}
:where(.css-dev-only-do-not-override-19iuou).ant-table-wrapper {
  clear: both;
  margin: 50px;
  max-width: 100%;
}
:where(.css-dev-only-do-not-override-19iuou).ant-form {
  margin: 30px 60px;
}
</style>
