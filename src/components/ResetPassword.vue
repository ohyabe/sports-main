<template>
  <div class="reset-password-container">
    <h1>重置密碼</h1>
    <form @submit.prevent="handleResetPassword">
      <!-- 新密碼輸入框 -->
      <label for="new-password">新密碼</label>
      <input type="password" id="new-password" v-model="newPassword" placeholder="請輸入你的新密碼" required>
      <!-- 確認新密碼輸入框 -->
      <label for="confirm-password">確認新密碼</label>
      <input type="password" id="confirm-password" v-model="confirmPassword" placeholder="請確認你的新密碼" required>
      <button type="submit">提交</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'; // 從 Vue 中引入 ref 方法
import { useRouter, useRoute } from 'vue-router'; // 從 vue-router 中引入 useRouter 和 useRoute 方法

// 定義新密碼和確認密碼的變數
const newPassword = ref('');
const confirmPassword = ref('');
const router = useRouter();
const route = useRoute();

// 定義處理重置密碼的方法
const handleResetPassword = async () => {
  // 檢查兩次輸入的密碼是否一致
  if (newPassword.value !== confirmPassword.value) {
    alert('兩次輸入的密碼不一致');
    return;
  }

  const token = route.query.token; // 獲取 URL 中的 token
  // 打印 token ，到後台確認前端獲取是否正確***********
  // console.log("Token:", token); 

  try {
    // 發送重置密碼請求到後端
    const response = await fetch("http://localhost:8080/sports_system/reset_password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
        new_password: newPassword.value
      })
    });

    // 檢查響應是否成功
    if (!response.ok) {
      const errorMessage = await response.text();
      if (response.status === 400) {
        if (errorMessage === "New password cannot be the same as the old password") {
          alert('新密碼不可以與舊密碼相同');
        } else if (errorMessage === "Invalid or expired token") {
          alert('無效或過期的 token');
        } else {
          alert('重置密碼失敗，請稍後再試。');
        }
      } else {
        alert('重置密碼失敗，請稍後再試。');
      }
      return;
    }

    // 成功重置密碼後的操作
    alert('密碼重置成功');
    router.push('/login');
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    alert('重置密碼失敗，請稍後再試。');
  }
};
</script>

<style scoped>
/* 重置密碼頁面樣式 */
.reset-password-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3.5%;
  background: #f0f0f0;
}

.reset-password-container h1 {
  color: #333;
  margin-bottom: 10px;
  font-size: 24px;
}

.reset-password-container form {
  width: 400px;
  max-width: 100%;
  background-color: #fff;
  padding: 60px 40px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: left;
}

.reset-password-container label {
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
  display: block;
}

.reset-password-container input {
  width: calc(100% - 20px);
  padding: 10px;
  margin: 10px 0 20px 0;
  border-radius: 5px;
  border: 1px solid #ccc;
  box-sizing: border-box;
  font-size: 14px;
}

.reset-password-container button {
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

.reset-password-container button:hover {
  background: #218838;
}
</style>
