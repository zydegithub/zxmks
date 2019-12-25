// Control implemented as ES5 prototypical class
var DomUtil = {
  hasClass: function(obj, cls) {
    return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
  },
  addClass: function(obj, cls) {
    if (!this.hasClass(obj, cls)) obj.className += ' ' + cls;
  },
  removeClass: function(obj, cls) {
    if (this.hasClass(obj, cls)) {
      var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
      obj.className = obj.className.replace(reg, ' ');
    }
  }
};
var toolBar_text = ['平移', '查看属性', '点选', '框选', '圈选', '多边形选', '缓冲区分析', '清除'];
var symbol_style = {
  fill: {
    paint: {
      'fill-color': '#00ffff',
      'fill-opacity': 0.2,
      'fill-outline-color': '#ee1433',
      'fill-antialias': true,
      'fill-translate': [0, 0],
      'fill-translate-anchor': 'map'
      // "fill-pattern": ""
    },
    layout: {
      visibility: 'visible'
    }
  },
  line: {
    paint: {
      'line-color': '#00ffff',
      'line-opacity': 1,
      'line-translate': [0, 0],
      'line-translate-anchor': 'map',
      'line-width': 2,
      'line-gap-width': 0,
      'line-offset': 0,
      'line-blur': 0,
      'line-dasharray': [1, 0]
      // "line-pattern": " "
    },
    layout: {
      visibility: 'visible',
      'line-cap': 'butt',
      'line-join': 'miter',
      'line-miter-limit': 2,
      'line-round-limit': 1.05
    }
  },
  circle: {
    paint: {
      'circle-color': '#00ffff',
      'circle-radius': 5,
      'circle-blur': 0,
      'circle-opacity': 1,
      'circle-translate': [0, 0],
      'circle-translate-anchor': 'map'
    },
    layout: {
      visibility: 'visible'
    }
  }

};
var select_style = {
  fill: {
    paint: {
      'fill-color': '#00ffff',
      'fill-opacity': 0.2,
      'fill-outline-color': '#ee1433',
      'fill-antialias': true,
      'fill-translate': [0, 0],
      'fill-translate-anchor': 'map'
      // "fill-pattern": ""
    },
    layout: {
      visibility: 'visible'
    }
  },
  line: {
    paint: {
      'line-color': '#ee1433',
      'line-opacity': 1,
      'line-translate': [0, 0],
      'line-translate-anchor': 'map',
      'line-width': 2,
      'line-gap-width': 0,
      'line-offset': 0,
      'line-blur': 0,
      'line-dasharray': [1, 0]
      // "line-pattern": " "
    },
    layout: {
      visibility: 'visible',
      'line-cap': 'butt',
      'line-join': 'miter',
      'line-miter-limit': 2,
      'line-round-limit': 1.05
    }
  }
};
// option isClear:表示是否清除上次选择
function ToolbarControl(option) {
  this.option = option;
}
mapboxgl.ToolbarControl = ToolbarControl;
ToolbarControl.prototype.onAdd = function(map) {
  this._container = document.createElement('div');
  this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
  DomUtil.addClass(this._container, 'toolbar-box');
  this._map = map; // 地图对象
  this.popup = null; // pop框
  this.selectType = ''; // 选择类型
  this.pointArray = []; // 屏幕坐标数组
  this.mapPoints = []; // 地理坐标数组
  this.boxPoly = null; // 搜索区多边形
  this.points_count = 0; // 多边形选的点个数，mousemove时用于判断是更新点还是加点
  this.isMousedown = null; // 是否是拖动
  // 图层定义
  this.temp_point_layer = null; // 选出的点层
  this.temp_line_layer = null; // 选出的线层
  this.temp_fill_layer = null; // 选出的面层
  this.buffer_layer = null; // 缓冲区绘制层
  this.draw_layer = null; // 框选，多边形选和圈选区域绘制层
  // 事件回调this绑定
  this._onClick = this._onClick.bind(this);
  this._onMouseDown = this._onMouseDown.bind(this);
  this._onMouseMove = this._onMouseMove.bind(this);
  this._onMouseUp = this._onMouseUp.bind(this);
  this._onDblClick = this._onDblClick.bind(this);
  this.clearAllLayersFeatures = this.clearAllLayersFeatures.bind(this);
  // 创建toolbar各按钮并绑定事件
  this.initToolbarBtn();
  return this._container;
};

