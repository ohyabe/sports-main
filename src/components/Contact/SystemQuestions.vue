<template>
  <div class="container">
    <header>
      <h1>系統相關問題</h1>
    </header>

    <section class="questions">
      <div v-for="question in systemQuestions" :key="question.id" class="question-box">
        <p><strong>班級代碼:</strong> {{ question.classes }}</p>
        <p><strong>名字:</strong> {{ question.studentName }}</p>
        <p><strong>問題內容:</strong> {{ question.detailedInfo }}</p>
        <p><strong>提交時間:</strong> {{ Array.isArray(question.issueReportTime) ? question.issueReportTime.join('-') : question.issueReportTime }}</p>
        <p><strong>系統回覆:</strong> {{ question.systemResponse || "尚未回覆" }}</p>
        <p><strong>回覆時間:</strong> {{ question.issueResponseTime || "尚未回覆" }}</p>
        
        <div class="button-container">
          <button @click="toggleResponseInput(question.id)">
            {{ question.systemResponse ? "更新回復" : "回覆問題" }}
          </button>
        </div>
        
        <div v-if="question.showResponseInput" class="response-input">
          <textarea v-model="question.systemResponse" placeholder="輸入您的回覆"></textarea>
          <button @click="submitResponse(question)">提交回覆</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      systemQuestions: []
    };
  },
  created() {
    this.fetchSystemQuestions();
  },
  methods: {
    fetchSystemQuestions() {
      fetch('http://localhost:8080/question/all')
        .then(response => response.json())
        .then(data => {
          this.systemQuestions = data.filter(question => question.issueType === "系統").map(question => {
            // 檢查 issueReportTime 是否為陣列，如果不是則保持原樣
            if (!Array.isArray(question.issueReportTime)) {
              question.issueReportTime = [question.issueReportTime];
            }
            return { ...question, showResponseInput: false };
          });
        })
        .catch(error => {
          console.error('Error:', error);
        });
    },
    toggleResponseInput(questionId) {
      const question = this.systemQuestions.find(q => q.id === questionId);
      question.showResponseInput = !question.showResponseInput;
    },
    submitResponse(question) {
      const payload = {
        id: question.id,
        teacherResponse: question.teacherResponse,
        systemResponse: question.systemResponse,
        issueResponseTime: new Date().toISOString().split('T')[0] // 將日期轉換為 LocalDate 格式 (YYYY-MM-DD)
      };

      console.log('Submitting response:', payload); // 調試用

      fetch('http://localhost:8080/question/response', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Network response was not ok.');
        }
      })
      .then(data => {
        console.log('Success:', data);
        question.showResponseInput = false;
        question.issueResponseTime = payload.issueResponseTime; // 更新回覆時間
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }
  }
}
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

.questions {
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
}

.question-box {
  border: 1px solid #cccccc;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 20px;
  position: relative;
}

.question-box p {
  margin: 5px 0;
}

.button-container {
  position: absolute;
  right: 10px;
  bottom: 10px;
}

button {
  background-color: #61c0cd;
  color: white;
  border: none;
  padding: 6px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 4px;
}

.response-input {
  margin-top: 10px;
}

.response-input textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #cccccc;
  border-radius: 4px;
}
</style>
