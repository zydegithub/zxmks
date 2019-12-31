<template>
  <div class="map" id="map"></div>
</template>

<script>
// import olms from 'ol-mapbox-style';
// import { defaultResolutions } from 'ol-mapbox-style/util';
// import 'ol/ol.css';
// import { Map, View } from 'ol';
// import VectorTileLayer from 'ol/layer/VectorTile';
// import VectorTileSource from 'ol/source/VectorTile';
// import MVT from 'ol/format/MVT';
// import { createXYZ } from 'ol/tilegrid';
// import TileGrid from 'ol/tilegrid/TileGrid';
import axios from 'axios';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import MVT from 'ol/format/MVT.js';
import VectorTileLayer from 'ol/layer/VectorTile.js';
import VectorTileSource from 'ol/source/VectorTile.js';
import { get as getProjection } from 'ol/proj.js';
import { createXYZ } from 'ol/tilegrid.js';
import Projection from 'ol/proj/Projection.js';
import applyStyle from 'ol-mapbox-style';

import stylefunction from 'ol-mapbox-style/stylefunction';
import { defaults as defaultControls, ScaleLine } from 'ol/control.js';
import TileLayer from 'ol/layer/Tile.js';
import TileWMS from 'ol/source/TileWMS.js';
import XYZ from 'ol/source/XYZ.js';
export default {
  name: 'HelloWorld',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App'
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      var layers = [
        new TileLayer({
          source: new TileWMS({
            url: 'https://ahocevar.com/geoserver/wms',
            params: {
              LAYERS: 'ne:NE1_HR_LC_SR_W_DR',
              TILED: true
            }
          })
        }),
        new TileLayer({
          source: new XYZ({
            url:
              'http://t1.tianditu.com/DataServer?T=cva_c&x={x}&y={y}&l={z}&tk=b8b36f528ccc550525c7cada64303bc4',
            projection: 'EPSG:4326'
          })
        })
      ];

      var map = new Map({
        controls: defaultControls().extend([
          new ScaleLine({
            units: 'degrees'
          })
        ]),
        layers: layers,
        target: 'map',
        view: new View({
          projection: 'EPSG:4326',
          center: [0, 0],
          zoom: 2
        })
      });
      var layer = new VectorTileLayer({
        source: new VectorTileSource({
          origin: [0, 0],
          tilesize: 256,
          format: new MVT(),
          tileGrid: createXYZ({
            extent: [-180, -90, 180, 90],
            maxZoom: 10
          }),
          tilePixelRatio: 1,
          tileUrlFunction: function(tileCoord) {
            return (
              'http://vtctest.geo-compass.com/geocmap/api/v1/tileset/1/10001000230/' +
              (tileCoord[0] - 1) +
              '/' +
              tileCoord[1] +
              '/' +
              (-1 - tileCoord[2]) +
              '.pbf'
            );
          }
        })
      });
      map.addLayer(layer);
      debugger;
      layer
        .getSource()
        .getTileGrid()
        .getResolutions();
      axios
        .get(
          'http://vtctest.geo-compass.com/geocmap/api/v1/map/10001000189/publish'
        )
        .then(function(response) {
          debugger;
          applyStyle(
            layer,
            response.data,
            ['0'],
            undefined,
            layer
              .getSource()
              .getTileGrid()
              .getResolutions()
          ).then(res => {
            debugger;
          });
        });
      // olms(map, 'http://vtctest.geo-compass.com/api/v1/map/10001000034/publish?access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMSIsImlhdCI6MTU0ODg5NTc0NiwiZXhwIjoxNTQ5NTAwNTQ2fQ.6ayfWhSA6rqtvfYP3Qrx2aIPS1LUtMy8PIB1JLJCp9g');
      map.on('singleclick', function(e) {
        alert(e.coordinate);
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.map {
  width: 100%;
  height: 100%;
}
</style>
