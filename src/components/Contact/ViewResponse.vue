<template>
  <div class="container">
    <header>
      <h1>查看和搜索問題</h1>
    </header>

    <div class="search-bar">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="搜尋您的問題（可輸入姓名或提問內容）"
      />
    </div>

    <section v-if="filteredQuestions.length">
      <div
        v-for="(question, index) in filteredQuestions"
        :key="question.id"
        :class="['question-item', index % 2 === 0 ? 'even' : 'odd']"
      >
        <p><strong>班級代碼:</strong> {{ question.classes }}</p>
        <p><strong>名字:</strong> {{ question.studentName }}</p>
        <p><strong>問題類型:</strong> {{ question.issueType }}</p>
        <p><strong>問題內容:</strong> {{ question.detailedInfo }}</p>
        <p><strong>提問日期:</strong> {{ formatDate(question.issueReportTime) }}</p>
        <p>
          <strong>回應內容:</strong>
          <span v-if="question.teacherResponse || question.systemResponse">
            {{ question.teacherResponse || question.systemResponse }}
          </span>
          <span v-else>尚未回覆此問題</span>
        </p>
        <p v-if="question.teacherResponse || question.systemResponse">
          <strong>回應日期:</strong>
          <span v-if="question.issueResponseTime">{{ formatDate(question.issueResponseTime) }}</span>
          <span v-else>尚未回覆此問題</span>
        </p>
      </div>
    </section>

    <section v-else>
      <p>目前沒有問題資料。</p>
    </section>
  </div>
</template>

<script>
export default {
  name: 'ViewResponse',
  data() {
    return {
      questions: [],
      searchQuery: ''
    };
  },
  computed: {
    filteredQuestions() {
      return this.questions.filter(question => {
        const lowerSearchQuery = this.searchQuery.toLowerCase();
        return (
          question.studentName.toLowerCase().includes(lowerSearchQuery) ||
          question.detailedInfo.toLowerCase().includes(lowerSearchQuery)
        );
      });
    }
  },
  methods: {
    fetchQuestions() {
      fetch('http://localhost:8080/question/all')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          // 檢查資料格式，並確保日期格式正確
          this.questions = data.map(question => {
            if (!Array.isArray(question.issueReportTime)) {
              question.issueReportTime = question.issueReportTime ? question.issueReportTime.split('-') : [];
            }
            if (!Array.isArray(question.issueResponseTime)) {
              question.issueResponseTime = question.issueResponseTime ? question.issueResponseTime.split('-') : [];
            }
            return question;
          });
        })
        .catch(error => {
          console.error('There has been a problem with your fetch operation:', error);
        });
    },
    formatDate(dateArray) {
      if (!dateArray || dateArray.length !== 3) {
        return '';
      }
      return `${dateArray[0]}-${dateArray[1]
        .toString()
        .padStart(2, '0')}-${dateArray[2].toString().padStart(2, '0')}`;
    }
  },
  mounted() {
    this.fetchQuestions();
  }
};
</script>

<style scoped>
.container {
  font-family: Arial, sans-serif;
  margin: 0 auto;
  padding: 20px;
  max-width: 650px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

header {
  background-color: #c5d9e3;
  padding: 20px;
  border-bottom: 1px solid #c5d9e3;
  text-align: center;
}

.search-bar {
  margin-bottom: 20px;
}

.search-bar input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-top: 20px;
}

.question-item {
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.question-item.even {
  background-color: #ffffff;
}

.question-item.odd {
  background-color: #eaf4f9;
}

.question-item p {
  margin: 5px 0;
}
</style>
