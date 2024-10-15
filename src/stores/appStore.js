import { createStore } from 'vuex';

const savedUserType = localStorage.getItem('userType') || 'guest';
const savedUserName = localStorage.getItem('userName') || '';

const store = createStore({
  state: {
    userType: savedUserType,
    userName: savedUserName
  },
  mutations: {
    setUser(state, { userType, userName }) {
      state.userType = userType;
      state.userName = userName;
      localStorage.setItem('userType', userType);
      localStorage.setItem('userName', userName); // 保存到 localStorage
    },
    logout(state) {
      state.userType = 'guest';
      state.userName = '';
      localStorage.removeItem('userType'); // 從 localStorage 中移除
      localStorage.removeItem('userName'); // 從 localStorage 中移除
    }
  },
  actions: {
    setUser({ commit }, user) {
      commit('setUser', user);
    },
    logout({ commit }) {
      commit('logout');
    }
  }
});

export default store;
