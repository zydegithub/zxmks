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
// import applyStyle from 'ol-mapbox-style';

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
      // var topResolution = 360.0 / 512;
      // var resolutions = [];
      // for (var zoom = 0; zoom < 9; zoom++) {
      //   resolutions.push(topResolution / Math.pow(2, zoom));
      // }
      // var map = new Map({
      //   target: 'map',
      //   view: new View({
      //     zoom: 4,
      //     // center: [106.43, 36.01],
      //     projection: 'EPSG:3857',
      //     resolutions: resolutions
      //   })
      // });
      // olms("map", "http://172.16.108.201:8099/api/v1/styles/1");
      // window.map = map;
      // let geovt = new VectorTileLayer({
      //   source: new VectorTileSource({
      //     format: new MVT(),
      //     tileGrid: createXYZ({
      //       extent: [-180, -90, 180, 90],
      //       tileSize: 256,
      //       maxZoom: 22
      //     }),
      //     tilePixelRatio: 1,
      //     tileUrlFunction: function(tileCoord) {
      //       return (
      //         'http://vtctest.geo-compass.com/geocmap/api/v1/tileset/1/10001000230/' +
      //         (tileCoord[0] - 1) +
      //         '/' +
      //         tileCoord[1] +
      //         '/' +
      //         (-1 - tileCoord[2]) +
      //         '.pbf'
      //       );
      //     }
      //   })
      // });
      // let pbfstyle =
      //   'http://vtctest.geo-compass.com/geocmap/api/v1/map/10001000189/publish';

      // this.$axios.get(pbfstyle).then(res => {
      //   console.log(res);
      //   applyStyle(
      //     geovt,
      //     res.data,
      //     '10001000230',
      //     undefined,
      //     geovt
      //       .getSource()
      //       .getTileGrid()
      //       .getResolutions()
      //   ).then(res => {
      //     console.log(res);
      //     map.addLayer(geovt);
      //   });
      // });
      // var key =
      // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMSIsImlhdCI6MTU3NzA3ODAwNiwiZXhwIjoxNTc3NjgyODA2fQ.wYSzUnl5T7_u0Xb3bZW5wCxSSkNaiiofP1-TT5B09uY";

      // var maxResolution = 360 / 512;
      // defaultResolutions.length = 14;
      // for (var i = 0; i < 14; ++i) {
      //   defaultResolutions[i] = maxResolution / Math.pow(2, i + 1);
      // }

      // olms('map', 'http://172.16.108.201:8099/api/v1/styles/9').then(function(
      //   map
      // ) {
      //   // Custom tile grid for the EPSG:4326 projection
      //   var tileGrid = new TileGrid({
      //     extent: [-180, -90, 180, 90],
      //     tileSize: 512,
      //     resolutions: defaultResolutions
      //   });
      //   debugger;
      //   var mapboxStyle = map.get('mapbox-style');

      //   // Replace the source with a EPSG:4326 projection source for each vector tile layer
      //   map.getLayers().forEach(function(layer) {
      //     var mapboxSource = layer.get('mapbox-source');
      //     if (
      //       mapboxSource &&
      //       mapboxStyle.sources[mapboxSource].type === 'vector'
      //     ) {
      //       var source = layer.getSource();
      //       layer.setSource(
      //         new VectorTileSource({
      //           format: new MVT(),
      //           projection: 'EPSG:4326',
      //           urls: source.getUrls(),
      //           tileGrid: tileGrid
      //         })
      //       );
      //     }
      //   });
      //   window.map = map;
      //   // Configure the map with a view with EPSG:4326 projection
      //   map.setView(
      //     new View({
      //       projection: 'EPSG:4326',
      //       zoom: mapboxStyle.zoom,
      //       center: mapboxStyle.center
      //     })
      //   );
      // });

      // var layers = [
      //   // new TileLayer({
      //   //     source: new TileWMS({
      //   //         url: 'https://ahocevar.com/geoserver/wms',
      //   //         params: {
      //   //             'LAYERS': 'ne:NE1_HR_LC_SR_W_DR',
      //   //             'TILED': true
      //   //         }
      //   //     })
      //   // }),
      //   new TileLayer({
      //     source: new XYZ({
      //       url:
      //         'http://t1.tianditu.com/DataServer?T=img_c&x={x}&y={y}&l={z}&tk=b8b36f528ccc550525c7cada64303bc4',
      //       projection: 'EPSG:4326'
      //     })
      //   })
      //   // new TileLayer({
      //   //   source: new XYZ({
      //   //     url:
      //   //       'http://t1.tianditu.com/DataServer?T=cva_c&x={x}&y={y}&l={z}&tk=b8b36f528ccc550525c7cada64303bc4',
      //   //     projection: 'EPSG:4326'
      //   //   })
      //   // })
      // ];

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
        // layers: layers,
        target: 'map',
        view: new View({
          projection: 'EPSG:4326',
          center: [0, 0],
          zoom: 2
        })
      });
      var layer = new VectorTileLayer({
        source: new VectorTileSource({
          format: new MVT(),
          // format: new MVT(),
          // url: 'http://vtctest.geo-compass.com/api/v1/tileset/1/10001000097/{z}/{x}/{y}.pbf',
          url:
            'http://vttest.geo-compass.com/geocmap/api/v1/tileset/1/10001000200/{z}/{x}/{y}.pbf',
          projection: 'EPSG:4326'
        })
      });
      map.addLayer(layer);
      axios
        .get(
          'http://vtctest.geo-compass.com/geocmap/api/v1/map/10001000175/publish'
        )
        .then(function(response) {
          applyStyle(
            layer,
            response.data,
            ['1'],
            undefined,
            layer
              .getSource()
              .getTileGrid()
              .getResolutions()
          ).then(res => {});
        });
      // olms(map, 'http://vtctest.geo-compass.com/api/v1/map/10001000034/publish?access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMSIsImlhdCI6MTU0ODg5NTc0NiwiZXhwIjoxNTQ5NTAwNTQ2fQ.6ayfWhSA6rqtvfYP3Qrx2aIPS1LUtMy8PIB1JLJCp9g');
      map.on('singleclick', function(e) {
        alert(e.coordinate);
      });

      // var map = new Map({
      //   controls: defaultControls().extend([
      //     new ScaleLine({
      //       units: 'degrees'
      //     })
      //   ]),
      //   layers: layers,
      //   target: 'map',
      //   view: new View({
      //     projection: 'EPSG:4326',
      //     center: [0, 0],
      //     zoom: 2
      //   })
      // });
      // var layer = new VectorTileLayer({
      //   source: new VectorTileSource({
      //     format: new MVT(),
      //     // format: new MVT(),
      //     url:
      //       'http://vtctest.geo-compass.com/api/v1/map/10001000041/publish?access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMSIsImlhdCI6MTU0ODgyODQ5NCwiZXhwIjoxNTQ5NDMzMjk0fQ.WQrPQ6CfcY0Cs_e9GQXsg6AVr-Z4KbIoTEgaNdAj7LY'
      //   })
      // });

      // map.on('singleclick', function(e) {
      //   alert(e.coordinate);
      // });
      // apply(
      //   map,
      //   'http://172.16.108.201:8099/api/v1/styles/1?access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMSIsImlhdCI6MTU1MDI3NzMwMywiZXhwIjoxNTUwODgyMTAzfQ.4543cpUz4gKBO8cQamfdCk9qCTkW8V12ruwM74EGWvU'
      // );
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
