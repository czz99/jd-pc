<template>
  <div class="i-table">
    <!-- 按钮部分 -->
    <div class="btn-list" v-show="toolbar.length">
      <el-button
        v-for="(item, index) in toolbar"
        :type="item.type"
        :key="index"
        @click="item.func">
        {{item.btnName}}
      </el-button>
    </div>

    <!-- 表格部分tableData.slice((pageInfo.pageNum - 1) * pageInfo.pageSize, pageInfo.pageNum * pageInfo.pageSize) -->
    <div class="table-container">
      <el-table
      v-show="tableData.length"
      border
      :data="tableData"
      @selection-change="handleSelectionChange">
        <el-table-column
          v-if="selectionShow"
          type="selection"
          width="55"
          align="center">
        </el-table-column>
        <slot></slot>
      </el-table>
    </div>

    <!-- 分页部分 -->
    <div class="table-pagination" v-show="tableData.length">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageInfo.pageNum"
        :page-sizes="[5, 10, 20, 50, 100]"
        :page-size="pageInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageInfo.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'i-table',
  props: {
    toolbar: {
      type: Array,
      default: () => {
        return []
      }
    },
    tableData: {
      type: Array,
      default: () => {
        return []
      }
    },
    pageInfo: {
      type: Object,
      default: () => {
        return {
          pageNum: 1,
          pageSize: 5,
          total: 0
        }
      }
    },
    selectionShow: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // currentPage: 1
    }
  },
  methods: {
    // 每页的条数
    handleSizeChange (value) {
      this.$emit('handleSizeChange', value)
    },
    // 当前的页数
    handleCurrentChange (value) {
      this.$emit('handleCurrentChange', value)
    },
    // 多选框改变
    handleSelectionChange (rows) {
      this.$emit('selection-change', rows)
    }
  }
}
</script>

<style lang="scss" scoped>
.i-table {
  padding: 10px;

  .btn-list {
    margin-bottom: 10px;
  }

  .table-pagination {
    .el-pagination {
      text-align: right;
    }
  }
}
</style>
