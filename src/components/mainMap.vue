<template>
  <div id="mainMap">
    <div id="map"></div>
    <div id="topDiv"></div>
    <MousePostion v-if="mapbuild" :map="map"></MousePostion>
    <div id="searchDiv">
      <el-input
        placeholder="请输入内容"
        v-model="input"
        class="input-with-select"
        @focus="focuInput"
        v-on:keyup.enter="searchPlace"
      >
        <el-button slot="append" icon="el-icon-search" @click="searchPlace"></el-button>
      </el-input>
    </div>
    <div id="listDiv" v-show="listShow">
      <ul>
        <li v-for="(data, idx) in list" :key="idx" @click="fitPlace(data, idx)">
          <el-divider></el-divider>
          <div class="listLeft">
            <p>{{data.id}}.{{idx}}</p>
            <span v-if="data.price">门票 ¥{{data.price}}</span>
            <span v-if="data.grade">{{data.grade}}</span>
            <p>{{data.address}}</p>
          </div>
          <img class="img" :src="'static/lib/images/课设素材照片/'+idx+'/'+data.photo+'.jpg'" />
        </li>
      </ul>
    </div>
    <div id="containDiv" v-if="containShow">
      <div class="backBtn" @click="goBack">« 返回</div>
      <swiperPort :name="name"></swiperPort>
      <p class="nameP">{{name}}</p>
      <span class="priceSpan" v-if="list[name].price">门票 ¥{{list[name].price}}/人</span>
      <span class="priceSpan" v-if="list[name].grade">{{list[name].grade}}</span>
      <br />
      <i class="el-icon-location"></i>
      <span class="addressSpan" v-if="list[name].address">{{list[name].address}}</span>
      <el-button class="searchBtn" type="text" @click="dialogVisible = true">搜周边</el-button>
      <el-divider></el-divider>
      <span class="spanStyle">简介</span>
      <div class="homeItem1">
        <span class="spanStyle2">{{ text[name] }}</span>
      </div>
    </div>
    <el-dialog title="搜周边" :visible.sync="dialogVisible" width="24%">
      <el-button
        class="buttonStyle"
        v-for="item in poiLayers"
        :key="item"
        @click="searchPoi(item)"
      >{{item}}</el-button>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import MousePostion from './MousePosition';
