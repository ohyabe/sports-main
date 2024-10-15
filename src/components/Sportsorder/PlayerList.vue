<template>
  <div>
    <h1>參賽選手列表</h1>
    <table class="participant-table">
      <thead>
        <tr>
          <th>比賽項目</th>
          <th>學生名稱</th>
          <th>學生班級</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="participant in paginatedParticipants" :key="participant.id">
          <td>{{ participant.courseItem }}</td>
          <td>{{ participant.studentName }}</td>
          <td>{{ participant.studentClass }}</td>
        </tr>
      </tbody>
    </table>
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">上一頁</button>
      <button
        v-for="page in visiblePages"
        :key="page"
        @click="goToPage(page)"
        :class="{ active: currentPage === page }"
      >
        {{ page }}
      </button>
      <span v-if="shouldShowEllipsis">...</span>
      <button v-if="shouldShowLastPage" @click="goToPage(totalPages)">{{ totalPages }}</button>
      <button @click="nextPage" :disabled="currentPage === totalPages">下一頁</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      participants: [],
      currentPage: 1,
      itemsPerPage: 10,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.participants.length / this.itemsPerPage);
    },
    paginatedParticipants() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.participants.slice(start, end);
    },
    visiblePages() {
      if (this.totalPages <= 5) {
        return [...Array(this.totalPages).keys()].map(i => i + 1);
      }
      if (this.currentPage <= 3) {
        return [1, 2, 3, 4, 5];
      }
      if (this.currentPage >= this.totalPages - 2) {
        return [
          this.totalPages - 4,
          this.totalPages - 3,
          this.totalPages - 2,
          this.totalPages - 1,
          this.totalPages,
        ];
      }
      return [
        this.currentPage - 2,
        this.currentPage - 1,
        this.currentPage,
        this.currentPage + 1,
        this.currentPage + 2,
      ];
    },
    shouldShowEllipsis() {
      return this.totalPages > 5 && this.currentPage < this.totalPages - 2;
    },
    shouldShowLastPage() {
      return this.totalPages > 5 && !this.visiblePages.includes(this.totalPages);
    },
  },
  created() {
    this.fetchParticipants();
  },
  methods: {
    fetchParticipants() {
      axios.get('http://localhost:8080/participants')
        .then(response => {
          this.participants = response.data;
        })
        .catch(error => {
          console.error("獲取參賽選手數據時出錯!", error);
        });
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    goToPage(page) {
      this.currentPage = page;
    },
  },
};
</script>

<style scoped>
/* 添加一些樣式來美化表格 */
table {
  width: 60%; /* 設置表格寬度為60% */
  border-collapse: collapse;
  margin: 20px auto; /* 將表格水平居中 */
  margin-top: 50px;
  
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
}

th {
  background-color: #f2f2f2;
  text-align: left;
}

td {
  text-align: center;
}

tbody tr:hover {
  background-color: #f1f1f1;
}

h1 {
  text-align: center;
  margin-top: 50px;
}

.pagination {
  text-align: center;
  margin-top: 20px;
  margin-bottom:200px;
}

button {
  margin: 0 5px;
  background-color: #ddd; /* 設置按鈕為灰色 */
  border: none;
  padding: 8px 16px;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc; /* 禁用按鈕的顏色 */
  cursor: not-allowed;
}

button.active {
  background-color: #888; /* 當前頁面按鈕的顏色 */
  color: #fff;
}
</style>
