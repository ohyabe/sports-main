<template>
  <div class="container">
    <h1>運動會比賽項目表單</h1>
    
    <!-- 搜尋功能 -->
    <div class="search">
      <label for="searchCourseItem">搜尋比賽項目</label>
      <input type="text" v-model="searchQuery" id="searchCourseItem">
    </div>

    <button @click="exportToExcel" class="export">匯出至excel</button>

    <table>
      <thead>
        <tr>
          <th>Academic Year</th>
          <th>Course Item</th>
          <th>Item ID</th>
          <th>Location</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="tournament in paginatedTournaments" :key="tournament.id">
          <td>{{ tournament.academicYear }}</td>
          <td>{{ tournament.courseItem }}</td>
          <td>{{ tournament.itemId }}</td>
          <td>{{ tournament.location }}</td>
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
import * as XLSX from 'xlsx';

export default {
  data() {
    return {
      tournaments: [],
      searchQuery: '',
      academicYears: Array.from({ length: 21 }, (v, k) => 2010 + k),
      courseItems: [
        "100m 男", "100m 女", "200m 男", "200m 女", "400m 男", "400m 女",
        "800m 男", "800m 女", "1600m 男", "1600m 女", "跳遠 男", "跳遠 女",
        "跳高 男", "跳高 女", "鉛球 男", "鉛球 女", "400大隊接力",
        "班級大隊接力", "趣味競賽"
      ],
      currentPage: 1, // 當前頁碼
      perPage: 10 // 每頁顯示的賽事數量
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
    this.fetchTournaments();
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
    exportToExcel() {
      const ws = XLSX.utils.json_to_sheet(this.tournaments);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Tournaments");
      XLSX.writeFile(wb, "tournaments.xlsx");
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
  padding:5%;
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
  margin-top: 6%;

  margin-bottom: 5px;
}
input, select {
  width: 100%;
  padding: 8px;
  margin-top: 5%;
  box-sizing: border-box;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 14px;
  outline: none;
}
.export {
  border-radius: 5px;
  padding: 10px 15px;
  margin-bottom: 5%;
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
</style>