ToolbarControl.prototype.onRemove = function() {
  this.deactivate();
  this._container.parentNode.removeChild(this._container);
  this._map = undefined;
};
// 初始化各按钮
ToolbarControl.prototype.initToolbarBtn = function() {
  var self = this;
  for (var i = 0; i < toolBar_text.length; i++) {
    var btn = document.createElement('button');
    DomUtil.addClass(btn, 'mapboxgl-ctrl-icon');
    var op = toolBar_text[i];
    btn.title = toolBar_text[i];
    switch (op) {
      case '平移':
        DomUtil.addClass(btn, 'point_pan_icon');
        btn.addEventListener('click', function() {
          self.finish();
        }, false);
        break;
      case '查看属性':
        DomUtil.addClass(btn, 'point_attr_icon');
        btn.addEventListener('click', function() {
          self.activate('showProperty');
        }, false);
        break;
      case '点选':
        DomUtil.addClass(btn, 'point_select_icon');
        btn.addEventListener('click', function() {
          self.activate('selectByPoint');
        }, false);
        break;
      case '框选':
        DomUtil.addClass(btn, 'rect_select_icon');
        btn.addEventListener('click', function() {
          self.activate('selectByRect');
        }, false);
        break;
      case '圈选':
        DomUtil.addClass(btn, 'circle_select_icon ');
        btn.addEventListener('click', function() {
          self.activate('selectByCircle');
        }, false);
        break;
      case '多边形选':
        DomUtil.addClass(btn, 'poly_select_icon');
        btn.addEventListener('click', function() {
          self.activate('selectByPolygon');
        }, false);
        break;
      case '缓冲区分析':
        DomUtil.addClass(btn, 'buffer_icon');
        btn.addEventListener('click', function() {
          self.activate('bufferAnalysis');
        }, false);
        break;
      case '清除':
        DomUtil.addClass(btn, 'clear_icon');
        btn.addEventListener('click', function() {
          self.clearAllLayersFeatures();
        }, false);
        break;
    }
    this._container.appendChild(btn);
  }
};
// 激活工具
ToolbarControl.prototype.activate = function(selectType) {
  this.deactivate();
  if (!this._map) return;
  this.selectType = selectType;
  this.changeMapCursor(selectType);
  this._map.on('zoomend', this.clearAllLayersFeatures);
  switch (selectType) {
    case 'showProperty':
      this._map.on('click', this._onClick);
      break;
    case 'selectByPoint':
      this._map.doubleClickZoom.disable();
      this._map.on('click', this._onClick);
      break;
    case 'selectByRect':
    case 'selectByCircle':
    {
      this._map.doubleClickZoom.disable();
      this._map.on('mousedown', this._onMouseDown);
      this._map.on('mousemove', this._onMouseMove);
      this._map.on('mouseup', this._onMouseUp);
      break;
    }
    case 'selectByPolygon':
    {
      this._map.doubleClickZoom.disable();
      this._map.on('click', this._onClick);
      this._map.on('dblclick', this._onDblClick);
      this._map.on('mousemove', this._onMouseMove);
      break;
    }
    case 'bufferAnalysis':
      this._map.doubleClickZoom.disable();
      this._map.on('click', this._onClick);
      break;
  }
};
// 取消激活状态
ToolbarControl.prototype.deactivate = function() {
  this.pointArray = [];
  this.mapPoints = [];
  if (this._map) {
    this.clearAllLayersFeatures();
    this._map.off('click', this._onClick);
    this._map.off('mousedown', this._onMouseDown);
    this._map.off('mousemove', this._onMouseMove);
    this._map.off('mouseup', this._onMouseUp);
    this._map.off('dblclick', this._onDblClick);
    this._map.off('zoomend', this.clearAllLayersFeatures);
    this._map.off('mousemove', this._onMouseMove);
  }
};
// 鼠标click事件
ToolbarControl.prototype._onClick = function(e) {
  this.mapPoints.push(e.lngLat);
  var mapPoint = e.point;
  if (this.pointArray.length > 0) {
    var lastPoint = this.pointArray[this.pointArray.length - 1];
    if (lastPoint.x === mapPoint.x && lastPoint.y === mapPoint.y) {
      return;
    }
  }
  this.pointArray.push(e.point);
  switch (this.selectType) {
    case 'showProperty':
      this.attrClick(e);
      break;
    case 'selectByPoint':
      var pointSelect = mapPoint;
      var features = this._map.queryRenderedFeatures(pointSelect);
      if (features.length == 0) {
        console.log('没有选到要素！');
        return;
      }
      var features_arr = [];
      features.forEach(item => {
        var json = item.toJSON();
        features_arr.push({
          type: json.type,
          geometry: json.geometry,
          properties: json.properties
        });
      });
      this.addLayers(features_arr);
      break;
    case 'selectByPolygon':
    {
      this.points_count++;
      break;
    }
    case 'bufferAnalysis':
    {
      this.clearAllLayersFeatures();
      var pointBuffer = mapPoint;
      this.bufferAnalysis(pointBuffer);
      break;
    }
    default:
    {
      this.pointArray.pop();
      this.mapPoints.pop();
    }
  }
};
/**
 * 鼠标按下事件
 * @param e {Event}
 * @private
 */
