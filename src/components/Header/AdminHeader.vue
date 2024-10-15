<template>
  <div>
    <!-- 導覽列 -->
    <nav class="menu">
      <ol>
        <li class="menu-item" v-for="(link, index) in links" :key="link.path" @mouseover="showSubMenu(index)" @mouseleave="hideSubMenu()">
          <RouterLink :to="link.path" :class="{ active: index === activeIndex }">
            {{ link.name }}
          </RouterLink>
          <!-- 下拉選單 -->
          <ol v-if="index === activeSubMenuIndex" class="sub-menu">
            <li class="menu-item" v-for="(subLink, subIndex) in link.subLinks" :key="subLink.path">
              <RouterLink :to="subLink.path" class="sub-menu-item" :class="{ active: subLink.path === route.path }">
                {{ subLink.name }}
              </RouterLink>
            </li>
          </ol>
        </li>
        <!-- 登入訊息 -->
      </ol>
      <div class="welcome-message">
        {{ userName }}{{ userType }}，你好~
        <button @click="handleLogout" style="background: #84C1FF;">登出</button>
      </div>
    </nav>
  </div>
  <div class="area"></div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

const router = useRouter();
const store = useStore();

const handleLogout = () => {
  store.dispatch('logout');
  router.push('/');
};

const route = useRoute();

const activeIndex = ref(0);
const activeSubMenuIndex = ref(-1);
const userType = computed(() => store.state.userType);  // 讀取 userType
const userName = computed(() => store.state.userName);  // 讀取 userName

const links = [
{ name: '首頁', path: '/admin-home'},
{ name: '權限管理系統', path: '/admin-home', subLinks: [
      { name: '學生', path: '/viewstudent' },
      { name: '老師', path: '/viewteacher' },
      { name: '管理員', path: '/viewadmin' }
    ]},
  { name: '賽程表制定', path: '/admin-home', subLinks: [
      { name: '報名前賽程制定', path: '/formproducer' },
      { name: '單淘汰賽程表產生器', path: '/SingleElimination' },
      { name: '競賽田賽報名表產生器', path: '/CompetitionProducer' }
    ]},
  { name: '運動會報名系統', path: '/admin-home', subLinks: [
      { name: '查看賽程', path: '/schedule' },
      { name: '報名系統', path: '/signup' },
      { name: '檢錄系統', path: '/FormExport' }
    ]},
  { name: '運動會賽程總表', path: '/admin-home', subLinks: [
      // { name: '賽程表上傳管理', path: '/atheleteorder' },
      { name: '賽程表匯入器', path: '/schedulechange' },
      { name: '運動會選手名單', path: '/playerlist' },
      { name: '秩序冊產生器', path: '/ordermanger' }
    ]},
  { name: '成績輸入計算系統', path: '/admin-home', subLinks: [
      { name: '輸入成績', path: '/performanceinput' },
      { name: '計算積分', path: '/scoreinput' },
      { name: '成績查詢', path: '/viewperformance' },
      { name: '獎狀下載', path: '/certificate' },
      { name: '歷史成績查詢', path: '/HistoricalPerformance' },
    ]},
  { name: '意見反應系統', path: '/admin-home', subLinks: [
      { name: '問題與意見反應', path: '/createquestion' },
      { name: '回覆系統', path: '/systemquestions' },
      // { name: '回覆系統2', path: '/sportquestions' },
      { name: '問題查看', path: '/viewresponse' },
    ]},
];


watch(route, () => {
  activeIndex.value = links.findIndex(link => link.path === route.path);
});

function showSubMenu(index) {
  activeSubMenuIndex.value = index;
}

function hideSubMenu() {
  activeSubMenuIndex.value = -1;
}
</script>

<style scoped>
/* 通用樣式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* html, body {
  font-size: 16px;
  font-family: 'Fira Mono', monospace;
  margin: 0;
  background: #2A363B;
} */

/* 導覽列樣式 */
.menu {
  /* 滾動時導覽列至於頂部 */
  position: fixed;
  top: 0;
  z-index: 10;
width: 100%;
  background: hsl(197, 54%, 65%);
  height: 4rem;

}

.menu ol {
  list-style-type: none;
  margin: 0 auto;
  padding: 0;
}

.menu > ol {
  max-width: 1230px;
  padding: 0 2rem;
  display: flex;
}

.menu .menu-item {
  flex: 1;
  padding: 0.75rem 0;
  position: relative;
  line-height: 2.5rem;
  text-align: center;
}

.menu .menu-item a {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: block;
  font-size: 1.05rem;
  color: #ffffff;
  font-weight: bold;
  text-decoration: none; /* 去掉文字底線 */
}

.menu .menu-item:after {
  content: '';
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  bottom: 5px;
  left: calc(50% - 2px);
  background: #ffffff;
  will-change: transform;
  transform: scale(0);
  transition: transform 0.2s ease;
}

.menu .menu-item:hover:after {
  transform: scale(1);
}

.menu .sub-menu {
  position: absolute;
  width: 100%;
  top: 100%;
  left: 0;
  display: none;
  z-index: 1;
}

.menu .menu-item:hover .sub-menu {
  display: block;
}

.menu .sub-menu .menu-item {
  padding: 0.75rem 0;
  background: hsl(197, 54%, 65%);
  opacity: 0;
  transform-origin: bottom;
  animation: enter 0.2s ease forwards;
}

.menu .sub-menu .menu-item:nth-child(1) {
  animation-duration: 0.2s;
  animation-delay: 0s;
}

.menu .sub-menu .menu-item:nth-child(2) {
  animation-duration: 0.3s;
  animation-delay: 0.1s;
}

.menu .sub-menu .menu-item:nth-child(3) {
  animation-duration: 0.4s;
  animation-delay: 0.2s;
}

.menu .sub-menu .menu-item:hover {
  background: rgb(87, 136, 142);
}

.menu .sub-menu .menu-item a {
  padding: 0 0.75rem;
  font-weight: bold;
  text-decoration: none; /* 去掉文字底線 */
}

.area{

padding-top: 0%; 
   padding-bottom: 4.1%;

}

@keyframes enter {
  from {
    opacity: 0;
    transform: scaleY(0.98) translateY(10px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes fade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 歡迎訊息樣式 */
.welcome-message {
  position: absolute;
  top: 0;
  right: 0;
  margin: 1%;
  font-size: .9em;
  font-weight: bold;
  text-align: center;
  
  
}



.welcome-message button {
  border: 2px solid #ffffff;
  outline: none;
  border-radius: 10%;
  padding: 3.5px;
  font-size: 1rem;
  font-weight: bold;
  color: #000;
  transition: color 0.3s;
}

.welcome-message button:hover {
  color: #ffffff;
  /* background-color: #84C1FF; */
}
</style>