<template>
  <div class="map" id="map"></div>
</template>

<script>
// import proj4 from 'proj4';
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  mounted () {
    this.initMap()
  },
  methods: {
    initMap () {
      // var url = 'https://osm2vectortiles-0.tileserver.com/v2/{z}/{x}/{y}.pbf';
      var oUrl = 'http://172.16.108.201:8099/api/v1/tiles/11/{z}/{x}/{y}.pbf';
      // var url =
      // 'http://172.16.108.103:10000/geoc/api/v1/tileset/11001000001/11001000031/{z}/{x}/{y}.pbf';

      var oUrl = 'http://172.16.108.201:8099/api/v1/tiles/11/{z}/{x}/{y}.pbf';
      proj4.defs('EPSG:4490', '+proj=longlat +ellps=GRS80 +no_defs')
      var projection = new ol.proj.get('EPSG:4490')
      projection.setExtent([-180, -90, 180, 90])

      var layers = new ol.layer.VectorTile({
        source: new ol.source.VectorTile({
          origin: [0, 0],
          tilesize: [256, 256],
          format: new ol.format.MVT(),
          tileGrid: ol.tilegrid.createXYZ({
            extent: [-180, -90, 180, 90],
            maxZoom: 10
          }),
          tilePixelRatio: 1,
          tileUrlFunction: function (tileCoord) {
            return (
              'http://172.16.108.201:8099/api/v1/tiles/22/' +
              (tileCoord[0] - 1) +
              '/' +
              tileCoord[1] +
              '/' +
              (-1 - tileCoord[2]) +
              '.pbf'
            )
          }
        }),
        projection: projection
      })

      var map = new ol.Map({
        target: 'map',
        view: new ol.View({
          zoom: 3,
          center: [116.43, 38.01],
          projection: projection
        })
      })
      map.addLayer(layers)

      // var map = new ol.Map({
      //   interactions: ol.interaction
      //     .defaults()
      //     .extend([new ol.interaction.DragRotateAndZoom()]),
      //   layers: [
      //     new ol.layer.VectorTile({
      //       declutter: true,
      //       source: new ol.source.VectorTile({
      //         attributions:
      //           '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> ' +
      //           '© <a href="https://www.openstreetmap.org/copyright">' +
      //           'OpenStreetMap contributors</a>',
      //         format: new ol.format.MVT(),
      //         url: 'http://172.16.108.201:8099/api/v1/tiles/11/{z}/{x}/{y}.pbf'
      //         // tileUrlFunction: tileUrlFunction
      //       }),
      //       style: createMapboxStreetsV6Style(
      //         ol.style.Style,
      //         ol.style.Fill,
      //         ol.style.Stroke,
      //         ol.style.Icon,
      //         ol.style.Text
      //       )
      //     })
      //   ],
      //   target: 'map',
      //   view: new ol.View({
      //     center: [0, 0],
      //     zoom: 2
      //   })
      // })

      // var riverLayer = new ol.layer.Tile({
      //   source: new ol.source.XYZ({
      //     projection: 'EPSG:4326',
      //     maxZoom: 17,
      //     minZoom: 7,
      //     tileUrlFunction: function (tileCoord) {
      //       var oo = '00000000';
      //       var zz = tileCoord[0]
      //       var z = 'L' + zz
      //       var xx = tileCoord[1].toString(16)
      //       var x = 'C' + oo.substring(0, 8 - xx.length) + xx
      //       var yy = (-tileCoord[2] - 1).toString(16) //注意此处，计算方式变了
      //       var y = 'R' + oo.substring(0, 8 - yy.length) + yy
      //       return (
      //         'http://yjqz.geo-compass.com/api/v1/tiles/23/' +
      //         z +
      //         '/' +
      //         x +
      //         '/' +
      //         y +
      //         '.pbf'
      //       )
      //     }
      //   })
      // })

      // map.addLayer(riverLayer)

      // var layer = new ol.layer.Vector({
      //   source: new ol.source.Vector(),
      //   style: new ol.style.Style({
      //     image: new ol.style.Circle({
      //       radius: 10,
      //       fill: new ol.style.Fill({
      //         color: 'red'
      //       })
      //     })
      //   })
      // })
      // var map = new ol.Map({
      //   layers: [
      //     new ol.layer.Tile({
      //       source: new ol.source.OSM()
      //     }),
      //     layer
      //   ],
      //   target: 'map',
      //   view: new ol.View({
      //     center: ol.proj.transform([104, 30], 'EPSG:4326', 'EPSG:3857'), // 转换坐标
      //     zoom: 10
      //   })
      // })

      // // 在地图上添加一个圆
      // var circle = new ol.Feature({
      //   geometry: new ol.geom.Point(
      //     ol.proj.transform([104, 30], 'EPSG:4326', 'EPSG:3857')
      //   )
      // })
      // layer.getSource().addFeature(circle)

      // // 添加一个用于选择Feature的交互方式
      // map.addInteraction(
      //   new ol.interaction.Select({
      //     condition: ol.events.condition.singleClick, // 唯一的不同之处，设置鼠标移到feature上就选取
      //     style: new ol.style.Style({
      //       image: new ol.style.Circle({
      //         radius: 10,
      //         fill: new ol.style.Fill({
      //           color: 'blue'
      //         })
      //       })
      //     })
      //   })
      // )

      // Calculation of resolutions that match zoom levels 1, 3, 5, 7, 9, 11, 13, 15.
      // var resolutions = []
      // for (var i = 0; i <= 8; ++i) {
      //   resolutions.push(156543.03392804097 / Math.pow(2, i * 2))
      // }
      // var origin = [-2.00377e7, 3.02411e7]
      // // Calculation of tile urls for zoom levels 1, 3, 5, 7, 9, 11, 13, 15.
      // function tileUrlFunction (tileCoord) {
      //   return (
      //     'http://http://yjqz.geo-compass.com/api/v1/tiles/23/' +
      //     '{z}/{x}/{y}.pbf'
      //   )
      //     .replace('{z}', String(tileCoord[0] * 2 - 1))
      //     .replace('{x}', String(tileCoord[1]))
      //     .replace('{y}', String(-tileCoord[2] - 1))
      //     .replace(
      //       '{a-d}',
      //       'abcd'.substr(
      //         ((tileCoord[1] << tileCoord[0]) + tileCoord[2]) % 4,
      //         1
      //       )
      //     )
      // }

      // var map = new ol.Map({
      //   layers: [
      //     new ol.layer.VectorTile({
      //       source: new ol.source.VectorTile({
      //         format: new ol.format.MVT(),
      //         tileGrid: new ol.tilegrid.TileGrid({
      //           resolutions: resolutions,
      //           origin: origin,
      //           tileSize: 256
      //         }),
      //         tileUrlFunction: tileUrlFunction
      //       })
      //       // style: createMapboxStreetsV6Style(Style, Fill, Stroke, Icon, Text)
      //     })
      //   ],
      //   target: 'map',
      //   view: new ol.View({
      //     center: [0, 0],
      //     minZoom: 1,
      //     zoom: 2
      //   })
      // })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.map {
  width: 100%;
  height: 100%;
}
</style>