ToolbarControl.prototype._onMouseDown = function(e) {
  console.log(e.lngLat);
  this.isMousedown = true;
  this.pointArray.push(e.point);
  this.mapPoints.push(e.lngLat);
};

/**
 * 鼠标移动事件
 * @param e {Event}
 * @private
 */
ToolbarControl.prototype._onMouseMove = function(e) {
  if (this.isMousedown) {
    this.mapPoints = [];
    return;
  }
  var point_move = e.lngLat;
  if (!this.mapPoints || this.mapPoints.length == 0) return;
  var p1 = this.mapPoints[0];
  var p2 = point_move;
  if (p1.lng == p2.lng && p1.lat == p2.lat) {
    return;
  }
  switch (this.selectType) {
    case 'selectByRect':
    {
      this.boxPoly = turf.bboxPolygon([p1.lng, p1.lat, p2.lng, p2.lat]);
      break;
    }
    case 'selectByCircle':
    {
      var distance = getDistance(p1, p2, 'meters');
      this.boxPoly = turf.circle([p1.lng, p1.lat], distance, {
        units: 'meters'
      });
      break;
    }
    case 'selectByPolygon':
    {
      if (this.points_count === this.mapPoints.length) {
        this.mapPoints.push(e.lngLat);
      } else {
        this.mapPoints[this.points_count] = e.lngLat;
      }
      var p_arr = [];
      if (this.mapPoints.length <= 2) {
        var mapP1 = this.mapPoints[0];
        p_arr.push([mapP1.lng, mapP1.lat]);
        var mapP2 = this.mapPoints[1];
        p_arr.push([mapP2.lng, mapP2.lat]);
        this.boxPoly = turf.lineString(p_arr);
      } else {
        for (var i = 0; i < this.mapPoints.length; i++) {
          var pp = this.mapPoints[i];
          if (!pp) return;
          p_arr.push([pp.lng, pp.lat]);
        }
        p_arr.push(p_arr[0]);
        this.boxPoly = turf.polygon([p_arr]);
      }
    }
  }
  if (!this.draw_layer) {
    if (this.boxPoly.geometry.type == 'Polygon') {
      var line = turf.polygonToLine(this.boxPoly);
    } else {
      line = this.boxPoly;
    }
    this.draw_layer = createDraw(line);
    this._map.addLayer(this.draw_layer);
  } else {
    this._map.getSource('drawLayer').setData(this.boxPoly);
  }
};
/**
 * 鼠标松开事件
 * @param e {Event}
 * @private
 */
