<template>
  <div id="app">
    <h1>圖片上傳器</h1>
    <input type="file" ref="fileInput" @change="onFileChange" style="display: none;" accept="image/*" />
    <div v-if="imageUrl">
      <h2>預覽圖片</h2>
      <img :src="imageUrl" alt="Uploaded Image" />
    </div>

    <h1>賽事管理</h1>
    <table>
      <thead>
        <tr>
          <th>Academic Year</th>
          <th>Course Item</th>
          <th>Item ID</th>
          <th>Location</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="tournament in tournaments" :key="tournament.id">
          <td>{{ tournament.academicYear }}</td>
          <td>{{ tournament.courseItem }}</td>
          <td>{{ tournament.itemId }}</td>
          <td>{{ tournament.location }}</td>
          <td>
            <button @click="editTournament(tournament)">Edit</button>
            <button @click="deleteTournament(tournament.id)">Delete</button>
            <button @click="triggerFileInput(tournament.id)">Upload</button>
          </td>
        </tr>
      </tbody>
    </table>

    <form @submit.prevent="submitForm">
      <div>
        <label>Academic Year:</label>
        <input v-model="form.academicYear" type="text" required />
      </div>
      <div>
        <label>Course Item:</label>
        <select v-model="form.courseItem" required>
          <option disabled value="">Please select one</option>
          <option value="100m 男">100m 男</option>
          <option value="200m 男">200m 男</option>
          <option value="400m 男">400m 男</option>
          <option value="other">Other</option>
        </select>
        <input v-if="form.courseItem === 'other'" v-model="form.otherCourseItem" type="text" placeholder="Specify other course item" />
      </div>
      <div>
        <label>Item ID:</label>
        <input v-model="form.itemId" type="number" required />
      </div>
      <div>
        <label>Location:</label>
        <input v-model="form.location" type="text" required />
      </div>
      <button type="submit">{{ isEditing ? 'Update' : 'Create' }}</button>
      <button type="button" @click="resetForm">Reset</button>
    </form>

    <h1>賽程表</h1>
    <table>
      <thead>
        <tr>
          <th>賽事項目</th>
          <th>圖片</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in courseImages" :key="index">
          <td>{{ item.courseItem }}</td>
          <td>
            <img v-if="item.base64Image" :src="'data:image/jpeg;base64,' + item.base64Image" alt="Image" />
            <span v-else>無圖片</span>
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
      selectedFile: null,
      imageUrl: null,
      tournaments: [],
      courseImages: [], // 用於存儲從數據庫獲取的項目和圖片
      form: {
        id: null,
        academicYear: '',
        courseItem: '',
        otherCourseItem: '',
        itemId: null,
        location: ''
      },
      isEditing: false,
      selectedTournamentId: null
    };
  },
  created() {
    this.fetchTournaments();
    this.fetchCourseImages();
  },
  methods: {
    fetchTournaments() {
      axios.get('http://localhost:8080/tournaments')
        .then(response => {
          this.tournaments = response.data;
        })
        .catch(error => {
          console.error("There was an error fetching the tournaments!", error);
        });
    },
    submitForm() {
      const formToSubmit = { ...this.form };
      if (formToSubmit.courseItem === 'other') {
        formToSubmit.courseItem = formToSubmit.otherCourseItem;
      }
      if (this.isEditing) {
        axios.put(`http://localhost:8080/tournaments`, formToSubmit)
          .then(response => {
            this.fetchTournaments();
            this.resetForm();
          })
          .catch(error => {
            console.error("There was an error updating the tournament!", error);
          });
      } else {
        axios.post('http://localhost:8080/tournaments', formToSubmit)
          .then(response => {
            this.fetchTournaments();
            this.resetForm();
          })
          .catch(error => {
            console.error("There was an error submitting the form!", error);
          });
      }
    },
    resetForm() {
      this.form = {
        id: null,
        academicYear: '',
        courseItem: '',
        otherCourseItem: '',
        itemId: null,
        location: ''
      };
      this.isEditing = false;
    },
    editTournament(tournament) {
      this.form = { ...tournament };
      if (!this.form.courseItem.includes('男')) {
        this.form.courseItem = 'other';
        this.form.otherCourseItem = tournament.courseItem;
      }
      this.isEditing = true;
    },
    deleteTournament(id) {
      axios.delete(`http://localhost:8080/tournaments`, { params: { id: id } })
        .then(response => {
          this.fetchTournaments();
        })
        .catch(error => {
          console.error("There was an error deleting the tournament!", error);
        });
    },
    triggerFileInput(id) {
      this.selectedTournamentId = id;
      this.$refs.fileInput.click();
    },
    onFileChange(event) {
      const file = event.target.files[0];
      if (file && file.type.startsWith('image/')) {
        this.selectedFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imageUrl = e.target.result;
        };
        reader.readAsDataURL(file);
        this.uploadImage();
      } else {
        alert('請選擇一個圖片文件');
      }
    },
    async uploadImage() {
      if (!this.selectedTournamentId) {
        alert('請先選擇一個賽事進行圖片上傳');
        return;
      }

      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('tournamentId', this.selectedTournamentId);
      try {
        const response = await axios.post('http://localhost:8080/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        alert('圖片上傳成功');
        this.selectedFile = null;
        this.imageUrl = null;
        this.selectedTournamentId = null;
        this.fetchCourseImages(); // 重新獲取圖片數據
      } catch (error) {
        alert('圖片上傳失敗');
        console.error(error);
      }
    },
    async fetchCourseImages() {
      try {
        const response = await axios.get('http://localhost:8080/upload/course-images'); // 確認這裡的路徑與後端匹配
        this.courseImages = response.data;
      } catch (error) {
        console.error('Error fetching course images:', error);
      }
    }
  }
};
</script>

<style>

img {
  max-width: 100%;
  height: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}
th, td {
  border: 1px solid #ddd;
  padding: 8px;
}
th {
  background-color: #f2f2f2;
}
form {
  margin-top: 20px;
}
form div {
  margin-bottom: 10px;
}
form label {
  display: inline-block;
  width: 100px;
}
form input, form select {
  padding: 5px;
  width: 200px;
}
form button {
  padding: 5px 10px;
}
</style>
