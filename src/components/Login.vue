<template>
  <div class="left-side">
    <div class="login-container">
      <h1>登入</h1>
      <p>請登入以訪問系統</p>
      <P>學生測試帳號:A00001 密碼:UMY63aLakgD9SMj<br>
            管理員測試帳號:123 密碼:123<br>
            老師測試帳號:101 密碼:QE7X00bUst321t3
          </P>

      <form @submit.prevent="handleSubmit">
        <label for="user_name">帳號</label>
        <input type="text" id="user_name" v-model="user_name" placeholder="請輸入你的帳號" required>
        <label for="password">密碼</label>
        <input type="password" id="password" v-model="password" placeholder="請輸入你的密碼" required>
        <label for="role">身分選擇</label>
        <select id="role" v-model="role" required>
          <option value="" disabled>身分選擇</option>
          <option value="student">學生</option>
          <option value="teacher">老師</option>
          <option value="admin">管理員</option>
        </select>
        <div class="forgot-password">
          <a href="#" @click.prevent="showForgotPasswordModal">忘記密碼?</a>
        </div>
        <button type="submit">登入</button>
      </form>
    </div>

    <div v-if="isForgotPasswordModalVisible" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeForgotPasswordModal">&times;</span>

        <h2>忘記密碼</h2>
        <form @submit.prevent="handleForgotPassword">
          <label for="reset-role">身分選擇</label>
          <select id="reset-role" v-model="resetRole" required>
            <option value="" disabled>選擇</option>
            <option value="student">學生</option>
            <option value="teacher">老師</option>
            <option value="admin">管理員</option>
          </select>
          <div class="area">
          <label for="reset-user_id">帳號</label>
          <input type="text" id="reset-user_id" v-model="resetUserId" placeholder="請輸入你的帳號" required>
        </div>
          <div class="area2">
          <label for="reset-email">信箱</label>
          <input type="email" id="reset-email" v-model="resetEmail" placeholder="請輸入你的信箱" required>
        </div>
          <button type="submit">提交</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { v4 as uuidv4 } from 'uuid'; // 引入 uuid 庫

const user_name = ref('');
const password = ref('');
const role = ref('');
const resetRole = ref('');
const resetUserId = ref('');
const resetEmail = ref('');
const isForgotPasswordModalVisible = ref(false);
const router = useRouter();
const store = useStore();

const handleSubmit = async () => {
  if (user_name.value && password.value && role.value) {
    try {
      const response = await fetch("http://localhost:8080/sports_system/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_name: user_name.value,
          password: password.value,
          role: role.value
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      store.dispatch('setUser', { userType: role.value, userName: data.name });

      if (role.value === 'admin') {
        router.push('/admin-home');
      } else if (role.value === 'student') {
        router.push('/student-home');
      } else if (role.value === 'teacher') {
        router.push('/teacher-home');
      }
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      alert('登入失敗，請檢查您的帳號、密碼和身份。');
    }
  }
};


const showForgotPasswordModal = () => {
  isForgotPasswordModalVisible.value = true;
};

const closeForgotPasswordModal = () => {
  isForgotPasswordModalVisible.value = false;
};

const handleForgotPassword = async () => {
  if (resetRole.value && resetUserId.value && resetEmail.value) {
    try {
      const response = await fetch("http://localhost:8080/sports_system/verify_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: resetUserId.value,
          role: resetRole.value,
          user_email: resetEmail.value,
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const data = await response.text(); // 假設後端返回的是純文本 "User verified"
      
      if (data.includes("User verified")) { // 檢查返回的內容是否包含 "User verified"
        const resetLink = `http://localhost:5173/reset_password?user=${resetUserId.value}&role=${resetRole.value}&token=${uuidv4()}`; // 使用 uuid 生成 token

        await sendResetPasswordEmail(resetEmail.value, resetLink);

        alert('重置密碼郵件已發送，連結於1小時候失效，請檢查您的信箱。');
        closeForgotPasswordModal();
      } else {
        throw new Error('Verification failed');
      }
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      alert(`發送重置密碼郵件失敗，錯誤信息: ${error.message}`);
    }
  }
};

// 模擬發送重置密碼的電子郵件
const sendResetPasswordEmail = async (email, link) => {
  // 測試，後台查看是否有發送成功*************************
  // console.log(`發送重置密碼郵件到 ${email}，鏈接：${link}`);
  // 您可以在這裡使用郵件 API 發送電子郵件
};
</script>

<style scoped>
body {
  display: flex;
  height: 100vh;
  margin: 0;
  font-family: Arial, sans-serif;
}
.left-side {
  padding: 3.5% 0;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f0f0f0;
}
.login-container {
  background-color: #fff;
  padding: 60px 40px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: left;
  width: 400px;
  max-width: 100%;
}
.login-container h1 {
  color: #333;
  margin-bottom: 10px;
  font-size: 24px;
  text-align: center;
}
.login-container p {
  color: #666;
  margin-bottom: 20px;
  font-size: 14px;
  text-align: center;
}
.login-container label {
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
  display: block;
}
.login-container input,
.login-container select {
  width: calc(100% - 20px);
  padding: 10px;
  margin: 10px 0 20px 0;
  border-radius: 5px;
  border: 1px solid #ccc;
  box-sizing: border-box;
  font-size: 14px;
}
.login-container input::placeholder,
.login-container select {
  color: #aaa;
}
.login-container button {
  background: #28a745;
  color: #fff;
  padding: 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: calc(100% - 20px);
  box-sizing: border-box;
  font-size: 16px;
  text-align: center;
}
.login-container button:hover {
  background: #218838;
}
.forgot-password {
  text-align: right;
  margin-bottom: 20px;
}
.forgot-password a {
  color: #007bff;
  text-decoration: none;
  font-size: 14px;
}
.forgot-password a:hover {
  text-decoration: underline;
}
.modal {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0,0,0);
  background-color: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background-color: #fefefe;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  max-width: 500px;
  border-radius: 10px;
  text-align: left;
}


  
  h2{
  text-align: center;
}



.close {
      /* 往上移動 */
      position: relative;
      top: 0;
      right: 0;
      
      color: #aaa;
      float: right;
      font-size: 28px;
      font-weight: bold;
}
.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
</style>
