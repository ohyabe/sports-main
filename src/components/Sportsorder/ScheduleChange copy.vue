<template>
  <div id="app">
    <h1>賽程表</h1>
    <table>
      <thead>
        <tr>
          <th>賽事項目</th>
          <th>圖片</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in courseImages" :key="index">
          <td>{{ item.courseItem }}</td>
          <td><img :src="'data:image/jpeg;base64,' + item.base64Image" alt="Image" /></td>
          <td>
            <input type="file" @change="handleFileUpload($event, index)" />
            <button @click="uploadImage(index)">上傳</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      courseImages: [], // 用於存儲從數據庫獲取的項目和圖片
      selectedFiles: {} // 用於存儲選中的文件
    };
  },
  mounted() {
    this.fetchCourseImages(); // 組件掛載後立即獲取項目和圖片
  },
  methods: {
    async fetchCourseImages() {
      try {
        const response = await axios.get('http://localhost:8080/upload/course-images'); // 確認這裡的路徑與後端匹配
        this.courseImages = response.data;
      } catch (error) {
        console.error('Error fetching course images:', error);
      }
    },
    handleFileUpload(event, index) {
      this.selectedFiles[index] = event.target.files[0];
    },
    async uploadImage(index) {
      const file = this.selectedFiles[index];
      if (!file) {
        alert('請選擇文件後再上傳');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('courseItem', this.courseImages[index].courseItem);

      try {
        const response = await axios.post('http://localhost:8080/upload/update-image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        this.courseImages[index].base64Image = response.data.base64Image;
        alert('圖片上傳成功');
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  }
};
</script>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  align-items: center;
}
table {
  border-collapse: collapse;
  width: 80%;
}
th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}
img {
  max-width: 100px;
  height: auto;
}
input[type="file"] {
  margin-bottom: 10px;
}
button {
  margin-top: 5px;
}
</style>
