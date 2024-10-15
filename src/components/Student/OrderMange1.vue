<template>
  <div>
    <h1>秩序冊</h1>
    <!-- <form @submit.prevent="submitForm" class="form-container"> -->
      <!-- <div class="form-group">
        <label for="courseItem">項目:</label>
        <select v-model="form.courseItem" @change="setItemId" id="courseItem" required>
          <option v-for="item in courseItems" :key="item" :value="item">{{ item }}</option>
          <option value="開幕典禮">開幕典禮</option>
          <option value="閉幕典禮">閉幕典禮</option>
          <option value="午休">午休</option>
          <option value="other">其他</option>
        </select>
        <div v-if="form.courseItem === 'other'">
          <input type="text" v-model="form.otherCourseItem" placeholder="請指定項目" required />
        </div>
      </div>
      <div class="form-group">
        <label for="eventType">類型:</label>
        <select v-model="form.eventType" id="eventType" required>
          <option value="預賽">預賽</option>
          <option value="決賽">決賽</option>
          <option value="其他">其他</option>
        </select>
      </div>
        <div class="form-group">
        <label for="description">日期:</label>
        <input type="date" v-model="form.description" id="description" required />
      </div>
      <div class="form-group">
        <label for="itemId">項目 ID:</label>
        <input type="number" v-model="form.itemId" id="itemId" required readonly>
      </div>
      <div class="form-group">
        <label for="startTime">開始時間:</label>
        <input type="time" v-model="form.startTime" id="startTime" required>
      </div>
      <div class="form-group">
        <label for="endTime">結束時間:</label>
        <input type="time" v-model="form.endTime" id="endTime" required>
      </div>
      <div class="form-group">
        <label for="location">地點:</label>
        <select v-model="form.location" id="location" required>
          <option value="操場">操場</option>
          <option value="田賽場">田賽場</option>
          <option value="其他">其他</option>
        </select>
        <div v-if="form.location === '其他'">
          <input type="text" v-model="form.otherLocation" placeholder="請指定地點" required />
        </div>
      </div>
      <div class="form-group full-width">
        <label for="classes">年級:</label>
        <select v-model="form.classes" id="classes" required>
          <option v-for="i in 6" :key="i" :value="i">{{ i }}</option>
          <option value="全校">全校</option>
        </select>
      </div>
      <div class="form-group">
        <label for="eventNumber">活動編號:</label>
        <input type="text" v-model="form.eventNumber" id="eventNumber" required>
      </div>
      
      <div class="form-group full-width">
        <button type="submit">{{ isEditing ? '更新' : '提交' }}</button>
      </div>
    </form> -->

    <!-- 搜尋功能 -->
    <div>
      <label for="searchCourseItem">搜尋項目:</label>
      <input type="text" v-model="searchQuery" id="searchCourseItem">
    </div>

    <table>
      <thead>
        <tr>
          <th>項目</th>
          <th>項目 ID</th>
          <th>日期</th>
          <th>開始時間</th>
          <th>結束時間</th>
          <th>地點</th>
          <th>類型</th>
          <th>活動編號</th>
          <th>年級</th>
          <!-- <th>說明</th> -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="event in filteredEvents" :key="event.id">
          <td>{{ event.courseItem }}</td>
          <td>{{ event.itemId }}</td>
          <td>{{ event.description }}</td>
          <td>{{ event.startTime }}</td>
          <td>{{ event.endTime }}</td>
          <td>{{ event.location }}</td>
          <td>{{ event.eventType }}</td>
          <td>{{ event.eventNumber }}</td>
          <td>{{ event.classes }}</td>
          
          <!-- <td>
            <button @click="editEvent(event)">編輯</button>
            <button @click="deleteEvent(event.id)">刪除</button>
          </td> -->
        </tr>
      </tbody>
    </table>

    <!-- <h2>Tournament Management</h2> -->
    <!-- 搜尋功能 -->
    <!-- <div>
      <label for="searchCourseItem">Search Course Item:</label>
      <input type="text" v-model="searchQuery" id="searchCourseItem">
    </div>

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
        <tr v-for="tournament in filteredTournaments" :key="tournament.id">
          <td>{{ tournament.academicYear }}</td>
          <td>{{ tournament.courseItem }}</td>
          <td>{{ tournament.itemId }}</td>
          <td>{{ tournament.location }}</td>
        </tr>
      </tbody>
    </table> -->
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      events: [],
      tournaments: [],
      form: {
        id: null,
        academicYear: '',
        courseItem: '',
        otherCourseItem: '',
        itemId: null,
        startTime: '',
        endTime: '',
        location: '',
        otherLocation: '',
        classes: '',
        eventNumber: '',
        eventType: '',
        description: ''
      },
      isEditing: false,
      searchQuery: '',
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
    filteredEvents() {
      return this.events.filter(event =>
        event.courseItem.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    filteredEvents() {
    return this.events.filter(event => 
      event.courseItem && event.courseItem.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  },
  filteredTournaments() {
    return this.tournaments.filter(tournament =>
      tournament.courseItem && tournament.courseItem.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
  },
  created() {
    this.fetchEvents();
    this.fetchTournaments();
  },
  methods: {
    fetchEvents() {
      axios.get('http://localhost:8080/event_schedule')
        .then(response => {
          this.events = response.data;
        })
        .catch(error => {
          console.error("獲取活動資料時出錯!", error);
        });
    },
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
      const formToSubmit = {
        ...this.form,
        classes: `${this.form.classes}`.trim(),
        description: this.formatDate(this.form.description), // 日期轉換為字符串
        location: this.form.location === '其他' ? this.form.otherLocation : this.form.location,
        courseItem: this.form.courseItem === 'other' ? this.form.otherCourseItem : this.form.courseItem
      };
      
      if (this.isEditing) {
        axios.put(`http://localhost:8080/event_schedule`, formToSubmit)
          .then(response => {
            this.fetchEvents();
            this.fetchTournaments();
            this.resetForm();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          })
          .catch(error => {
            console.error("更新活動資料時出錯!", error);
          });
      } else {
        axios.post('http://localhost:8080/event_schedule', formToSubmit)
          .then(response => {
            this.events.push(response.data);
            this.fetchEvents();
            this.fetchTournaments();
            this.resetForm();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          })
          .catch(error => {
            console.error("提交表單時出錯!", error);
          });
      }
    },
    formatDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  },
    resetForm() {
      this.form = {
        id: null,
        academicYear: '',
        courseItem: '',
        otherCourseItem: '',
        itemId: null,
        startTime: '',
        endTime: '',
        location: '',
        otherLocation: '',
        classes: '',
        eventNumber: '',
        eventType: '',
        description: ''
      };
      this.isEditing = false;
    },
    setItemId() {
      const courseItemMapping = {
        "100m 男": 1,
        "100m 女": 2,
        "200m 男": 3,
        "200m 女": 4,
        "400m 男": 5,
        "400m 女": 6,
        "800m 男": 7,
        "800m 女": 8,
        "1600m 男": 9,
        "1600m 女": 10,
        "跳遠 男": 11,
        "跳遠 女": 12,
        "跳高 男": 13,
        "跳高 女": 14,
        "鉛球 男": 15,
        "鉛球 女": 16,
        "400大隊接力": 17,
        "班級大隊接力": 18,
        "趣味競賽": 19
      };
      if (courseItemMapping[this.form.courseItem]) {
        this.form.itemId = courseItemMapping[this.form.courseItem];
      } else {
        this.form.itemId = null;
      }
    },
    editEvent(event) {
      this.form = {
        ...event,
        otherLocation: event.location !== '操場' && event.location !== '田賽場' ? event.location : '',
        location: event.location !== '操場' && event.location !== '田賽場' ? '其他' : event.location,
        otherCourseItem: event.courseItem !== '100m 男' && event.courseItem !== '100m 女' && 
                        event.courseItem !== '200m 男' && event.courseItem !== '200m 女' && 
                        event.courseItem !== '400m 男' && event.courseItem !== '400m 女' && 
                        event.courseItem !== '800m 男' && event.courseItem !== '800m 女' && 
                        event.courseItem !== '1600m 男' && event.courseItem !== '1600m 女' && 
                        event.courseItem !== '跳遠 男' && event.courseItem !== '跳遠 女' && 
                        event.courseItem !== '跳高 男' && event.courseItem !== '跳高 女' && 
                        event.courseItem !== '鉛球 男' && event.courseItem !== '鉛球 女' && 
                        event.courseItem !== '400大隊接力' && event.courseItem !== '班級大隊接力' && 
                        event.courseItem !== '趣味競賽' ? event.courseItem : '',
        courseItem: event.courseItem !== '100m 男' && event.courseItem !== '100m 女' && 
                    event.courseItem !== '200m 男' && event.courseItem !== '200m 女' && 
                    event.courseItem !== '400m 男' && event.courseItem !== '400m 女' && 
                    event.courseItem !== '800m 男' && event.courseItem !== '800m 女' && 
                    event.courseItem !== '1600m 男' && event.courseItem !== '1600m 女' && 
                    event.courseItem !== '跳遠 男' && event.courseItem !== '跳遠 女' && 
                    event.courseItem !== '跳高 男' && event.courseItem !== '跳高 女' && 
                    event.courseItem !== '鉛球 男' && event.courseItem !== '鉛球 女' && 
                    event.courseItem !== '400大隊接力' && event.courseItem !== '班級大隊接力' && 
                    event.courseItem !== '趣味競賽' ? 'other' : event.courseItem
      };
      this.isEditing = true;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    deleteEvent(id) {
      axios.delete(`http://localhost:8080/event_schedule`, { params: { id: id } })
        .then(response => {
          this.events = this.events.filter(e => e.id !== parseInt(id));
        })
        .catch(error => {
          console.error("刪除活動時出錯!", error);
        });
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
    }
  }
};
</script>

<style scoped>
*{
  text-align:center;
  

}
.form-container {
  display: flex;
  flex-wrap: wrap;
}

.form-group {
  flex: 1 1 30%; /* 每個欄位佔據容器的30% */
  padding: 10px;
  box-sizing: border-box;
}

.form-group.full-width {
  flex: 1 1 100%; /* 按鈕和 classes 欄位組佔據容器的100% */
}

label {
  display: block;
  margin-bottom: 5px;
}

input, select, button, textarea {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

button {
  padding: 10px 15px;
  background-color: #007BFF;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

table {
  
  margin:0 auto;
  width: 80%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
}

th {
  background-color: #f2f2f2;
  text-align: left;
}
td{
  text-align:center;
}

.classes-group {
  display: flex;
  gap: 10px;
}

.classes-group input {
  flex: 1 1 33%;
}
</style>
