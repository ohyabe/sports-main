<template>
  <div class="container">
    <h1 style="font-weight: bolder;">老師帳密管理中心</h1>
    <form @submit.prevent="submitForm">
      <div>
        <label for="academicYear">學年度</label>
        <input class="cc" type="number" v-model="form.academicYear" id="academicYear" required>
      </div>
      <div>
        <label for="cla">班級</label>
        <input type="text" v-model="form.cla" id="cla" required>
      </div>
      <div>
        <label for="teacherName">老師姓名</label>
        <input type="text" v-model="form.teacherName" id="teacherName" required>
      </div>
      <div>
        <label for="teacherPassword">老師密碼</label>
        <input type="password" v-model="form.teacherPassword" id="teacherPassword" required>
      </div>
      <div>
        <label for="teacherEmail">老師信箱</label>
        <input type="email" v-model="form.teacherEmail" id="teacherEmail" required>
      </div>
      <div>
        <label for="teacherId">老師證號</label>
        <input type="text" v-model="form.teacherId" id="teacherId" required>
      </div>
      <button type="submit">{{ isEditing ? '更新' : '送出' }}</button>
    </form>

    <!-- 搜尋功能 -->
    <div class="search">
      <label for="searchTeacherName">搜尋老師姓名</label>
      <input type="text" v-model="searchQuery" id="searchTeacherName">
    </div>

    <table>
      <thead>
        <tr>
          <th>序號</th>
          <th>學年度</th>
          <th>班級代碼</th>
          <th>老師姓名</th>
          <th>老師密碼</th>
          <th>老師信箱</th>
          <th>老師證號</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="teacher in paginatedTeachers" :key="teacher.id">
          <td>{{ teacher.id }}</td>
          <td>{{ teacher.academicYear }}</td>
          <td>{{ teacher.cla }}</td>
          <td>{{ teacher.teacherName }}</td>
          <td>{{ teacher.teacherPassword }}</td>
          <td>{{ teacher.teacherEmail }}</td>
          <td>{{ teacher.teacherId }}</td>
          <td>
            <div class="btn-area">
            <button @click="editTeacher(teacher)">編輯</button>
            <button @click="deleteTeacher(teacher.id)">刪除</button>
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
      teachers: [],
      form: {
        id: null,
        academicYear: '',
        cla: '',
        teacherName: '',
        teacherPassword: '',
        teacherEmail: '',
        teacherId: ''
      },
      isEditing: false,
      searchQuery: '',
      currentPage: 1,  // 當前頁碼
      perPage: 10  // 每頁顯示的教師數量
    };
  },
  computed: {
    filteredTeachers() {
      return this.teachers.filter(teacher =>
        teacher.teacherName.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    paginatedTeachers() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.filteredTeachers.slice(start, end);
    },
    pageCount() {
      return Math.ceil(this.filteredTeachers.length / this.perPage);
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
    this.fetchTeachers();
  },
  methods: {
    fetchTeachers() {
      axios.get('http://localhost:8080/teachers')
        .then(response => {
          this.teachers = response.data;
        })
        .catch(error => {
          console.error("There was an error fetching the teachers!", error);
        });
    },
    submitForm() {
      const formToSubmit = { ...this.form };
      if (this.isEditing) {
        if (formToSubmit.id) {
          axios.put(`http://localhost:8080/teachers/${formToSubmit.id}`, formToSubmit)
            .then(response => {
              this.fetchTeachers();
              this.resetForm();
            })
            .catch(error => {
              console.error("There was an error updating the teacher!", error);
            });
        } else {
          console.error("ID is undefined. Cannot update teacher.");
        }
      } else {
        axios.post('http://localhost:8080/teachers', formToSubmit)
          .then(response => {
            this.fetchTeachers();
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
        cla: '',
        teacherName: '',
        teacherPassword: '',
        teacherEmail: '',
        teacherId: ''
      };
      this.isEditing = false;
    },
    editTeacher(teacher) {
      this.form = { ...teacher, id: teacher.id };  // Explicitly set the id
      this.isEditing = true;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    deleteTeacher(id) {
      axios.delete(`http://localhost:8080/teachers/${id}`)
        .then(response => {
          this.fetchTeachers();
        })
        .catch(error => {
          console.error("There was an error deleting the teacher!", error);
        });
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
.cc{
  width:100px;
}
</style>
