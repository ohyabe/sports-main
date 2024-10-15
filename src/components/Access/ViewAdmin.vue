<template>
  <div class="container">
    <h1 style="font-weight: bolder;">管理員帳密中心</h1>
    <form @submit.prevent="submitForm">
      <div>
        <label for="adminName">管理員姓名</label>
        <input type="text" v-model="form.adminName" id="adminName" required>
      </div>
      <div>
        <label for="adminPassword">管理員密碼</label>
        <input type="password" v-model="form.adminPassword" id="adminPassword" required>
      </div>
      <div>
        <label for="adminEmail">管理員信箱</label>
        <input type="email" v-model="form.adminEmail" id="adminEmail" required>
      </div>
      <div>
        <label for="adminId">管理員證號</label>
        <input type="text" v-model="form.adminId" id="adminId" required>
      </div>
      <button type="submit">{{ isEditing ? '更新' : '送出' }}</button>
    </form>

    <!-- 搜尋功能 -->
    <div class="search">
      <label for="searchAdminName">搜尋管理員姓名</label>
      <input type="text" v-model="searchQuery" id="searchAdminName">
    </div>

    <table>
      <thead>
        <tr>
          <th>序號</th>
          <th>管理員姓名</th>
          <th>管理員密碼</th>
          <th>管理員信箱</th>
          <th>管理員證號</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="admin in paginatedAdmins" :key="admin.id">
          <td>{{ admin.id }}</td>
          <td>{{ admin.adminName }}</td>
          <td>{{ admin.adminPassword }}</td>
          <td>{{ admin.adminEmail }}</td>
          <td>{{ admin.adminId }}</td>
          <td>
            <div class="btn-area">
              <button @click="editAdmin(admin)">編輯</button>
              <button @click="deleteAdmin(admin.id)">刪除</button>
            </div>
          </td>
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
      admins: [],  // 管理員列表
      form: {
        id: null,
        adminName: '',
        adminPassword: '',
        adminEmail: '',
        adminId: ''
      },
      isEditing: false,
      searchQuery: '',
      currentPage: 1,  // 當前頁碼
      perPage: 10,  // 每頁顯示的管理員數量
    };
  },
  computed: {
    filteredAdmins() {
      return this.admins.filter(admin =>
        admin.adminName.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    paginatedAdmins() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.filteredAdmins.slice(start, end);
    },
    pageCount() {
      return Math.ceil(this.filteredAdmins.length / this.perPage);
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
    this.fetchAdmins();
  },
  methods: {
    fetchAdmins() {
      axios.get('http://localhost:8080/admins')
        .then(response => {
          this.admins = response.data;
        })
        .catch(error => {
          console.error("There was an error fetching the admins!", error);
        });
    },
    submitForm() {
      const formToSubmit = { ...this.form };
      if (this.isEditing) {
        if (formToSubmit.id) {
          axios.put(`http://localhost:8080/admins/${formToSubmit.id}`, formToSubmit)
            .then(response => {
              this.fetchAdmins();
              this.resetForm();
            })
            .catch(error => {
              console.error("There was an error updating the admin!", error);
            });
        } else {
          console.error("ID is undefined. Cannot update admin.");
        }
      } else {
        axios.post('http://localhost:8080/admins', formToSubmit)
          .then(response => {
            this.fetchAdmins();
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
        adminName: '',
        adminPassword: '',
        adminEmail: '',
        adminId: ''
      };
      this.isEditing = false;
    },
    editAdmin(admin) {
      this.form = { ...admin, id: admin.id };  // 明確設定 id
      this.isEditing = true;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    deleteAdmin(id) {
      axios.delete(`http://localhost:8080/admins/${id}`)
        .then(response => {
          this.fetchAdmins();
        })
        .catch(error => {
          console.error("There was an error deleting the admin!", error);
        });
    },
    // 處理分頁點擊事件
    handlePageClick(pageNum) {
      if (pageNum !== '...') {
        this.currentPage = pageNum;  // 更新當前頁碼
      }
    },
    // 上一頁
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;  // 減少當前頁碼
      }
    },
    // 下一頁
    nextPage() {
      if (this.currentPage < this.pageCount) {
        this.currentPage++;  // 增加當前頁碼
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
  display: flex;
  justify-content: center;
  align-content: center;
  margin: 0% 3%;
}
.btn-area {
  width: 150px;
  display: flex;
  justify-content: center;
  align-content: center;
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
