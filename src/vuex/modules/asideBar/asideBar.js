import axios from 'axios';
// import * as TYPES from './mutation-type';

// 状态集中声明
const state = {
  asideBarData: ''
};

// 获取状态
const getters = {
  GET_ASIDEBAR: state => {
    return state.asideBarData;
  }
};

// 同步的操作状态
const mutations = {
  SET_ASIDEBAR(state, data) {
    state.asideBarData = data;
  }
};

// 异步的操作状态
const actions = {
  getAsideBar(context) {
    axios.get('../../../../../static/lib/echarts.json').then(res => {
      if (res) {
        var data = res.data[0];
        context.commit('SET_ASIDEBAR', data);
      }
    });
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
