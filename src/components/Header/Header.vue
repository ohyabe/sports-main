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
      </ol>
      <!-- 登入按鈕 -->
      <RouterLink to="/login">
        <button class="login-button">登入</button>
      </RouterLink>
    </nav>
  </div>
  <div class="area"></div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

const route = useRoute();

const activeIndex = ref(0);
const activeSubMenuIndex = ref(-1);

const links = [
{ name: '最新消息', path: '/' },
{ name: '活動花絮', path: '/about' },

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

/* 導覽列樣式 */
.menu {
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
text-decoration: none;
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
text-decoration: none;
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

/* 登入按鈕樣式 */
.login-button {
  position: absolute;
  top: 0;
  right: 0;
  margin: 1%;
  border: 2px solid #ffffff;
  outline: none;
  border-radius: 10%;
  padding: 3.5px;
  font-size: 1rem;
  font-weight: bold;
  color: #000;
  transition: color 0.3s;
}

.login-button:hover {
  /* color: #ffffff; */
  background-color: #ffffff;
}
</style>
