<template>
  <div id="mainMap">
    <div id="map"></div>
    <MousePostion v-if="mapbuild" :map="map"></MousePostion>
    <div id="leftAside" v-if="showAside">
      <div>
        <span class="titleSpan">{{ name }}</span>
        <span class="spanStyle">搜周边</span>
        <el-button
          class="buttonStyle"
          v-for="item in poiLayers"
          :key="item"
          @click="searchPoi(item)"
        >{{item}}</el-button>
      </div>
      <div class="homeItem2">
        <span class="spanStyle">美图</span>
        <swiperPort></swiperPort>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import MousePostion from "./MousePosition";
import swiperPort from "./swiperPort";
export default {
  data() {
    return {
      mapbuild: false,
      map: null,
      showAside: false,
      btnType: "",
      name: "",
      poiLayers: [
        "停车场",
        "加油站",
        "娱乐场所",
        "旅馆酒店",
        "购物",
        "银行",
        "餐饮"
      ],
      markerArr: []
    };
  },
  mounted() {
    this.initMap();
  },
  watch: {
    btnType: {
      handler: function(val, old) {
        var that = this;
        this.map.on("mouseenter", val, function(e) {
          that.map.getCanvas().style.cursor = "pointer";
          var coordinates = e.features[0].geometry.coordinates.slice();
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }
          that.popup
            .setLngLat(coordinates)
            .setHTML("<p>" + e.features[0].properties.name + "</p>")
            .addTo(that.map);
          console.log(e.features[0]);
        });
      },
      deep: true
    }
  },
  components: {
    MousePostion,
    swiperPort
  },
  computed: {
    popup: function() {
      return new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
      });
    }
  },
  methods: {
    ...mapActions(["getAsideBar"]),
    initMap() {
      if (!mapboxgl.supported()) {
        this.$Message.warning({
          content: "您的浏览器不支持WebGL,请升级到最新版本。",
          duration: 0
        });
        return;
      }
      this.map = new mapboxgl.Map({
        container: "map",
        style: "http://yjqz.geo-compass.com/api/v1/styles/5",
        center: [116.3941, 39.9006],
        zoom: 10,
        epsg: "EPSG:4490",
        preserveDrawingBuffer: true
      });
      debugger;
      var that = this;
      this.map.on("load", async () => {
        this.mapbuild = true;
        CONFIG.geojson.features.forEach(function(marker) {
          // create a DOM element for the marker
          var el = document.createElement("div");
          el.className = "marker";
          el.style.backgroundImage =
            "url(./static/lib/" + marker.properties.message + ".jpg)";
          el.style.width = marker.properties.iconSize[0] + "px";
          el.style.height = marker.properties.iconSize[1] + "px";
          el.style.backgroundRepeat = "round";
          el.addEventListener("click", function() {
            that.map.flyTo({
              center: marker.geometry.coordinates,
              zoom: 15,
              essential: true
            });
            that.name = marker.properties.message;
            that.showAside = true;
          });
          // add marker to map
          new mapboxgl.Marker(el)
            .setLngLat(marker.geometry.coordinates)
            .addTo(that.map);
        });
        that.$axios.get(CONFIG.poiUrl).then(res => {
          var sources = res.data.sources;
          var layers = res.data.layers;
          for (var sourceId in sources) {
            if (!that.map.getSource(sourceId)) {
              that.map.addSource(sourceId, sources[sourceId]);
            }
          }
          layers.forEach(item => {
            item.id = that.poiLayers[item.id];
            that.map.addLayer(item);
          });
        });
        setTimeout(() => {
          this.closeAllPOI();
        }, 1000);
      });
      this.map.on("zoomend", this.isShowVecLeng);
      this.map.on("moveend", this.isShowVecLeng);
      this.map.on("mouseleave", that.btnType, function() {
        that.map.getCanvas().style.cursor = "";
        that.popup.remove();
      });
      this.measureControl = new MeasureControl({
        isDistance: true,
        isArea: true,
        map: this.map
      });
      window.map = this.map;
    },
    searchPoi(item) {
      if (this.btnType == item) {
        this.btnType = "";
        this.closeAllPOI();
        if (this.markerArr.length > 0) {
          for (let i = 0; i < this.markerArr.length; i++) {
            this.markerArr[i].remove();
          }
          this.markerArr = [];
        }
        return;
      }
      this.btnType = item;
      this.closeAllPOI();
      if (this.markerArr.length > 0) {
        for (let i = 0; i < this.markerArr.length; i++) {
          this.markerArr[i].remove();
        }
        this.markerArr = [];
      }
      this.map.setLayoutProperty(item, "visibility", "visible");
      var that = this;
      setTimeout(() => {
        var features = this.map.queryRenderedFeatures({ layers: [item] });
        if (features.length != 0) {
          features.forEach(function(marker) {
            var mark = new mapboxgl.Marker()
              .setLngLat(marker.geometry.coordinates)
              .addTo(that.map);
            that.markerArr.push(mark);
          });
        }
      }, 1000);
    },
    closeAllPOI() {
      this.poiLayers.forEach(item => {
        this.map.setLayoutProperty(item, "visibility", "none");
      });
    },
    isShowVecLeng() {
      if (this.btnType != "") {
        var features = this.map.queryRenderedFeatures({
          layers: [this.btnType]
        });
        var that = this;
        if (features.length != 0) {
          features.forEach(function(marker) {
            new mapboxgl.Marker()
              .setLngLat(marker.geometry.coordinates)
              .addTo(that.map);
          });
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#mainMap {
  width: 100%;
  height: 100%;
}
#map {
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
}
#leftAside {
  position: absolute;
  top: 0px;
  bottom: 0px;
  right: 0px;
  width: 400px;
  background-color: rgba(61, 71, 128, 0.3);
}
.homeItem2 {
}
.titleSpan {
  font-size: 20px;
  color: #000;
  margin-left: 20px;
  display: block;
  margin-top: 6px;
}
.spanStyle {
  font-size: 16px;
  color: #000;
  margin-left: 20px;
  display: block;
  margin-top: 6px;
}
.buttonStyle {
  margin-right: 10px;
  margin-top: 10px;
}
</style>
