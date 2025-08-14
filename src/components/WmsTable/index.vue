<template>
  <el-table
    :data="data"
    v-bind="$attrs"
    v-on="$listeners"
    ref="table"
    :id="tableId"
  >
    <slot></slot>
  </el-table>
</template>

<script>
export default {
  name: "WmsTable",
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      tableId: 'wms_table_' + Math.floor(Math.random() * 10000)
    }
  },
  provide() {
    return {
      tableId: this.tableId
    }
  }
}
</script>
