<template>
  <div id="toolBody">
    <div
      class="toolBaritem"
      v-for="(item, i) in items"
      :title="item.label"
      :key="i"
      @click="btnClick({ $event, item })"
    >
      <i :class="item.className"></i>
    </div>
    <!-- <div class="closebtn" title="收起" @click="hideToolBar">
      <i class="el-icon-caret-top"></i>
    </div>-->
  </div>
</template>
<script>
export default {
  data() {
    return {
      items: [
        // { label: '放大', className: 'big-icon' },
        // { label: '缩小', className: 'small-icon' },
        { label: '平移', className: 'el-icon-rank' },
        // { label: '分屏', className: 'split-icon' },
        { label: '查看属性', className: 'el-icon-info' },
        { label: '添加数据', className: 'el-icon-circle-plus' }
        // { label: '测距', className: 'el-icon-rank' },
        // { label: '测面', className: 'el-icon-rank' },
        // { label: '框选', className: 'select-icon' },
        // { label: '搜索', className: 'search-icon' },
        // { label: '全图', className: 'el-icon-rank' }
      ]
    };
  },
  props: {
    map: Object,
    dialogVisible: Boolean
  },
  mounted() {},
  methods: {
    btnClick(obj) {
      console.log('label', obj.item.label);
      switch (obj.item.label) {
        case '平移':
          this.finish();
          break;
        case '查看属性':
          this.map.getCanvas().className = 'identify_cursor';
          this.map.on('click', this._onClick);
          break;
        case '添加数据':
          this.$parent.showDialog();
          break;
      }
    },
    finish() {
      this.map.doubleClickZoom.isEnabled();
      this.map.getCanvas().className = '';
      this.map.getCanvas().style.cursor = '';
    },
    _onClick(e) {
      debugger;
      // if (this.type == 'coverage' || this.baseType.indexOf('LC') > 0) {
      //   this.$emit('selectPoint', e.lngLat);
      //   return;
      // }
      // this.mapPoints.push(e.lngLat);
      // var mapPoint = e.point;
      // if (this.pointArray.length > 0) {
      //   var lastPoint = this.pointArray[this.pointArray.length - 1];
      //   if (lastPoint.x === mapPoint.x && lastPoint.y === mapPoint.y) {
      //     return;
      //   }
      // }
      // this.pointArray.push(e.point);
      // switch (this.selectType) {
      //   case 'showProperty':
      //     this.attrClick(e);
      //     break;
      //   default: {
      //     this.pointArray.pop();
      //     this.mapPoints.pop();
      //   }
      // }
    }
  }
};
</script>

<style scoped>
#toolBody {
  height: 33px;
  display: flex;
  border: 1px solid #dddddd;
  position: absolute;
  top: 25px;
  right: 25px;
  z-index: 10;
}
.toolBaritem {
  display: inline-block;
  width: 33px;
  height: 33px;
  border-right: 1px solid #dddddd;
  background-color: #fff !important;
  cursor: pointer;
}
.toolBaritem:last-child {
  border: none;
}
i {
  margin-top: 8px;
  font-size: 16px;
}
</style>
