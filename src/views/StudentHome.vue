<template>
  <Carousel/>
    <div>
      <div class="content">
<div class="news">
  <Rainfall/>


    <ag-grid-vue
      class="ag-theme-alpine"
      style="width: 100%; height: 77%;"
      :columnDefs="columnDefs"
      :rowData="rowData"
      :gridOptions="gridOptions"
      :wrapText="true"
    />


  </div>
    <div class="API">
        <AQI/>
        <Temperature/>
    </div>
  </div>
      <div class="singer">
        <h1>全台最大 校園演唱會 韓星來台 確定演出</h1>
        <div class="image-container">
          <div class="box">
            <img src="/運動會/輝人.png" alt="輝人">
          </div>
          <div class="box">
            <img src="/運動會/華沙.png" alt="華沙">
          </div>
          <div class="box">
            <img src="/運動會/玟星.png" alt="玟星">
          </div>
          <div class="box">
            <img src="/運動會/頌樂.png" alt="頌樂">
          </div>
        </div>
      </div>
      <!-- <div class="container">
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
      </div> -->
      <br>
      <br>
      <br>
      <br>
      <br>
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
      <hr>
      <h1>晉級規則</h1>
      <div class="shell1">
        <div class="content1">
            <div class="item1">
                <div class="content-container1">
                    <h1>晉級流程</h1>
                    <h2>比賽項目</h2>
                    <p>100m、200m、400m、400m接力、大隊接力</p>
                    <h2>預賽流程</h2>
                    <ol>
                        <li><strong>分組：</strong>

                            <ul>
                                <li>16名(班)參賽者分為三組：6人(班)、5人(班)、5人(班)。</li>
                            </ul>
                        </li>
                        <li><strong>晉級規則：</strong>
                            <ul>
                                <li>每組第一名直接晉級決賽。</li>
                                <li>其餘13人(班)按秒數排名，最快的三人(班)晉級決賽。</li>
                                
                            </ul>
                        </li>
                    </ol>
                    <h2>決賽流程</h2>
                    <ul>
                        <li>總共6人(班)參加決賽，包括每組的第一名和秒數最快的三人(班)。</li>
                    </ul>
                </div>
            </div>
            <div class="item1">
                <div class="content-container1">
                    <h1>比賽項目</h1>
                    <p>800m、1600m</p>
                    <h2>晉級流程</h2>
                    <p>直接進行決賽，依據秒數決定前三名。</p>
                </div>
            </div>
            <div class="item1">
                <div class="content-container1">
                    <h1>比賽項目</h1>
                    <p>跳高決賽、鉛球決賽、跳遠決賽</p>
                    <h2>晉級流程</h2>
                    <p>預賽每班一位，共16位參賽者，取前八強晉級決賽。</p>
                    <div class="buttons">
                                    <button  @click="goTo2022" class="year-button1">看更多</button>
                                </div>
                </div>
            </div>
            <div class="item1">
                <div class="content-container1">
                    <h1>比賽項目</h1>
                    <p>趣味競賽</p>
                    <h2>晉級流程</h2>
                    <p>每班一隊，共16隊參賽，16強單敗淘汰制度。</p>
                </div>
            </div>
        </div>
    </div>
      </div>
  </template>
  
  <script>
import Carousel from '../components/Carousel.vue'
import AQI from '../components/AQI.vue'
import Temperature from '../components/Temperature.vue'
import Rainfall from '@/components/Rainfall.vue';
import { AgGridVue } from 'ag-grid-vue3';