ToolbarControl.prototype._onMouseUp = function(e) {
  this.isMousedown = false;
  if (!this.boxPoly || this.boxPoly.geometry.type != 'Polygon') return;
  this.clearAllLayersFeatures();
  var bbox = turf.bbox(this.boxPoly);
  var points = bboxToBoundsPoint(bbox, this._map);
  var queryed_features = this._map.queryRenderedFeatures(points);
  var features_arr = [];
  if (!queryed_features || queryed_features.length == 0) {
    this.boxPoly = null;
    this.mapPoints = [];
    return;
  }
  queryed_features.forEach(item => {
    // 画出来的范围不需要被选中
    if (item.layer.id != 'drawLayer') {
      var json = item.toJSON();
      features_arr.push({
        type: json.type,
        geometry: json.geometry,
        properties: json.properties
      });
    }
  });
  var query_result = getInteractFeatures(features_arr, this.boxPoly);
  this.addLayers(query_result, this._map);
  this.boxPoly = null;
  this.mapPoints = [];
};
/**
 * 双击结束事件
 * @param e {Event}
 * @private
 */
ToolbarControl.prototype._onDblClick = function(e) {
  if (!this.boxPoly || this.boxPoly.geometry.type != 'Polygon') return;
  this.clearAllLayersFeatures();
  var bbox = turf.bbox(this.boxPoly);
  var points = bboxToBoundsPoint(bbox, this._map);
  var queryed_features = this._map.queryRenderedFeatures(points);
  var features_arr = [];
  if (!queryed_features || queryed_features.length == 0) {
    this.boxPoly = null;
    this.mapPoints = [];
    this.points_count = 0;
    return;
  }
  queryed_features.forEach(item => {
    // 画出来的范围不需要被选中
    if (item.layer.id != 'drawLayer') {
      var json = item.toJSON();
      features_arr.push({
        type: json.type,
        geometry: json.geometry,
        properties: json.properties
      });
    }
  });
  var query_result = getInteractFeatures(features_arr, this.boxPoly);
  this.addLayers(query_result, this._map);
  this.boxPoly = null;
  this.mapPoints = [];
  this.points_count = 0;
};
/**
 * 结束操作--切换至平移
 */
