import Vue from 'vue';
import Router from 'vue-router';
import olStyle from '@/components/olStyle';
// import projection from '@/components/projection';
// import tree from '@/components/tree'
// import treeText from '@/components/treeText'
// import layer from '@/components/layer'
// import deleteTree from '@/components/deleteTree'
// import nextTick from '@/components/nextTick';
// import filp from '@/components/filp';
// import flag from '@/components/flag';
// import echarts from '@/components/echarts';
// import list from '@/components/list';
// import mainMap from '@/components/mainMap';

Vue.use(Router);

export default new Router({
  routes: [{
    path: '/',
    name: 'nextTick',
    component: olStyle
  }]
});
