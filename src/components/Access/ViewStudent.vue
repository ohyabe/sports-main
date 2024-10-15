<template>
  <div class="container">
    <h1 style="font-weight: bolder;">學生帳密管理中心</h1>
    <form @submit.prevent="submitForm">
      <div>
        <label for="academicYear">學年度</label>
        <input class="cc" type="number" v-model="form.academicYear" id="academicYear" required>
      </div>
      <div>
        <label for="class">班級</label>
        <input type="text" v-model="form.cla" id="class" required>
      </div>
      <div>
        <label for="studentName">學生姓名</label>
        <input type="text" v-model="form.studentName" id="studentName" required>
      </div>
      <div>
        <label for="studentPassword">學生密碼</label>
        <input type="password" v-model="form.studentPassword" id="studentPassword" required>
      </div>
      <div>
        <label for="studentEmail">學生信箱</label>
        <input type="email" v-model="form.studentEmail" id="studentEmail" required>
      </div>
      <div>
        <label for="studentId">學生證號</label>
        <input type="text" v-model="form.studentId" id="studentId" required>
      </div>
      
      <button type="submit">{{ isEditing ? '更新' : '送出' }}</button>
    </form>

    <!-- 搜尋功能 -->
    <div class="search">
      <label for="searchStudentName">學生姓名搜尋</label>
      <input type="text" v-model="searchQuery" id="searchStudentName">
    </div>

    <table>
      <thead>
        <tr>
          <th>序號</th>
          <th>學年度</th>
          <th>班級</th>
          <th>學生姓名</th>
          <th>學生密碼</th>
          <th>學生信箱</th>
          <th>學生證號</th>
          <th>性別</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="student in paginatedStudents" :key="student.id">
          <td>{{ student.id }}</td>
          <td>{{ student.academicYear }}</td>
          <td>{{ student.cla }}</td>
          <td>{{ student.studentName }}</td>
          <td>{{ student.studentPassword }}</td>
          <td>{{ student.studentEmail }}</td>
          <td>{{ student.studentId }}</td>
          <td>{{ student.gender }}</td>
          <td>
            <div class="btn-area">
              <button @click="editStudent(student)">編輯</button>
              <button @click="deleteStudent(student.id)">刪除</button>
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
      students: [],
      form: {
        id: null,
        academicYear: '',
        cla: '',
        studentName: '',
        studentPassword: '',
        studentEmail: '',
        studentId: '',
        gender: ''
      },
      isEditing: false,
      searchQuery: '',
      currentPage: 1,  // 當前頁碼
      perPage: 10  // 每頁顯示的學生數量
    };
  },
  computed: {
    filteredStudents() {
      return this.students.filter(student =>
        student.studentName.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    paginatedStudents() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.filteredStudents.slice(start, end);
    },
    pageCount() {
      return Math.ceil(this.filteredStudents.length / this.perPage);
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
    this.fetchStudents();
  },
  methods: {
    fetchStudents() {
      axios.get('http://localhost:8080/students')
        .then(response => {
          this.students = response.data;
        })
        .catch(error => {
          console.error("There was an error fetching the students!", error);
        });
    },
    submitForm() {
      const formToSubmit = { ...this.form };
      console.log("Form to submit:", formToSubmit);

      if (this.isEditing) {
        console.log("Updating student with ID:", formToSubmit.id);
        if (formToSubmit.id) {
          axios.put(`http://localhost:8080/students/${formToSubmit.id}`, formToSubmit)
            .then(response => {
              console.log("Update successful:", response.data);
              this.fetchStudents();
              this.resetForm();
            })
            .catch(error => {
              console.error("There was an error updating the student!", error);
            });
        } else {
          console.error("ID is undefined. Cannot update student.");
        }
      } else  {
        axios.post('http://localhost:8080/students', formToSubmit)
          .then(response => {
            this.fetchStudents();
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
        studentName: '',
        studentPassword: '',
        studentEmail: '',
        studentId: ''
      };
      this.isEditing = false;
    },
    editStudent(student) {
      this.form = { ...student, id: student.id };  // Explicitly set the id
      this.isEditing = true;
      console.log("Editing student:", this.form);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    deleteStudent(id) {
      axios.delete('http://localhost:8080/students', { params: { id: id } })
        .then(response => {
          this.fetchStudents();
        })
        .catch(error => {
          console.error("There was an error deleting the student!", error);
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
