<template>
  <div class="content">
    <el-card class="contact-card">
      <div class="contact-title">聯絡我們</div>
      <el-form :model="form">
        <el-form-item>
          <el-input v-model="form.fullName" placeholder="請輸入姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.phone" placeholder="請輸入手機號碼"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.email" placeholder="請輸入信箱"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.subject" placeholder="請輸入標題"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="form.message"
            type="textarea"
            placeholder="內容"
            :rows="5"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="sendEmail">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'ContactUs',
  setup() {
    const form = ref({
      fullName: '',
      phone: '',
      email: '',
      subject: '',
      message: ''
    });

    const validateForm = () => {
      if (!form.value.fullName) {
        alert("請輸入姓名");
        return false;
      }
      if (!form.value.phone) {
        alert("請輸入手機號碼");
        return false;
      }
      if (!form.value.email) {
        alert("請輸入信箱");
        return false;
      }
      if (!form.value.subject) {
        alert("請輸入標題");
        return false;
      }
      if (!form.value.message) {
        alert("請輸入內容");
        return false;
      }
      return true;
    };

    const sendEmail = () => {
      if (!validateForm()) {
        return;
      }

      fetch('http://localhost:8080/api/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: form.value.fullName,
          phone: form.value.phone,
          email: form.value.email,
          subject: form.value.subject,
          message: form.value.message,
        }),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.text(); // 如果後端返回的是字串
        })
        .then(data => {
          alert('郵件發送成功');
        })
        .catch(error => {
          console.error('發送郵件時出錯:', error);
          alert('發送郵件時出錯');
        });
    };

    return {
      form,
      sendEmail
    };
  }
});
</script>

<style scoped>
.content {
  height: 100%;
  padding: 3.5%;
  background-color: #f0f0f0;
}
.contact-card {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}
.contact-title {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}
.el-input,
.el-button {
  width: 100%;
}
.el-button {
  display: block;
  margin-top: 10px;
}
</style>
