import './assets/main.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import 'ant-design-vue/dist/reset.css';
import 'primeicons/primeicons.css';  // 引入PrimeIcons
import ElementPlus from 'element-plus'
import 'ag-grid-community/styles/ag-grid.css';//7-14 AG-Grid
import 'ag-grid-community/styles/ag-theme-alpine.css';//7-14 AG-Grid


import antdv from 'ant-design-vue';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import App from './App.vue';
import router from './router';
import store from './stores/appStore'; // 引入你的 store


const app = createApp(App);
app.use(ElementPlus, { size: 'small', zIndex: 3000 })
app.use(createPinia());
app.use(router);
app.use(store); // 使用 store
app.use(antdv);
app.use(PrimeVue, {
  theme: {
    preset: Aura
  }
});



app.mount('#app');