import swiperPort from './swiperPort';
export default {
  data() {
    return {
      mapbuild: false,
      map: null,
      input: '',
      btnType: '',
      name: '',
      poiLayers: [
        '停车场',
        '加油站',
        '娱乐场所',
        '旅馆酒店',
        '购物',
        '银行',
        '餐饮'
      ],
      markerArr: [],
      listShow: false,
      containShow: false,
      dialogVisible: false
    };
  },
  mounted() {
    this.initMap();
  },
  watch: {
    btnType: {
      handler: function(val, old) {
        var that = this;
        this.map.on('mouseenter', val, function(e) {
          that.map.getCanvas().style.cursor = 'pointer';
          var coordinates = e.features[0].geometry.coordinates.slice();
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }
          that.popup
            .setLngLat(coordinates)
            .setHTML('<p>' + e.features[0].properties.name + '</p>')
            .addTo(that.map);
          console.log(e.features[0]);
        });
      },
      deep: true
    },
    name: {
      handler: function(val, old) {
        console.log(CONFIG.text[this.name]);
      }
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
    },
    text: function() {
      return CONFIG.text;
    },
    list: function() {
      return CONFIG.listPoi;
    }
  },
  methods: {
    ...mapActions(['getAsideBar']),
    initMap() {
      if (!mapboxgl.supported()) {
        this.$Message.warning({
          content: '您的浏览器不支持WebGL,请升级到最新版本。',
          duration: 0
        });
        return;
      }
      this.map = new mapboxgl.Map({
        container: 'map',
        style: 'http://yjqz.geo-compass.com/api/v1/styles/5',
        center: [116.3941, 39.9006],
        zoom: 10,
        epsg: 'EPSG:4490',
        preserveDrawingBuffer: true
      });
      var that = this;
      this.map.on('load', async() => {
        this.mapbuild = true;
        CONFIG.geojson.features.forEach(function(marker) {
          // create a DOM element for the marker
          var el = document.createElement('div');
          el.className = 'marker';
          el.style.backgroundImage =
            'url(./static/lib/' + marker.properties.message + '.jpg)';
          el.style.width = marker.properties.iconSize[0] + 'px';
          el.style.height = marker.properties.iconSize[1] + 'px';
          el.style.backgroundRepeat = 'round';
          el.addEventListener('click', function() {
            that.map.flyTo({
              center: marker.geometry.coordinates,
              zoom: 15,
              essential: true
            });
            that.name = marker.properties.message;
            that.containShow = true;
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
      this.map.on('zoomend', this.isShowVecLeng);
      this.map.on('moveend', this.isShowVecLeng);
      this.map.on('mouseleave', that.btnType, function() {
        that.map.getCanvas().style.cursor = '';
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
      this.dialogVisible = false;
      if (this.btnType == item) {
        this.btnType = '';
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
      this.map.setLayoutProperty(item, 'visibility', 'visible');
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
        this.map.setLayoutProperty(item, 'visibility', 'none');
      });
    },
    isShowVecLeng() {
      if (this.btnType != '') {
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
    },
    focuInput() {
      this.listShow = true;
    },
    fitPlace(data) {
      this.map.flyTo({
        center: CONFIG.geojson.features[data.id - 1].geometry.coordinates,
        zoom: 15,
        essential: true
      });
      this.name = CONFIG.geojson.features[data.id - 1].properties.message;
      this.listShow = false;
      this.containShow = true;
    },
    searchPlace() {
      var id = this.list[this.input].id;
      this.map.flyTo({
        center: CONFIG.geojson.features[id - 1].geometry.coordinates,
        zoom: 15,
        essential: true
      });
      this.name = CONFIG.geojson.features[id - 1].properties.message;
      this.listShow = false;
      this.containShow = true;
    },
    goBack() {
      this.listShow = true;
      this.containShow = false;
    }
  }
};
</script>
<style  scoped>
#mainMap {
  width: 100%;
  height: 100%;
}
#topDiv {
  position: absolute;
  top: 0px;
  height: 70px;
  width: 100%;
  background-color: #2196f3;
  box-shadow: 4px 4px 5px #888888;
}
#map {
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
}
#searchDiv {
  position: absolute;
  top: 80px;
  left: 30px;
  width: 400px;
  box-shadow: 4px 4px 5px #888888;
}
#listDiv,
#containDiv {
  position: absolute;
  top: 120px;
  left: 30px;
  height: 660px;
  width: 400px;
  background-color: #fff;
  box-shadow: 4px 4px 5px #888888;
  overflow-y: auto;
  text-align: right;
}
#containDiv {
  text-align: left;
}
.nameP {
  margin-left: 20px;
  font-size: 18px;
  font-family: inherit;
}
.priceSpan {
  margin-top: 6px;
  margin-left: 20px;
  font-size: 14px;
}
.addressSpan {
  font-size: 14px;
}
.el-icon-location {
  margin-top: 6px;
  margin-left: 20px;
}
.el-select .el-input {
  width: 130px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.homeItem1 {
  height: 46%;
  overflow-y: auto;
}
.spanStyle {
  font-size: 16px;
  color: #000;
  margin-left: 20px;
  display: block;
  margin-top: 6px;
  font-family: inherit;
}
.spanStyle2 {
  font-size: 14px;
  color: #000;
  margin-left: 20px;
  display: block;
  margin-top: 6px;
  text-indent: 30px;
}
.buttonStyle {
  margin-right: 10px;
  margin-top: 10px;
}
#listDiv::-webkit-scrollbar {
  width: 6px;
  height: 10px;
}
#listDiv::-webkit-scrollbar-thumb {
  background-color: #b8b8b8;
  /* -webkit-border-radius: 6px; */
  outline: 2px solid #fff;
  outline-offset: -2px;
  /* border: 2px solid #fff; */
  //   filter: alpha(opacity = 50);
  -moz-opacity: 0.5;
  -khtml-opacity: 0.5;
  opacity: 0.5;
}
#listDiv::-webkit-scrollbar-thumb:hover {
  background-color: #878987;
  /* -webkit-border-radius: 6px; */
}
.homeItem1::-webkit-scrollbar {
  width: 6px;
  height: 10px;
}
.homeItem1::-webkit-scrollbar-thumb {
  background-color: #b8b8b8;
  /* -webkit-border-radius: 6px; */
  outline: 2px solid #fff;
  outline-offset: -2px;
  /* border: 2px solid #fff; */
  //   filter: alpha(opacity = 50);
  -moz-opacity: 0.5;
  -khtml-opacity: 0.5;
  opacity: 0.5;
}
.homeItem1::-webkit-scrollbar-thumb:hover {
  background-color: #878987;
  /* -webkit-border-radius: 6px; */
}
ul {
  padding: 0;
  margin: 0;
  list-style: none;
  clear: both;
}
li {
  display: list-item;
  cursor: pointer;
  margin-left: 16px;
  margin-right: 16px;
  margin-top: 14px;
  text-align: -webkit-match-parent;
}
li:hover .listLeft span {
  color: #2196f3;
}
li:hover .listLeft p {
  color: #2196f3;
}
.img {
  width: 100px;
  height: 80px;
  position: relative;
  top: 4px;
  right: 4px;
}
.el-divider--horizontal {
  margin: 12px 0px;
}
.listLeft {
  margin-top: 4px;
  text-align: left;
  float: left;
  font-size: 14px;
  max-width: 250px;
}
.searchBtn {
  float: right;
}
.backBtn {
  position: absolute;
  background-color: #878987;
  width: 50px;
  height: 22px;
  left: 20px;
  top: 20px;
  text-align: center;
  z-index: 2;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
}
</style>
