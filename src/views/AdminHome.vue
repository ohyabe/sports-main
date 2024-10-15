<template>
  <h1>管理員使用說明書</h1>
  <div class="content">
  <div class="img1">
        <img src="/adminhome/clean._page-0004.jpg" alt="">
    </div>
    <div class="img1">
        <img src="/adminhome/clean._page-0005.jpg" alt="">
    </div>
    <div class="img1">
        <img src="/adminhome/clean._page-0006.jpg" alt="">
    </div>
    <div class="img1">
        <img src="/adminhome/clean._page-0007.jpg" alt="">
    </div>
    <div class="img1">
        <img src="/adminhome/clean._page-0008.jpg" alt="">
    </div>
    <div class="img1">
        <img src="/adminhome/clean._page-0009.jpg" alt="">
    </div>
    <div class="img1">
        <img src="/adminhome/clean._page-0010.jpg" alt="">
    </div>
    <div class="img1">
        <img src="/adminhome/clean._page-0011.jpg" alt="">
    </div>
    <div class="img1">
        <img src="/adminhome/clean._page-0012.jpg" alt="">
    </div>
    <div class="img1">
        <img src="/adminhome/clean._page-0013.jpg" alt="">
    </div>
    <div class="img1">
        <img src="/adminhome/clean._page-0014.jpg" alt="">
    </div>
    <div class="img1">
        <img src="/adminhome/clean._page-0015.jpg" alt="">
    </div>
    <div class="img1">
        <img src="/adminhome/clean._page-0016.jpg" alt="">
    </div>
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
        </div>
      <div class="panel" style="background-image: url('./跳高.gif')" @click="selectPanel('跳高')">
        <h3>跳高</h3>
        </div>
      <div class="panel" style="background-image: url('./跳遠.gif')" @click="selectPanel('跳遠')">
        <h3>跳遠</h3>
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



  background-color: rgb(214, 214, 214);
}

a-table {
  margin-top:200px;
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
  background-color:gray;
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


@media (max-width: 480px) {
  .container {
    width: 100vw;
  }

  .panel:nth-of-type(4),
  .panel:nth-of-type(5) {
    display: none;
  }
}

.img1 {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80%;
  height: 80%;
  z-index: 3;
  margin:0 auto;
 
}

.img1 img {
  max-width: 100%;
  max-height: 100%;
  border: 1px solid gray;
  
}

div.img{
  background-color:gray;
}
</style>
