<template>
    <div class="temperature-widget">
      <div class="title">溫度分布圖</div>
      <div class="date-time">更新時間: {{ formattedDateTime }}</div>
      <div class="temperature-map">
        <a :href="redirectUrl" target="_blank">
          <img :src="imageUrl" alt="Temperature Distribution Map" v-if="imageUrl" />
        </a>
      </div>
      <div v-if="error" class="error">{{ error }}</div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        dateTime: '',
        imageUrl: '',
        error: '',
        redirectUrl: 'https://www.cwa.gov.tw/V8/C/W/OBS_Temp.html'
      };
    },
    computed: {
      formattedDateTime() {
        if (!this.dateTime) return '';
        const date = new Date(this.dateTime);
        return date.toLocaleString('zh-TW', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
      }
    },
    mounted() {
      this.fetchTemperatureData();
    },
    methods: {
      fetchTemperatureData() {
        fetch('https://cwaopendata.s3.ap-northeast-1.amazonaws.com/Observation/O-A0038-001.json') // 替換為實際的JSON URL
          .then(response => response.json())
          .then(data => {
            console.log("Fetched temperature data:", data);
            if (data.cwaopendata && data.cwaopendata.dataset && data.cwaopendata.dataset.Resource) {
              this.dateTime = data.cwaopendata.dataset.ObsTime.DateTime;
              this.imageUrl = data.cwaopendata.dataset.Resource.ProductURL;
            } else {
              this.error = '無法獲取到有效的數據';
            }
          })
          .catch(error => {
            console.error("Error fetching temperature data:", error);
            this.error = '獲取數據時發生錯誤';
          });
      }
    }
  };
  </script>
  
  <style scoped>
  .temperature-widget {
    background-color: #ffffff;
    border: 1px solid #dcdcdc;
    border-radius: 8px 8px 0 0;
    /* padding: 16px; */
    width: 300px;
    font-family: Arial, sans-serif;
    text-align: center;
    /* box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); */
  }

 
  
  .title {
    background-color: #4f8dc2;
    color: white;
    padding: 8px;
    border-radius: 8px 8px 0 0;
    font-weight: bold;
  }
  
  .date-time {
    margin-top: 12px;
    font-size: 12px;
    color: #999;
  }
  
  .temperature-map {
    margin-top: 16px;
  }
  
  .temperature-map img {
    max-width: 100%;
    /* border-radius: 8px; */
    cursor: pointer;
  }
  
  .error {
    margin-top: 16px;
    color: red;
  }
  </style>
  