<template>
  <div>
    <button @click="cli">点击</button>
    <div v-show="noData" id="myChart"></div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
export default {
  name: 'HelloWorld',
  data() {
    return {
      noData: false
    };
  },
  created() {
    this.getAsideBar();
  },
  mounted() {},
  computed: {
    ...mapGetters({
      asideBarData: 'GET_ASIDEBAR'
    })
  },
  methods: {
    ...mapActions(['getAsideBar']),
    cli() {
      if (this.noData == false) {
        this.noData = !this.noData;
        this.$nextTick(() => {
          this.drawLine();
        });
      } else {
        this.noData = !this.noData;
      }
    },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('myChart'));
      myChart.setOption(this.asideBarData);
    }
  }
};
</script>
<style scoped>
#myChart {
  width: 200px;
  height: 200px;
}
</style>
