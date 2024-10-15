<template>
  <div class="marquee">
    <div class="announcement">重要資訊</div>
    <div class="marquee-content-wrapper" ref="wrapper">
      <div class="marquee-inner" ref="inner" @mouseover="stop" @mouseout="start">
        <div v-for="item in marqueeItems" :key="item.id" class="marquee-content" :style="{ color: item.color }">
          <span @click="navigateTo(item.url)">
            {{ item.text }}
          </span>
        </div>
        <!-- 重複一次內容 -->
        <div v-for="item in marqueeItems" :key="'repeat-' + item.id" class="marquee-content" :style="{ color: item.color }">
          <span @click="navigateTo(item.url)">
            {{ item.text }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      marqueeItems: [
        { id: 1, url: 'https://www.moj.gov.tw/2204/2771/45424/190357/post', text: '【宣傳片】毒品防制宣導思辨篇《刑影不離》', color: 'blue' },
        { id: 2, url: 'https://cirn.moe.edu.tw/Tape/TapeInfo.aspx?tapeid=1458&mode=&fit=0&fid=all&Vmode=DivWP&ppage=1&wpage=1&ssh=&Sfid=0', text: '【宣傳片】【性別平等教育(五)】如果早知道－男生也會被性侵', color: 'green' },
        { id: 3, url: 'https://www.moj.gov.tw/2204/2771/45424/190350/post', text: '【宣傳片】毒品防制宣導心理篇《拒絕毒品 才是解方》', color: 'red' },
      ],
      scrollAmount: 1, // 滾動速度
      intervalId: null // 定義一個定時器id
    };
  },
  methods: {
    start() {
      const wrapper = this.$refs.wrapper;
      const inner = this.$refs.inner;
      if (!wrapper || !inner) {
        return;
      }
      this.intervalId = setInterval(() => {
        if (wrapper.scrollLeft >= inner.scrollWidth / 2) {
          wrapper.scrollLeft = 0;
        } else {
          wrapper.scrollLeft += this.scrollAmount;
        }
      }, 16); // 大約每秒 60 幀
    },
    stop() {
      clearInterval(this.intervalId);
      this.intervalId = null;
    },
    navigateTo(url) {
      window.open(url, '_blank');
    }
  },
  mounted() {
    if (this.$refs.wrapper && this.$refs.inner) {
      this.start();
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
.marquee {
  width: 1000px;
  background-color: white;
  border: 1px solid #dcdcdc;
  overflow: hidden;
  white-space: nowrap;
  position: relative;
  border-radius: 8px 8px 0 0;
}

.announcement {
  font-weight: bold;
  color: white;
  padding: 8px;
  text-align: center;
  background-color: #4f8dc2;
}

.marquee-content-wrapper {
  display: flex;
  overflow: hidden;
  width: 100%;
  position: relative;
}

.marquee-inner {
  display: flex;
  white-space: nowrap;
}

.marquee-content {
  padding: .5% 2%; /* 增加左右間距 */
  display: flex;
  align-items: center;
  text-decoration: none; /* 移除超連結的下劃線 */
}

.marquee-content span {
  cursor: pointer; /* 確保鼠標移到文字部分顯示為指針 */
}
</style>
