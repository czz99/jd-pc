<template>
  <div>
    <!-- :model="formData"是传了一个名字为model,值为formData的对象给i-search -->
    <i-search ref="iSearch" :model="formData" @search="fetch" @reset="reset">
      <el-form-item label="客户名称" prop="userName">
        <!-- 对象中未声明的test1,将会在访问时强制创建 -->
        <el-input v-model="formData.userName"></el-input>
      </el-form-item>
      <el-form-item label="客户账号" prop="userAcct">
        <el-input v-model="formData.userAcct"></el-input>
      </el-form-item>
    </i-search>

    <i-table
      :toolbar="toolbar"
      :tableData="tableData"
      :pageInfo="pageInfo"
      :selectionShow="false"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange">
      <el-table-column
        v-for="(item, index) in columnList"
        :key="index"
        :label="item.label"
        :prop="item.prop"
        align="center"
        :formatter="columnFormatter">
      </el-table-column>
    </i-table>

  </div>
</template>

<script>
import ISearch from '@/components/common/i-search.vue'
import ITable from '@/components/common/i-table.vue'
import req from '@/api/client-manage.js'

export default {
  name: 'client-manage',
  components: {
    ISearch,
    ITable
  },
  data () {
    return {
      formData: {},
      toolbar: [],
      pageInfo: {
        pageNum: 1,
        pageSize: 5,
        total: 0
      },
      sexList: [
        {label: '女', value: '0'},
        {label: '男', value: '1'}
      ],
      columnList: [
        {label: '客户账号', prop: 'userAcct'},
        {label: '姓名', prop: 'userName'},
        {label: '性别', prop: 'sex', distName: 'sexList'},
        {label: '手机', prop: 'phone'},
        {label: '客户邮箱', prop: 'email'},
        {label: '身份证', prop: 'idCard'}
      ],
      tableData: []
    }
  },
  mounted () {
    this.fetch()
  },
  methods: {
    fetch () {
      this.pageInfo.pageSize = 5
      this.pageInfo.pageNum = 1
      this.search()
    },
    search () {
      req('getTableData', {
        ...this.formData,
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageNum
      }).then(data => {
        this.tableData = data.data.list
        this.pageInfo.pageNum = data.data.pageNum
        this.pageInfo.pageSize = data.data.pageSize
        this.pageInfo.total = data.data.total
      })
    },
    reset () {
      this.fetch()
    },
    handleSizeChange (value) {
      this.pageInfo.pageSize = value
      this.search()
    },
    handleCurrentChange (value) {
      this.pageInfo.pageNum = value
      this.search()
    },
    columnFormatter (row, column, cellValue, index) {
      let distName = this.columnList.filter(item => {
        return item.prop === column.property
      })[0].distName

      if (distName) {
        return this[distName].filter(item => {
          return item.value === row[column.property]
        })[0].label
      } else {
        return row[column.property]
      }
    }
  }
}
</script>
