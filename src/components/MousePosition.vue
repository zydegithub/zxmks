<template>
  <div class="wrapper">
    <div id="locInfo">
      <!-- <span>坐标系：{{ lacationInfo.epsg }}</span> -->
      <!-- <span>比例尺：1:{{ lacationInfo.scale | NumFormat }}</span> -->
      <span>级别：{{ lacationInfo.zoom }}</span>
      <span>{{ lacationInfo.lng }}</span>
      <span>{{ lacationInfo.lat }}</span>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      lacationInfo: {
        lng: '0.0000',
        lat: '0.0000',
        zoom: '0.00',
        epsg: '经纬度',
        scale: ''
      }
    };
  },
  props: {
    map: Object
  },
  mounted() {
    this.map.on('mousemove', this.mouseMove);
    this.map.on('zoomend', this.zoomEnd);
  },
  methods: {
    mouseMove(e) {
      if (e.lngLat.lng.toFixed(4) > 0) {
        this.lacationInfo.lng = '东经:' + e.lngLat.lng.toFixed(4);
      } else {
        this.lacationInfo.lng = '西经:' + Math.abs(e.lngLat.lng.toFixed(4));
      }
      if (e.lngLat.lat.toFixed(4) > 0) {
        this.lacationInfo.lat = '北纬:' + e.lngLat.lat.toFixed(4);
      } else {
        this.lacationInfo.lat = '南纬:' + Math.abs(e.lngLat.lat.toFixed(4));
      }
    },
    zoomEnd(e) {
      this.lacationInfo.zoom = e.target.getZoom().toFixed(2);
      // this.lacationInfo.scale = this.$util.commonUtil.calculateScale(
      //   this.map,
      //   96
      // );
    }
  }
};
</script>

<style scoped>
.wrapper {
  text-shadow: none;
  height: 20px;
  background: rgba(255, 255, 255, 0.4);
  position: absolute;
  bottom: 0;
  width: 100%;
  font-size: 14px;
}

#locInfo {
  position: absolute;
  bottom: 0;
  right: 5px;
  color: #000;
}

#locInfo span {
  margin-right: 5px;
}
</style>
