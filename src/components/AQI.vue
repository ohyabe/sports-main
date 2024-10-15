<template>
  <div class="aqi-widget">
    <div class="title">空汙指標</div>
    <div class="location-select">
      <label for="location">選擇地區：</label>
      <select id="location" v-model="selectedLocation" @change="fetchData">
        <option v-for="location in locations" :key="location" :value="location">
          {{ location }}
        </option>
      </select>
    </div>
    <div class="date-time">更新時間：{{ dateTime }}</div>
    <div class="aqi">
      <div class="aqi-status" :style="{ color: getAqiColor(aqi) }">AQI {{ aqiStatus }}</div>
      <div class="aqi-value" :style="{ color: getAqiColor(aqi) }">{{ aqi }}</div>
    </div>
    <div class="additional-info">
      <div class="pm25">PM2.5: {{ pm25 }}</div>
    </div>
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      locations: ['基隆', '台北', '新北', '桃園', '新竹', '苗栗', '台中', '彰化', '南投', '雲林', '嘉義', '台南', '高雄', '屏東', '宜蘭', '花蓮', '台東', '澎湖', '金門', '馬祖'],
      selectedLocation: '彰化',
      aqi: 0,
      pm25: 0,
      aqiStatus: '',
      dateTime: '',
      error: ''
    };
  },
  mounted() {
    this.fetchData();
    setInterval(this.fetchData, 60000); // 每60秒更新一次
  },
  methods: {
    fetchData() {
      this.error = '';
      const locationMap = {
        '基隆': 'keelung',
        '台北': 'taipei',
        '新北': 'newtaipei',
        '桃園': 'taoyuan',
        '新竹': 'hsinchu',
        '苗栗': 'miaoli',
        '台中': 'taichung',
        '彰化': 'changhua',
        '南投': 'nantou',
        '雲林': 'yunlin',
        '嘉義': 'chiayi',
        '台南': 'tainan',
        '高雄': 'kaohsiung',
        '屏東': 'pingtung',
        '宜蘭': 'yilan',
        '花蓮': 'hualien',
        '台東': 'taitung',
        '澎湖': 'penghu',
        '金門': 'kinmen',
        '馬祖': 'matsu'
      };

      let targetUrl = `https://api.waqi.info/feed/taiwan/${locationMap[this.selectedLocation]}/?token=18b9e978d5275a6bf8ec97c3b5da7523492675d4`;

      // 使用特定地區的替代 API URL
      const specialLocations = {
        '台北': 'https://api.waqi.info/feed/taipei/?token=18b9e978d5275a6bf8ec97c3b5da7523492675d4',
        '新北': 'https://api.waqi.info/feed/taiwan/north/new-taipei-city/sanxia/?token=18b9e978d5275a6bf8ec97c3b5da7523492675d4', // 用新北代替
        '台中': 'https://api.waqi.info/feed/taichung/?token=18b9e978d5275a6bf8ec97c3b5da7523492675d4',
        '雲林': 'https://api.waqi.info/feed/taiwan/yun-chia-nan/yunlin-city/huwei/?token=18b9e978d5275a6bf8ec97c3b5da7523492675d4', // 用雲林代替
        '高雄': 'https://api.waqi.info/feed/kaohsiung/?token=18b9e978d5275a6bf8ec97c3b5da7523492675d4',
        '澎湖': 'https://api.waqi.info/feed/taiwan/magong/?token=18b9e978d5275a6bf8ec97c3b5da7523492675d4', // 用澎湖代替
        '馬祖': 'https://api.waqi.info/feed/matsu/?token=18b9e978d5275a6bf8ec97c3b5da7523492675d4'
      };

      if (specialLocations[this.selectedLocation]) {
        targetUrl = specialLocations[this.selectedLocation];
      }

      fetch(targetUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          console.log(data); // 打印API返回的數據以進行調試
          if (data.status === 'ok' && data.data) {
            this.aqi = data.data.aqi;
            this.pm25 = data.data.iaqi.pm25 ? data.data.iaqi.pm25.v : 'N/A';
            this.aqiStatus = this.getAqiStatus(data.data.aqi);
            this.dateTime = new Date(data.data.time.iso).toLocaleString();
            this.error = ''; // 清除之前的錯誤
          } else {
            this.error = '無法獲取到有效的數據';
          }
        })
        .catch(error => {
          console.error("Error fetching AQI data:", error);
          this.error = '獲取數據時發生錯誤';
        });
    },
    getAqiStatus(aqi) {
      if (aqi <= 50) {
        return '良好';
      } else if (aqi <= 100) {
        return '中等';
      } else if (aqi <= 150) {
        return '對敏感族群不健康';
      } else if (aqi <= 200) {
        return '對所有族群不健康';
      } else if (aqi <= 300) {
        return '非常不健康';
      } else {
        return '危害';
      }
    },
    getAqiColor(aqi) {
      if (aqi <= 50) {
        return '#4caf50'; // 綠色
      } else if (aqi <= 100) {
        return '	#FFD306'; // 黃色
      } else if (aqi <= 150) {
        return '#ff7e00'; // 橙色
      } else if (aqi <= 200) {
        return '#ff0000'; // 紅色
      } else if (aqi <= 300) {
        return '#8f3f97'; // 紫色
      } else {
        return '#7e0023'; // 深紅色
      }
    }
  }
};
</script>

<style scoped>
.aqi-widget {
  border: 1px solid #dcdcdc;
  border-radius: 8px 8px 0 0;
  width: 300px;
  background-color: white;
  font-family: Arial, sans-serif;
  text-align: center;
  margin-bottom: 15%;
  padding-bottom: 10%;
}

.title {
  background-color: #4f8dc2;
  color: white;
  padding: 8px;
  border-radius: 8px 8px 0 0;
  font-weight: bold;
}

.location-select {
  margin-top: 8px;
  font-size: 14px;
  color: #666;
}

.date-time {
  margin-top: 4px;
  font-size: 12px;
  color: #999;
}

.aqi {
  margin-top: 16px;
}

.aqi-status {
  font-size: 16px;
  font-weight: bold;
}

.aqi-value {
  font-size: 48px;
}

.additional-info {
  margin-top: 16px;
  font-size: 12px;
  color: #666;
}

.error {
  margin-top: 16px;
  color: red;
}
</style>