export default {
  components: {
    Carousel,
    AQI,
    Temperature,
    Rainfall,
    'ag-grid-vue': AgGridVue
  },
    data() {
      return {
        columnDefs: [
        { headerName: '序號', field: 'id', width: 85 }, // 固定寬度
        { headerName: '標題', field: 'title', flex: 2 }, // 可調整寬度
        // { headerName: '標題', field: 'title', flex: 2, minWidth: 705, maxWidth: 350 }, // 可調整寬度
        { headerName: '日期', field: 'date' ,width:110}, // 剩餘空間的一半
        { headerName: '資料建立者', field: 'author', width: 125 }, // 剩餘空間的一半
      ],
      rowData: [
        { id: 1, title: '國立新竹高級工業職業學校新興科技發展推廣中心辦理「2024新興科技機器人競賽」', date: '2024-06-28', author: '圖書館' },
        { id: 2, title: '國立虎尾高級農工職業學校新興科技發展推廣中心辦理「113年全國高級中等學校新興科技示範創新應用專題競賽」', date: '2024-06-27', author: '圖書館' },
        { id: 3, title: '第五屆蘭文學獎', date: '2024-06-25', author: '圖書館' },
        { id: 4, title: '台中家商承辦「我思故我在 - SDGs全國高中高職創意企劃書事賽』，請惠予子協力並鼓勵貴校學生踴躍報名參加', date: '2024-06-24', author: '圖書館' },
        { id: 5, title: '國立公共事務學院理事會「2024永續未來共創會」', date: '2024-06-18', author: '圖書館' },
        { id: 6, title: '南洋大學理學院辦理「2024春季高級職業訓練一日會』宣導會', date: '2024-06-18', author: '圖書館'},
        { id: 7, title: '海青高級商業職業學校「新興科技技術發展推廣中心」辦理2024全國VR活動', date: '2024-06-14', author: '圖書館' },
        { id: 8, title: '海青高級商業職業學校「新興科技技術發展推廣中心」辦理2024全國VR活動', date: '2024-06-14', author: '圖書館' },
        { id: 9, title: '海青高級商業職業學校「新興科技技術發展推廣中心」辦理2024全國VR活動', date: '2024-06-14', author: '圖書館' },
        { id: 10, title: '海青高級商業職業學校「新興科技技術發展推廣中心」辦理2024全國VR活動', date: '2024-06-14', author: '圖書館' },
      ],
      gridOptions: {
        defaultColDef: {
          resizable: true,
          sortable: true,
          wrapText: true,
          autoHeight: true,
        },
        pagination: true,
        paginationPageSize: 10,
        cacheBlockSize: 10,
      },
      rowModelType: 'clientSide',
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
      onGridReady(params) {
      params.api.setRowData(this.rowData);
    },
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
      goTo2022() {
    window.open('http://localhost:63342/untitled/1357/50projects50days-master/3d-boxes-background/index.html?_ijt=shqirmd3vpbqtie0rjvp4m0ti5&_ij_reload=RELOAD_ON_SAVE', '_blank');
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
  height: 100%;
  padding: 3.5% 4.025%;
  background-color: #f0f0f0;
  display: flex;

  flex-wrap: wrap;
  justify-content: center;

}

.news {
  /* width: 100%; */
  /* height: 100%; */

  margin-top: 2.025%;
  margin-right: 1%;
}

.grid-container {
  width: 62%; /* 調整寬度 */
  height: 62%; /* 調整高度 */
  display: flex;
}

.ag-theme-alpine {
  /* flex: 1; */
  margin: 5% 0;
}

.API{
  margin: 2% 1%;
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
    margin-top: 250px; /* 增加上邊距，使標題向下移動 */
    margin-bottom: 100px;
    font-weight: bold;
    font-size: 50px;
    position: relative;
    
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
  
  .image-container {
    display: flex;
    justify-content: center; /* 使容器居中 */
    width: 66%; /* 將寬度縮小至原先的2/3 */
    margin: 0 auto;
    -webkit-box-reflect: below 1px linear-gradient(transparent, transparent, #0004);
  }
  
  .image-container .box {
    position: relative;
    width: 213px; /* 縮小寬度 */
    height: 266px; /* 縮小高度 */
    margin: 0 13px; /* 縮小間距 */
    border-radius: 20px;
    background: linear-gradient(45deg, #2da2ff 25%, #444 25%, #444 50%, #2da2ff 50%, #2da2ff 75%, #444 75%, #444 100%);
    background-size: 40px 40px;
    filter: grayscale(1);
    animation: animateBg 0.5s linear infinite;
    animation-play-state: paused;
    transition: filter 1s;
    display: flex;
    justify-content: center;
  }
  
  .image-container .box:nth-child(2) {
    background: linear-gradient(135deg, #ff61ae 25%, #444 25%, #444 50%, #ff61ae 50%, #ff61ae 75%, #444 75%, #444 100%);
    background-size: 40px 40px;
  }
  
  .image-container .box:nth-child(3) {
    background: linear-gradient(135deg, #ffaa00 25%, #444 25%, #444 50%, #ffaa00 50%, #ffaa00 75%, #444 75%, #444 100%);
    background-size: 40px 40px;
  }
  
  .image-container .box:nth-child(4) {
    background: linear-gradient(135deg, #00ffaa 25%, #444 25%, #444 50%, #00ffaa 50%, #00ffaa 75%, #444 75%, #444 100%);
    background-size: 40px 40px;
  }
  
  .image-container .box:hover {
    animation-play-state: running;
    filter: grayscale(0);
  }
  
  @keyframes animateBg {
    0% {
      background-position: 0;
    }
    100% {
      background-position: 40px;
    }
  }
  
  .image-container .box img {
    position: absolute;
    bottom: 0;
    height: 90%;
    transition: height 0.5s;
  }
  
  .image-container .box:hover img {
    height: 100%; /* 修改為100%以保持圖片比例 */
  }
  .shell1 {
    position: relative;
    width: 100%;
    height: 30vw;
    /* max-width: 600px; */
    /* max-height: 460px; */
    margin: 0 auto;
    color: white;
    perspective: 1000px;
    transform-origin: center;
    background-color: gray;
}

.content1 {
    margin-left:500px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    width: 100%;
    height: 100%;
    transform-origin: center;
    transform-style: preserve-3d;
    transform: translateZ(-35vw) rotateY(0);
    animation: carousel 12s infinite cubic-bezier(0.77, 0, 0.175, 1) forwards;
    margin:0 auto;
}

.item1 {
    
    position: absolute;
    width: 90vw;
    height: 70vw;
    max-width: 600px;
    max-height: 460px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    color: #333;
    text-align: center;
    padding: 30px;
    overflow: hidden;
    /* backface-visibility: hidden; */
}

.item1:nth-child(1) {
    transform: rotateY(0) translateZ(45vw);
    /* background: rgba(255, 255, 255, 1); Less transparency */
}

.item1:nth-child(2) {
    transform: rotateY(90deg) translateZ(45vw);
}

.item1:nth-child(3) {
    transform: rotateY(180deg) translateZ(45vw);
}

.item1:nth-child(4) {
    transform: rotateY(270deg) translateZ(45vw);
}

h1, h2 {
    margin: 0.5em 0;
    font-family: 'Noto Sans TC', sans-serif;
}

h1 {
    font-size: 1.8em;
    font-weight: 700;
    color: #2c3e50;
}

h2 {
    font-size: 1.4em;
    font-weight: 700;
    color: #34495e;
}

p, ul, ol {
    font-size: 1.1em;
    font-weight: 400;
    color: #2c3e50;
    line-height: 1.6;
}

ul, ol {
    text-align: left;
    margin: 0;
    padding-left: 1.5em;
}

.content-container1 {
    text-align: left;
    line-height: 1.6;
}

@keyframes carousel {
    0%,
    25% {
        transform: translateZ(-45vw) rotateY(0);
    }

    33.33%,
    50% {
        transform: translateZ(-45vw) rotateY(-90deg);
    }

    58.33%,
    75% {
        transform: translateZ(-45vw) rotateY(-180deg);
    }

    83.33%,
    100% {
        transform: translateZ(-45vw) rotateY(-270deg);
    }
}
.singer{
    margin-top: 200px;
}

.year-button {
  color:white;
  background-color:white;
}
.buttons{
  background-color:white;
}
  </style>
  