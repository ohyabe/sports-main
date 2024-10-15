<template>
  <div class="container">
    <header>
      <h1>【運動會系統·問題&意見回饋】</h1>
    </header>
    
    <section class="description">
      <p>
        若對運動會賽程或使用系統上有任何疑問，請在下方提出疑問，我們將盡快為您解決。
      </p>
    </section>
    
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <div class="form-item">
          <label>1.請選擇年級：</label>
          <select v-model="grade" @change="updateClassOptions" required>
            <option disabled value="">請選擇年級</option>
            <option value="高一">高一</option>
            <option value="高二">高二</option>
            <option value="高三">高三</option>
          </select>
        </div>

        <div class="form-item">
          <label>2.請選擇班級代碼：</label>
          <select v-model="classes" required>
            <option disabled value="">請選擇班級代碼</option>
            <option v-for="classOption in classOptions" :key="classOption" :value="classOption">
              {{ classOption }}
            </option>
          </select>
        </div>

        <div class="form-item">
          <label>3.請輸入你的名字：</label>
          <input type="text" v-model="studentName" placeholder="請輸入你的名字" required />
        </div>

        <div class="form-item">
          <label>4.請選擇提出問題的種類： (單選)</label>
          <div class="radio-group">
            <!-- <input type="radio" value="賽事" v-model="issueType" /> 賽事相關問題 -->
            <input type="radio" value="系統" v-model="issueType" /> 系統相關問題
          </div>
        </div>

        <div class="form-item" v-if="issueType === '賽事'">
          <label>5.反應的對象(老師姓名):</label>
          <input type="text" v-model="teacherName" placeholder="請輸入老師姓名" required />
        </div>

        <div class="form-item">
          <label>{{ issueType === '賽事' ? '6.請在此留下您的問題或建議內容' : '5.請在此留下您的問題或建議內容' }}</label>
          <textarea v-model="detailedInfo" rows="4" placeholder="請填寫文字(600字以內)" required></textarea>
        </div>
      </div>

      <div class="form-group button-container">
        <button type="submit">送出</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'CreateQuestion',
  data() {
    return {
      grade: '',
      classes: '',
      studentName: '',
      issueType: '系統',//預設微系統
      detailedInfo: '',
      teacherName: '', // 新增的數據字段
      classOptions: [] // 用于存储班级选项
    };
  },
  methods: {
    updateClassOptions() {
      const gradeClassMap = {
        '高一': ['101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112', '113', '114', '115', '116'],
        '高二': ['201', '202', '203', '204', '205', '206', '207', '208', '209', '210', '211', '212', '213', '214', '215', '216'],
        '高三': ['301', '302', '303', '304', '305', '306', '307', '308', '309', '310', '311', '312', '313', '314', '315', '316']
      };
      this.classOptions = gradeClassMap[this.grade] || [];
      this.classes = ''; // 重置班级选择
    },
    handleSubmit() {
      const feedbackData = {
        grade: this.grade,
        classes: this.classes,
        studentName: this.studentName,
        issueType: this.issueType,
        detailedInfo: this.detailedInfo,
        teacherName: this.issueType === '賽事' ? this.teacherName : null, // 只有賽事問題才包含 teacherName
        issueReportTime: new Date().toISOString().split('T')[0] // 获取当前日期并格式化为 YYYY-MM-DD
      };
      console.log('Submitted Feedback:', feedbackData);
      
      fetch('http://localhost:8080/question/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(feedbackData)
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
        alert('表單已提交');
        // 這裡可以添加提交成功後的邏輯
      })
      .catch(error => {
        console.error('Error:', error);
        // 這裡可以添加提交失敗後的邏輯
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

.description {
  background-color: #f5f5f5;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 20px;
}

.form-item {
  margin-bottom: 20px; /* 增加行列之間的距離 */
}

.radio-group  {
  margin-top: 10px;
  display: block;
  margin-bottom: 10px;
  margin-left:-80px;
}

select, input[type="text"], textarea {
  width: 100%;
  padding: 10px;
  margin-top: 10px; /* 內部元素之間的間距 */
  border: 1px solid #cccccc;
  border-radius: 4px;
}

.button-container {
  display: flex;
  justify-content: flex-end;
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
  cursor: pointer;
  border-radius: 4px;
}
</style>
