<template>
  <div class="content">
    <a-table :columns="columns" :data-source="data" row-key="id" bordered>
      比賽公告
    </a-table>
  </div>
  <div class="container">
    <h1>徑賽</h1>
    <div class="row">
      <div class="card-container" @click="selectPanel('100m')">
        <div class="cover" style="background-image: url('./100m男女.jpg');"></div>
        <div class="back" style="background-image: url('./LINE_ALBUM_2024.7.12_240712_5.jpg');"></div>
      </div>
      <div class="card-container" @click="selectPanel('200m')">
        <div class="cover" style="background-image: url('./200m男女.jpg');"></div>
        <div class="back" style="background-image: url('./LINE_ALBUM_2024.7.12_240712_6.jpg');"></div>
      </div>
      <div class="card-container" @click="selectPanel('400m')">
        <div class="cover" style="background-image: url('./400m男女.jpg');"></div>
        <div class="back" style="background-image: url('./LINE_ALBUM_2024.7.12_240712_7.jpg');"></div>
      </div>
    </div>
    <div class="row">
      <div class="card-container" @click="selectPanel('800m')">
        <div class="cover" style="background-image: url('./800m男女.jpg');"></div>
        <div class="back" style="background-image: url('./LINE_ALBUM_2024.7.12_240712_8.jpg');"></div>
      </div>
      <div class="card-container" @click="selectPanel('1600m')">
        <div class="cover" style="background-image: url('./1600m男女.jpg');"></div>
        <div class="back" style="background-image: url('./LINE_ALBUM_2024.7.12_240712_9.jpg');"></div>
      </div>
    </div>
  </div>
  <hr>
  <h1>田賽</h1>
  <div class="body1">
    <div class="container1">
      <div class="panel active" style="background-image: url('./鉛球.gif')" @click="selectPanel('鉛球')">
        <h3>鉛球</h3>
        <p> 規則<br> 1.預賽每名運動員有三次的試擲的機會，選擇成績最好的八名運動員進入決賽<br> 2.若第八名運動員的成績相同，這些同成績的運動員均能晉身決賽。<br> 3.決賽當中，每名運動員再有三次試擲的機會。</p>
      </div>
      <div class="panel" style="background-image: url('./跳高.gif')" @click="selectPanel('跳高')">
        <h3>跳高</h3>
        <p>規則<br> 1. 運動員必須以單腳起跳。<br> 2.	過竿時，如觸及橫竿，只要竿沒有掉下，亦不算犯規。<br> 3.	不管高度為多少，連續三次試跳失敗，便會喪失繼續比賽的資格。</p>
      </div>
      <div class="panel" style="background-image: url('./跳遠.gif')" @click="selectPanel('跳遠')">
        <h3>跳遠</h3>
        <p class="home-feature-item__head u-font-bold">規則<br> 1.每名運動員有三次的試跳機會，選擇成績最好的八名運動員進入決賽<br> 2.若第八名運動員的成績有兩或以上相同，這些同成績的運動員均能晉身決賽。<br> 3.決賽當中，每名運動員再有三次試跳的機會。</p>
      </div>
    </div>
  </div>
  <hr>
  <h1>團體賽</h1>
  <div class="container2">
    <div class="content2">
      <header class="c-head01">

        
      </header>
      <br>
      <div class="home-feature-item">
        <div class="home-feature-item__bg">
          <div class="home-feature-item__imgs">
            <img v-for="img in images" :key="img.id" 
                :src="img.src" alt="" loading="lazy" 
                :class="{ 'is-active': img.id === activeImg }"
                @click="setActive(img.id)">
          </div>
          <div class="home-feature-item__content">
            <ol class="home-feature-item__nums">
              <li v-for="num in nums" :key="num.id"
                  :class="['home-feature-item__num u-font-en', { 'is-active': num.id === activeImg }]"
                  @click="setActive(num.id)">
                {{ num.text }}
              </li>
            </ol>
            <div class="home-feature-item__textwrap">
              <div v-for="content in contents" :key="content.id"
                   :class="['home-feature-item__textarea', { 'is-active': content.id === activeImg }]">
                <h2 class="home-feature-item__head u-font-bold">規則</h2>
                <p1 class="home-feature-item__txt">{{ content.text }}</p1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      htmlContent: '',
      selectedPanel: null,
      panelContent: {
        '100m': '<p>100m 內容</p>',
        '200m': '<p>200m 內容</p>',
        '400m': '<p>400m 內容</p>',
        '800m': '<p>800m 內容</p>',
        '1600m': '<p>1600m 內容</p>',
        '鉛球': '<p>鉛球 內容</p>',
        '跳高': '<p>跳高 內容</p>',
        '跳遠': '<p>跳遠 內容</p>'
      },
      columns: [
        { title: '序號', dataIndex: 'id', key: 'id' },
        { title: '標題', dataIndex: 'title', key: 'title' },
        { title: '日期', dataIndex: 'date', key: 'date' },
        { title: '資料建立者', dataIndex: 'author', key: 'author' },
      ],
      data: [
        { id: 1, title: '國立新竹高級工業職業學校新興科技發展推廣中心辦理「2024新興科技機器人競賽」', date: '2024-06-28', author: '圖書館' },
        { id: 2, title: '國立虎尾高級農工職業學校新興科技發展推廣中心辦理「113年全國高級中等學校新興科技示範創新應用專題競賽」', date: '2024-06-27', author: '圖書館' },
        { id: 3, title: '第五屆蘭文學獎', date: '2024-06-25', author: '圖書館' },
        { id: 4, title: '台中家商承辦「我思故我在 - SDGs全國高中高職創意企劃書事賽』，請惠予子協力並鼓勵貴校學生踴躍報名參加', date: '2024-06-24', author: '圖書館' },
        { id: 5, title: '國立公共事務學院理事會「2024永續未來共創會」', date: '2024-06-18', author: '圖書館' },
        { id: 6, title: '南洋大學理學院辦理「2024春季高級職業訓練一日會』宣導會', date: '2024-06-18', author: '圖書館'},
        { id: 7, title: '海青高級商業職業學校「新興科技技術發展推廣中心」辦理2024全國VR活動', date: '2024-06-14', author: '圖書館' },
      ],
      activeImg: 1,
      images: [
        { id: 1, src: './4x100接力.png' },
        { id: 2, src: './大隊接力.jpg' },
        { id: 3, src: './2人3腳.jpg' }
      ],
      nums: [
        { id: 1, text: '400m接力' },
        { id: 2, text: '大隊接力' },
        { id: 3, text: '趣味競賽' }
      ],
      contents: [
        {
          id: 1,
          text: '是由四位選手各跑100公尺的接力賽跑，每人各跑100公尺。第一棒起跑的姿勢與400公尺個人賽相同，每名選手都要接力棒，其餘各棒的選手則根據第二棒和第三棒的選手通過200公尺起點處的先後順序，按次序在接力區內等候接棒，接力棒必須在接力區內完成交接，未能接力區完成交接可視為取消資格。'
        },
        {
          id: 2,
          text: '1. 所謂「大隊接力賽跑」，意指接力比賽，20人x100公尺，每隊報名至多30人，女生不得少於10人，下場比賽20人，每人跑100公尺，女生須先完成前10棒次，11～20棒次始可安排男生。2.比賽晉級方式：預賽採抽籤分組計時取前八名進入決賽，決賽道次依43567821進行編配。'
        },
        {
          id: 3,
          text: '(1) 比賽時由 2 人為一組兩人並列，綁腳帶將兩人靠近之左右腳綁緊固定好，手持接力棒準備出發。(2) 兩人快走或跑步至前方10公尺折返點繞行後回到起點線將接力棒接給下一組，繼續出發進行比賽。(3) 比賽進行中接力棒或腳帶脫落，需返回掉落地點，拾起接力棒或綁好腳帶後繼續比賽。'
        }
      ]
    };
  },

  // 加载外部 HTML 文件
  mounted() {
    // 加载外部 HTML 文件
    fetch('src/groupcompeti/團體賽.html')
      .then(response => response.text())
      .then(data => {
        this.htmlContent = data;
        this.$nextTick(() => {
          this.setupClickListeners(); // 確保加載事件後續執行
        });
      });
  },
  methods: {
    setupClickListeners() {
      const panels = document.querySelectorAll('.panel');
      panels.forEach(panel => {
        panel.addEventListener('click', () => {
          this.removeActiveClasses();
          panel.classList.add('active');
        });
      });
    },
    removeActiveClasses() {
      const panels = document.querySelectorAll('.panel');
      panels.forEach(panel => {
        panel.classList.remove('active');
      });
    },
    selectPanel(panel) {
      this.selectedPanel = panel;
      this.htmlContent = this.panelContent[panel];
    },
    setActive(id) {
      this.activeImg = id;
    }
  }
};

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Muli&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.content {
  height: 50dvh;
  padding: 3.5% 3.5%;
  background-color: #f0f0f0;
}

