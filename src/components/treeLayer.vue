<template>
  <div id="tree">
    <el-tree
      ref="tree"
      :data="data"
      show-checkbox
      node-key="id"
      :default-expanded-keys="leafArray"
      default-expand-all
      :expand-on-click-node="false"
      :render-content="renderContent"
      @check-change="handleCheckChange"
    ></el-tree>
  </div>
</template>
<script>
export default {
  data() {
    return {
      layer: {
        id: 1,
        label: '',
        children: []
      },
      data: [],
      layerId: 1,
      leafArray: []
    };
  },
  props: {
    map: Object,
    layerName: String,
    shpNames: Array
  },
  watch: {
    layerName: {
      handler: function(val, oldVal) {
        var layerCopy = JSON.parse(JSON.stringify(this.layer));
        layerCopy.label = val;
        layerCopy.id = this.layerId;
        this.data.push(layerCopy);
        this.leafArray.push(this.layerId);
        this.layerId++;
        console.log(this.data);
      },
      deep: true
    },
    leafArray: {
      handler: function(val, oldval) {
        this.$nextTick(() => {
          this.setCheckedKeys();
        });
      },
      deep: true
    }
  },
  mounted() {},
  methods: {
    remove(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      children.splice(index, 1);
      this.map.removeLayer(data.label);
    },
    renderContent(h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <span>{node.label}</span>
          <span>
            <el-button
              size="mini"
              type="text"
              on-click={() => this.remove(node, data)}
            >
              <i class="el-icon-delete"></i>
            </el-button>
          </span>
        </span>
      );
    },
    setCheckedKeys() {
      this.$refs.tree.setCheckedKeys(this.leafArray);
    },
    handleCheckChange(data, node, indeterminate) {
      if (node == false) {
        this.map.setLayoutProperty(data.label, 'visibility', 'none');
      } else {
        this.map.setLayoutProperty(data.label, 'visibility', 'visible');
      }
    }
  }
};
</script>

<style scoped>
#tree {
  position: absolute;
  top: 40px;
  bottom: 0px;
  left: 0px;
  width: 300px;
  background-color: #fff;
}
</style>