ToolbarControl.prototype.finish = function() {
  this._map.doubleClickZoom.isEnabled();
  this._map.getCanvas().className = '';
  this._map.getCanvas().style.cursor = '';
  this._map.off('click', this._onClick);
  this._map.off('mousedown', this._onMouseDown);
  this._map.off('mousemove', this._onMouseMove);
  this._map.off('mouseup', this._onMouseUp);
  this._map.off('dblclick', this._onDblClick);
  this._map.off('zoomend', this.clearAllLayersFeatures);
};
// 查看属性
ToolbarControl.prototype.attrClick = function(e) {
  var div = document.createElement('div');
  var features = this._map.queryRenderedFeatures(e.point);
  var querySourceLayers = {};
  var sourceLayers = {};
  if (features.length === 0) {
    div.innerHTML = '捕捉提醒:当前点没有数据';
    return;
  }
  for (let i = 0, len = features.length; i < len; i++) {
    var sourceLayer = features[i].layer['source-layer'];
    var properties = features[i].properties;
    var type = features[i].geometry.type;
    if (sourceLayer && !sourceLayers[sourceLayer]) {
      sourceLayers[sourceLayer] = {
        type: type,
        properties: properties
      };
    }
  }
  querySourceLayers = sourceLayers;
  // 创建pop框html内容
  var info_container = document.createElement('div');
  for (var key in querySourceLayers) {
    var layer_container = document.createElement('div');
    // 图层名
    var title_span = document.createElement('span');
    title_span.className = 'popup_attr_layer_title';
    title_span.innerText = key;
    layer_container.appendChild(title_span);
    // 图层下属性
    for (var key1 in querySourceLayers[key].properties) {
      var attr_box = document.createElement('div');
      attr_box.className = 'popup_attr_property_box';
      // 属性名
      var attr_name = document.createElement('span');
      attr_name.innerText = key1 + ': ';
      attr_box.appendChild(attr_name);
      // 属性值
      var attr_value = document.createElement('span');
      attr_value.innerText = querySourceLayers[key].properties[key1];
      attr_box.appendChild(attr_value);
      layer_container.appendChild(attr_box);
    }
    info_container.appendChild(layer_container);
  }
  div.appendChild(info_container);
  // 将内容添到popup中
  if (this.popup) this.popup.remove();
  this.popup = new mapboxgl.Popup()
    .setLngLat(e.lngLat)
    .setHTML(div.innerHTML)
    // .setDOMContent(infoContainer)
    .addTo(this._map);
};
// 添加图层
ToolbarControl.prototype.addLayers = function(features) {
  var point_features = features.filter(item => {
    return item.geometry.type == 'Point';
  });
  var line_features = features.filter(item => {
    return item.geometry.type == 'LineString';
  });
  var polygon_features = features.filter(item => {
    return item.geometry.type == 'Polygon';
  });
  if (polygon_features.length > 0) {
    if (this.option && this.option.isClear) {
      if (!this._map.getLayer('TempLayer_fill')) {
        this.temp_fill_layer = createTempLayer('fill', polygon_features);
        this._map.addLayer(this.temp_fill_layer);
      } else {
        this.temp_fill_layer.source.data.features = polygon_features;
        this._map.getSource('TempLayer_fill').setData(this.temp_fill_layer.source.data);
      }
    } else {
      if (!this._map.getLayer('TempLayer_fill')) {
        this.temp_fill_layer = createTempLayer('fill', polygon_features);
        this._map.addLayer(this.temp_fill_layer);
      } else {
        var data_new_f = this.temp_fill_layer.source.data.features.concat(polygon_features);
        this.temp_fill_layer.source.data.features = data_new_f;
        this._map.getSource('TempLayer_fill').setData(this.temp_fill_layer.source.data);
      }
    }
  }
  if (line_features.length > 0) {
    if (this.option && this.option.isClear) {
      if (!this._map.getLayer('TempLayer_line')) {
        this.temp_line_layer = createTempLayer('line', line_features);
        this._map.addLayer(this.temp_line_layer);
      } else {
        this.temp_line_layer.source.data.features = line_features;
        this._map.getSource('TempLayer_line').setData(this.temp_line_layer.source.data);
      }
    } else {
      if (!this._map.getLayer('TempLayer_line')) {
        this.temp_line_layer = createTempLayer('line', line_features);
        this._map.addLayer(this.temp_line_layer);
      } else {
        var data_new_l = this.temp_line_layer.source.data.features.concat(line_features);
        this.temp_line_layer.source.data.features = data_new_l;
        this._map.getSource('TempLayer_line').setData(this.temp_line_layer.source.data);
      }
    }
  }
  if (point_features.length > 0) {
    if (this.option && this.option.isClear) {
      if (!this._map.getLayer('TempLayer_symbol')) {
        this.temp_point_layer = createTempLayer('symbol', point_features);
        this._map.addLayer(this.temp_point_layer);
      } else {
        this.temp_point_layer.source.data.features = point_features;
        this._map.getSource('TempLayer_symbol').setData(this.temp_point_layer.source.data);
      }
    } else {
      if (!this._map.getLayer('TempLayer_symbol')) {
        this.temp_point_layer = createTempLayer('symbol', point_features);
        this._map.addLayer(this.temp_point_layer);
      } else {
        var data_new_p = this.temp_point_layer.source.data.features.concat(point_features);
        this.temp_point_layer.source.data.features = data_new_p;
        this._map.getSource('TempLayer_symbol').setData(this.temp_point_layer.source.data);
      }
    }
  }
};
// 清除所有图层要素
ToolbarControl.prototype.clearAllLayersFeatures = function() {
  if (this._map.getLayer('TempLayer_symbol')) {
    this._map.getSource('TempLayer_symbol').setData({
      'type': 'FeatureCollection',
      'features': []
    });
  }
  if (this._map.getLayer('TempLayer_line')) {
    this._map.getSource('TempLayer_line').setData({
      'type': 'FeatureCollection',
      'features': []
    });
  }
  if (this._map.getLayer('TempLayer_fill')) {
    this._map.getSource('TempLayer_fill').setData({
      'type': 'FeatureCollection',
      'features': []
    });
  }
  if (this._map.getLayer('bufferLayer')) {
    this._map.getSource('bufferLayer').setData({
      'type': 'FeatureCollection',
      'features': []
    });
  }
  if (this._map.getLayer('drawLayer')) {
    this._map.getSource('drawLayer').setData({
      'type': 'FeatureCollection',
      'features': []
    });
  }
};
// 移除所有图层
ToolbarControl.prototype.removeAllLayers = function() {
  if (this._map.getLayer('TempLayer_symbol')) {
    this._map.removeLayer('TempLayer_symbol');
    this._map.removeSource('TempLayer_symbol');
    this.temp_point_layer = null;
  }
  if (this._map.getLayer('TempLayer_line')) {
    this._map.removeLayer('TempLayer_line');
    this._map.removeSource('TempLayer_line');
    this.temp_line_layer = null;
  }
  if (this._map.getLayer('TempLayer_fill')) {
    this._map.removeLayer('TempLayer_fill');
    this._map.removeSource('TempLayer_fill');
    this.temp_fill_layer = null;
  }
  if (this._map.getLayer('bufferLayer')) {
    this._map.removeLayer('bufferLayer');
    this._map.removeSource('bufferLayer');
    this.buffer_layer = null;
  }
  if (this._map.getLayer('drawLayer')) {
    this._map.removeLayer('drawLayer');
    this._map.removeSource('drawLayer');
    this.draw_layer = null;
  }
};
// 缓冲区分析
ToolbarControl.prototype.bufferAnalysis = function(point) {
  var features = this._map.queryRenderedFeatures(point);
  if (features.length == 0) {
    console.log('没有选到要素！');
    return;
  }
  var features_arr = [];
  features.forEach(item => {
    var json = item.toJSON();
    features_arr.push({
      type: json.type,
      geometry: json.geometry,
      properties: json.properties
    });
  });
  var bufferLayer = createBuffer(features_arr[0]).layer;
  var buffer_area = createBuffer(features_arr[0]).bufferFeature;
  var bbox = turf.bbox(buffer_area);
  var buffer_points = bboxToBoundsPoint(bbox, this._map);
  var queryed_features = this._map.queryRenderedFeatures(buffer_points);
  var features_arr1 = [];
  queryed_features.forEach(item => {
    var json = item.toJSON();
    features_arr1.push({
      type: json.type,
      geometry: json.geometry,
      properties: json.properties
    });
  });
  var query_result = getInteractFeatures(features_arr1, buffer_area);
  this.clearAllLayersFeatures();
  if (this._map && !this._map.getSource('bufferLayer')) {
    this.buffer_layer = bufferLayer;
    this._map.addLayer(this.buffer_layer);
  } else {
    this._map.getSource('bufferLayer').setData({
      'type': 'FeatureCollection',
      'features': [buffer_area]
    });
  }
  this.addLayers(query_result, this._map);
};