a-table {
  margin: 16px;
}

a-icon {
  margin-right: 8px;
}

html {
  font-size: 22px;
}

body {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Helvetica, Arial;
  background-image: radial-gradient(circle 506px at 50.6% 16.5%, rgba(239,252,250,1) 5.5%, rgba(154,192,206,1) 100.2%);
}

.container {
  display: flex;
  text-align: center;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.row {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.card-container {
  width: 400px;
  height: 300px;
  position: relative;
  perspective: 1000px;
  margin: 20px; /* Add margin */
}

.cover, .back {
  width: 100%;
  height: 100%;
  position: absolute;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  transition: transform .25s ease-in-out;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  border-radius: .4rem;
  box-shadow: 0 .2rem .5rem rgba(0, 0, 0, .18);
  text-shadow: 0 .15rem .2rem rgba(0, 0, 0, .2);
  background-size: cover;
  background-position: center;
}

.cover {
  transform: rotatey(0deg);
}

.card-container:hover .cover {
  transform: rotatey(180deg);
}

.back {
  transform: rotatey(-180deg);
}

.card-container:hover .back {
  transform: rotatey(0deg);
}

.body1 {
  font-family: 'Muli', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  overflow: hidden;
  margin: 0 auto;
}

.container1 {
  display: flex;
  width: 90vw;
  margin-top: -100px;
}

.panel {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 80vh;
  border-radius: 50px;
  color: #fff;
  cursor: pointer;
  flex: 0.5;
  margin: 10px;
  position: relative;
  -webkit-transition: all 700ms ease-in;
}

.panel h3 {
  font-size: 72px;
  position: absolute;
  bottom: 800px;
  left: 20px;
  margin: 0;
  opacity: 0;
}

.panel.active {
  flex: 5;
}

.panel.active h3 {
  opacity: 1;
  transition: opacity 0.3s ease-in 0.4s;
}

.panel p {
  font-family: 'Muli', sans-serif;
  background-color: wheat;
  color: #cf2e2e;
  font-size: 30px;
  position: absolute;
  bottom: 50px;
  right: 20px;
  margin: 0;
  opacity: 0;
}

.panel.active p {
  opacity: 1;
  transition: opacity 0.3s ease-in 0.4s;
}

h1 {
  text-align: center;
  margin-top: 50px;
  font-weight: bold;
  font-size: 50px;
}

.home-feature-item__num {
  width: 100px; /* Set width for the circles */
  height: 100px; /* Set height for the circles */
  line-height: 100px; /* Center text vertically */
  overflow: hidden; /* Hide overflow text */
  text-align: center; /* Center text horizontally */
  border-radius: 50%; /* Make the element circular */
  display: inline-block; /* Inline block for the circles */
  white-space: nowrap; /* Prevent text from wrapping */
}

.home-feature-item__content {
  margin-top: -20px; /* Adjust this value as needed to move the block upward */
}

.home-feature-item__bg {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.home-feature-item__content {
  order: 2;
}

.home-feature-item__imgs {
  order: 1;
}

@media (max-width: 480px) {
  .container {
    width: 100vw;
  }

  .panel:nth-of-type(4),
  .panel:nth-of-type(5) {
    display: none;
  }
}


.container2 {
  display: flex;
  text-align: center;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  margin-top:100px;
}

.content2 {
  display:flex;
  justify-content: center;
  align-items: center;
  height: 40dvh;
  width: 1500px;
  background-color: #f0f0f0;
}

.home-feature-item__bg {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.home-feature-item__imgs {
  position: relative;
  width: 800px;
  height: 350px;
  margin-left:200px;
}

.home-feature-item__imgs img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease-in-out;
  cursor: pointer;
}

.home-feature-item__imgs img:not(.is-active) {
  opacity: 0;
}

.home-feature-item__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width:70%;
  margin-right:100px;
}

.home-feature-item__nums {
  display: flex;
  justify-content: space-around;
  width: 70%;
  margin-bottom: 20px;
  margin-left:100px;
}

.home-feature-item__num {
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
  border-radius: 50%;
  display: inline-block;
  white-space: nowrap;
  cursor: pointer;
  background-color: #ddd;
}

.home-feature-item__num.is-active {
  background-color: #000;
  color: #fff;
}

.home-feature-item__textwrap {
  width: 50%;
  text-align: left;
}
p1{
  font-size: 20px;
}

.home-feature-item__textarea {
  display: none;
  width:500px;
  
}

.home-feature-item__textarea.is-active {
  display: block;
}
</style>
