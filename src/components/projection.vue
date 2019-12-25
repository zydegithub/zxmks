<template>
  <div>
    <div id="map" class="map"></div>
    <form class="form-inline">
      <label for="epsg-query">Search projection:</label>
      <el-input
        v-model="epsgInput"
        placeholder="4326, 27700, US National Atlas, Swiss, France, ..."
        size="mini"
        style="width:100px"
      ></el-input>
      <el-button id="epsg-search" class="btn" @click="searchButton">Search</el-button>
      <span id="epsg-result">{{ epsgResult }}</span>
    </form>
  </div>
</template>

<script>
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import { applyTransform } from 'ol/extent';
import TileLayer from 'ol/layer/Tile';
import { defaults as defaultControls } from 'ol/control';
import MousePosition from 'ol/control/MousePosition';
import { createStringXY } from 'ol/coordinate';
import { get as getProjection, getTransform } from 'ol/proj';
import { register } from 'ol/proj/proj4';
import OSM from 'ol/source/OSM';
import TileImage from 'ol/source/TileImage';
import proj4 from 'proj4';
export default {
  name: 'HelloWorld',
  data() {
    return {
      mousePositionControl: null,
      epsgInput: '',
      epsgResult: '',
      map: null,
      renderEdgesCheckbox: ''
    };
  },
  mounted() {
    this.initMap();
  },
  watch: {},
  methods: {
    initMap() {
      this.mousePositionControl = new MousePosition({
        coordinateFormat: createStringXY(4),
        projection: 'EPSG:3857',
        className: 'custom-mouse-position',
        target: document.getElementById('mouse-position'),
        undefinedHTML: '&nbsp;'
      });
      this.map = new Map({
        controls: defaultControls().extend([this.mousePositionControl]),
        layers: [
          new TileLayer({
            source: new OSM()
          })
        ],
        target: 'map',
        view: new View({
          projection: 'EPSG:3857',
          center: [0, 0],
          zoom: 1
        })
      });
    },
    search(query) {
      this.epsgResult = 'Searching ...';
      var that = this;
      fetch('https://epsg.io/?format=json&q=' + query)
        .then(function(response) {
          return response.json();
        })
        .then(function(json) {
          console.log(json);
          var results = json['results'];
          if (results && results.length > 0) {
            for (var i = 0, ii = results.length; i < ii; i++) {
              var result = results[i];
              if (result) {
                var code = result['code'];
                var name = result['name'];
                var proj4def = result['proj4'];
                var bbox = result['bbox'];
                if (
                  code &&
                  code.length > 0 &&
                  proj4def &&
                  proj4def.length > 0 &&
                  bbox &&
                  bbox.length == 4
                ) {
                  that.setProjection(code, name, proj4def, bbox);
                  return;
                }
              }
            }
          }
          this.setProjection(null, null, null, null);
        });
    },
    setProjection(code, name, proj4def, bbox) {
      if (
        code === null ||
        name === null ||
        proj4def === null ||
        bbox === null
      ) {
        this.epsgResult = 'Nothing usable found, using EPSG:3857...';
        this.map.setView(
          new View({
            projection: 'EPSG:3857',
            center: [0, 0],
            zoom: 1
          })
        );
        return;
      }
      this.epsgResult = '(' + code + ') ' + name;
      var newProjCode = 'EPSG:' + code;
      proj4.defs(newProjCode, proj4def);
      register(proj4);
      var newProj = getProjection(newProjCode);
      var fromLonLat = getTransform('EPSG:4326', newProj);

      // very approximate calculation of projection extent
      var extent = applyTransform(
        [bbox[1], bbox[2], bbox[3], bbox[0]],
        fromLonLat
      );
      newProj.setExtent(extent);
      var newView = new View({
        projection: newProj
      });
      this.map.setView(newView);
      newView.fit(extent);
    },
    searchButton() {
      this.search(this.epsgInput);
      this.mousePositionControl.setProjection(this.epsgInput);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.map {
  width: 100%;
  height: 90%;
}
</style>