// 修改地图鼠标样式
ToolbarControl.prototype.changeMapCursor = function(selectType) {
  var cursorCanvas = this._map.getCanvas();
  switch (selectType) {
    case 'showProperty':
      cursorCanvas.className = 'identify_cursor';
      break;
    case 'selectByPoint':
      cursorCanvas.className = 'selectByPoint_cursor';
      break;
    case 'selectByRect':
      cursorCanvas.className = 'selectByRect_cursor';
      break;
    case 'selectByCircle':
      cursorCanvas.className = 'selectByCircle_cursor';
      break;
    case 'selectByPolygon':
      cursorCanvas.className = 'selectByRegion_cursor';
      break;
    case 'bufferAnalysis':
      cursorCanvas.className = '';
      cursorCanvas.style.cursor = 'pointer';
      break;
  }
};
// 量距；from,to经纬度点，unit:单位
function getDistance(from, to, unit) {
  if (!from || !to || !unit) {
    return;
  }
  var p1 = turf.point([from.lng, from.lat]);
  var p2 = turf.point([to.lng, to.lat]);
  var options = {
    units: unit
  };
  var distance = turf.distance(p1, p2, options);
  return distance;
}

// bbox转点串
function bboxToBoundsPoint(bbox, map) {
  var sw = {
    lng: bbox[0],
    lat: bbox[1]
  };
  var ne = {
    lng: bbox[2],
    lat: bbox[3]
  };
  var sw_point = map.project(sw);
  var ne_point = map.project(ne);
  return [
    [sw_point.x, sw_point.y],
    [ne_point.x, ne_point.y]
  ];
}
// 创建单个图层
function createTempLayer(type, features) {
  var data = [];
  if (features && features.length > 0) {
    data = features;
  } else {
    data = [];
  }
  var symbol_type = type == 'symbol' ? 'circle' : type;

  var layer = {
    id: 'TempLayer_' + type,
    type: symbol_type,
    source: {
      'type': 'geojson',
      'data': {
        'type': 'FeatureCollection',
        'features': data
      }
    },
    layout: symbol_style[symbol_type].layout,
    paint: symbol_style[symbol_type].paint
  };
  return layer;
}
// 生成缓冲区范围
function createBuffer(feature) {
  var buffered = turf.buffer(feature, 500, {
    units: 'meters'
  });
  var layer = {
    id: 'bufferLayer',
    type: 'fill',
    source: {
      'type': 'geojson',
      'data': {
        'type': 'FeatureCollection',
        'features': [buffered]
      }
    },
    layout: select_style['fill'].layout,
    paint: select_style['fill'].paint
  };
  return {
    bufferFeature: buffered,
    layer: layer
  };
}
// 生成拉框区范围
function createDraw(json) {
  if (!json) return;
  var type = json.geometry.type == 'Polygon' ? 'fill' : 'line';
  var layout = {};
  var paint = {};
  if (type == 'fill') {
    layout = select_style['fill'].layout;
    paint = select_style['fill'].paint;
  } else {
    layout = select_style['line'].layout;
    paint = select_style['line'].paint;
  }
  var layer = {
    id: 'drawLayer',
    type: type,
    source: {
      'type': 'geojson',
      'data': json
    },
    layout: layout,
    paint: paint
  };
  return layer;
}
// 判断两个面是否相交
function isPolygonsIntersect(polygon1, polygon2) {
  var isContain = turf.booleanContains(polygon2, polygon1);
  var isInteract = turf.booleanOverlap(polygon1, polygon2);
  return isContain || isInteract;
}
// 判断点是否在面中
function isPointInPolygon(point, polygon) {
  // var isIn = turf.booleanContains(polygon, point);
  var line = turf.polygonToLine(polygon);
  var isPointOnLine = turf.booleanPointOnLine(point, line);
  var isIn = turf.booleanContains(polygon, point);
  return isPointOnLine || isIn;
}
// 判断线是否和面相交
function isLineIntersectPolygon(line, polygon) {
  var isContain = turf.booleanContains(polygon, line);
  var isCross = turf.booleanCrosses(line, polygon);
  return isContain || isCross;
}
// 获取相交的要素
function getInteractFeatures(featureArr, bufferFeature) {
  var point_features = featureArr.filter(item => {
    return item.geometry.type == 'Point' && isPointInPolygon(item, bufferFeature);
  });
  var line_features = featureArr.filter(item => {
    return item.geometry.type == 'LineString' && isLineIntersectPolygon(item, bufferFeature);
  });
  var polygon_features = featureArr.filter(item => {
    return item.geometry.type == 'Polygon' && isPolygonsIntersect(item, bufferFeature);
  });
  var ff = point_features.concat(line_features).concat(polygon_features);
  return ff;
}
