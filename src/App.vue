<script setup>
import Footer from '@/views/Footer.vue';
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import AdminHeader from './components/Header/AdminHeader.vue';
import Header from './components/Header/Header.vue';
import StudentHeader from './components/Header/StudentHeader.vue';
import TeacherHeader from './components/Header/TeacherHeader.vue';

const store = useStore();
const userType = computed(() => store.state.userType);
const router = useRouter();

const getHeaderComponent = () => {
  switch (userType.value) {
    case 'student':
      return StudentHeader;
    case 'teacher':
      return TeacherHeader;
    case 'admin':
      return AdminHeader;
    default:
      return Header;
  }
};

onMounted(() => {
  const publicPages = ['/', '/login', '/reset_password'];
  if (!publicPages.includes(router.currentRoute.value.path) && userType.value === 'guest') {
    router.push('/');
  }
});
</script>

<template>
  <div class="page-container">
    <div class="header">
      <component :is="getHeaderComponent()" />
    </div>
    <div class="content">
      <router-view />
    </div>
    <Footer />
  </div>
</template>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  /* width: 100dvw; */
}

.content {
  flex: 1;
}

footer {
  background-color: #f8f9fa;
  padding: 1rem;
  text-align: center;
}
</style>
