import Vue from 'vue';
import Vuex from 'vuex';
import asideBar from './modules/asideBar/asideBar.js';
Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    asideBar
  }
});
