<template>
  <div class="container">
    <h1>賽程匯入器</h1>
    <!-- <form @submit.prevent="submitForm">
      <div>
        <label for="academicYear">學年度</label>
        <select v-model="form.academicYear" id="academicYear" required>
          <option v-for="year in academicYears" :key="year" :value="year">{{ year }}</option>
        </select>
      </div>
      <div>
        <label for="courseItem">比賽項目</label>
        <select v-model="form.courseItem" id="courseItem" required>
          <option v-for="item in courseItems" :key="item" :value="item">{{ item }}</option>
          <option value="other">其他</option>
        </select>
        <div v-if="form.courseItem === 'other'">
          <input type="text" v-model="form.otherCourseItem" placeholder="Please specify" required />
        </div>
      </div>
      <div>
        <label for="itemId">項目序號</label>
        <input type="number" v-model="form.itemId" id="itemId" required>
      </div>
      <div>
        <label for="location">比賽場地</label>
        <input type="text" v-model="form.location" id="location" required>
      </div>
      <button type="submit">{{ isEditing ? '更新' : '送出' }}</button>
    </form> -->

    <!-- 搜尋功能 -->
    <!-- <div class="search">
      <label for="searchCourseItem">搜尋比賽項目</label>
      <input type="text" v-model="searchQuery" id="searchCourseItem">
    </div> -->

    <table>
      <thead>
        <tr>
          <th>學年度</th>
          <th>比賽項目</th>
          <th>比賽序號</th>
          <th>比賽場地</th>
          <th>照片</th>
          <!-- <th>操作</th> -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="tournament in paginatedTournaments" :key="tournament.id">
          <td>{{ tournament.academicYear }}</td>
          <td>{{ tournament.courseItem }}</td>
          <td>{{ tournament.itemId }}</td>
          <td>{{ tournament.location }}</td>
          <td>
            <img :src="getImageUrl(tournament.image)" alt="No Image">
            <input type="file" @change="onFileChange($event, tournament.id)">
          </td>
          <!-- <td> --> 
            <!-- <button @click="editTournament(tournament)">編輯</button>
            <button @click="deleteTournament(tournament.id)">刪除</button> -->
          <!-- </td>  -->
        </tr>
      </tbody>
    </table>

    <!-- 分頁功能 -->
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">上一頁</button>
      <button 
        v-for="page in visiblePages" 
        :key="page" 
        @click="handlePageClick(page)"
        :class="{ active: page === currentPage }"
      >
        {{ page }}
      </button>
      <button @click="nextPage" :disabled="currentPage === pageCount">下一頁</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      tournaments: [],
      form: {
        id: null,
        academicYear: '',
        courseItem: '',
        otherCourseItem: '',
        itemId: null,
        location: '',
        image: null
      },
      isEditing: false,
      searchQuery: '',
      currentPage: 1,  // 當前頁碼
      perPage: 10,  // 每頁顯示的比賽數量
      academicYears: Array.from({ length: 21 }, (v, k) => 2010 + k),
      courseItems: [
        "100m 男", "100m 女", "200m 男", "200m 女", "400m 男", "400m 女",
        "800m 男", "800m 女", "1600m 男", "1600m 女", "跳遠 男", "跳遠 女",
        "跳高 男", "跳高 女", "鉛球 男", "鉛球 女", "400大隊接力",
        "班級大隊接力", "趣味競賽"
      ]
    };
  },
  computed: {
    filteredTournaments() {
      return this.tournaments.filter(tournament =>
        tournament.courseItem.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    paginatedTournaments() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.filteredTournaments.slice(start, end);
    },
    pageCount() {
      return Math.ceil(this.filteredTournaments.length / this.perPage);
    },
    visiblePages() {
      const pages = [];
      const maxVisiblePages = 10;

      if (this.pageCount <= maxVisiblePages) {
        for (let i = 1; i <= this.pageCount; i++) {
          pages.push(i);
        }
      } else {
        let startPage = this.currentPage - Math.floor(maxVisiblePages / 2);
        let endPage = this.currentPage + Math.floor(maxVisiblePages / 2);

        if (startPage < 1) {
          startPage = 1;
          endPage = maxVisiblePages;
        }

        if (endPage > this.pageCount) {
          startPage = this.pageCount - maxVisiblePages + 1;
          endPage = this.pageCount;
        }

        for (let i = startPage; i <= endPage; i++) {
          pages.push(i);
        }

        if (startPage > 1) {
          pages.unshift('...');
          pages.unshift(1);
        }

        if (endPage < this.pageCount) {
          pages.push('...');
          pages.push(this.pageCount);
        }
      }

      return pages;
    }
  },
  created() {
    this.fetchTournaments(); // 確保初始化時獲取所有比賽項目
  },
  methods: {
    fetchTournaments() {
      axios.get('http://localhost:8080/tournaments')
        .then(response => {
          this.tournaments = response.data;
          this.tournaments.forEach(t => {
            this.fetchImage(t.id); // 為每個比賽項目獲取圖片
          });
        })
        .catch(error => {
          console.error("There was an error fetching the tournaments!", error);
        });
    },
    fetchImage(id) {
      axios.get(`http://localhost:8080/tournaments/getImage/${id}`, { responseType: 'arraybuffer' })
        .then(response => {
          const imageBlob = new Blob([response.data], { type: 'image/jpeg' });
          const imageUrl = URL.createObjectURL(imageBlob);
          const tournament = this.tournaments.find(t => t.id === id);
          if (tournament) {
            tournament.image = imageUrl;
          }
        })
        .catch(error => {
          console.error('Error fetching image:', error);
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
            window.scrollTo({ top: 0, behavior: 'smooth' });
          })
          .catch(error => {
            console.error("There was an error updating the tournament!", error);
          });
      } else {
        axios.post('http://localhost:8080/tournaments', formToSubmit)
          .then(response => {
            this.tournaments.push(response.data);
            this.resetForm();
            window.scrollTo({ top: 0, behavior: 'smooth' });
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
        location: '',
        image: null
      };
      this.isEditing = false;
    },
    editTournament(tournament) {
      this.form = { ...tournament };
      this.isEditing = true;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    deleteTournament(id) {
      axios.delete(`http://localhost:8080/tournaments`, { params: { id: id } })
        .then(response => {
          this.tournaments = this.tournaments.filter(t => t.id !== id);
        })
        .catch(error => {
          console.error("There was an error deleting the tournament!", error);
        });
    },
    onFileChange(event, id) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append('image', file);

      axios.post(`http://localhost:8080/tournaments/uploadImage/${id}`, formData)
        .then(response => {
          // 找到對應的賽事項目並更新圖片
          const updatedTournament = this.tournaments.find(t => t.id === id);
          if (updatedTournament) {
            updatedTournament.image = URL.createObjectURL(file);
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
    },
    getImageUrl(image) {
      return image ? image : 'public/images/placeholder.png'; // 提供一個默認的佔位符圖片
    },
    handlePageClick(pageNum) {
      if (pageNum !== '...') {
        this.currentPage = pageNum;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.pageCount) {
        this.currentPage++;
      }
    }
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.container {
  padding: 5%;
  width: 70%;
  height: 100%;
  margin: 0 auto;
  text-align: center;
}
form {
  padding: 5%;
  margin-bottom: 20px;
}
form div {
  display: flex;
  margin-bottom: 3%;
}
label {
  display: block;
  width: 20%;
  margin-bottom: 5px;
}
input, select {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 14px;
  outline: none;
}
button {
  border-radius: 5px;
  padding: 10px 15px;
  background-color: hsl(197, 54%, 65%);
  color: white;
  border: none;
  cursor: pointer;
}
button:hover {
  background-color: #0056b3;
}
.search {
  display: flex;
  margin-bottom: 5%;
}
.search label {
  width: 20%;
}
.search input {
  width: 75%;
  padding: 8px;
  box-sizing: border-box;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 14px;
  outline: none;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  border: 1px solid #ddd;
  padding: 8px;
}
th {
  background-color: #f2f2f2;
  text-align: left;
}
td button {
  margin: 0 3%;
}
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}
.pagination button {
  margin: 0 5px;
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  background-color: #a6a2a2;
}
.pagination button:hover {
  background-color: hsl(197, 54%, 65%);
}
.pagination button.active {
  background-color: rgb(46, 66, 114);
  color: white;
  border-color: hsl(240, 32%, 13%);
}
.pagination button:disabled {
  background-color: #ccc;
  color: #666;
  cursor: not-allowed;
}
h1{
  margin-top:-50px;
  margin-bottom: 50px;
}
</style>
