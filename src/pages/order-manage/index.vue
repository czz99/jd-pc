<template>
  <div>
    <!-- :model="formData"是传了一个名字为model,值为formData的对象给i-search -->
    <i-search ref="iSearch" :model="formData" @search="fetch" @reset="reset">
      <el-form-item label="下单人" prop="userName">
        <!-- 对象中未声明的test1,将会在访问时强制创建 -->
        <el-input v-model="formData.userName"></el-input>
      </el-form-item>
      <el-form-item label="订单编码" prop="orderId">
        <el-input v-model="formData.orderId"></el-input>
      </el-form-item>
      <el-form-item label="付款时间">
        <el-date-picker
          v-model="formData.payTime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="changeTime">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="formData.phone"></el-input>
      </el-form-item>
      <el-form-item label="订单状态" prop="orderState">
        <el-select v-model="formData.orderState" placeholder="全部">
          <el-option v-for="(item, index) in orderStateOptions" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
    </i-search>

    <i-table
      :toolbar="toolbar"
      :tableData="tableData"
      :pageInfo="pageInfo"
      :selectionShow="true"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
      @selection-change="handleSelectionChange">
      <el-table-column
        v-for="(item, index) in columnList"
        :key="index"
        :label="item.label"
        :prop="item.prop"
        align="center"
        :formatter="columnFormatter"
        :width="item.width">
      </el-table-column>
    </i-table>

    <el-dialog
      title="订单详情"
      :visible.sync="dialogVisible">
      <el-table
        border
        :data="dialogTableData">
        <el-table-column
          v-for="(item, index) in dialogColumnList"
          :key="index"
          :label="item.label"
          :prop="item.prop"
          align="center"
          :width="item.width">
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import ISearch from '@/components/common/i-search.vue'
import ITable from '@/components/common/i-table.vue'
import req from '@/api/order-manage.js'
import moment from 'moment'

export default {
  name: 'order-manage',
  components: {
    ISearch,
    ITable
  },
  data () {
    return {
      formData: {
        userName: '',
        orderId: '',
        phone: '',
        orderState: '',
        payTime: ''
      },
      payTimeBegin: '',
      payTimeEnd: '',
      orderStateOptions: [
        {label: '已下单', value: '0'},
        {label: '已取消', value: '1'},
        {label: '已到货', value: '2'},
        {label: '已取货', value: '3'},
        {label: '已完成未评价', value: '4'},
        {label: '已完成已评价', value: '5'}
      ],
      payStateOptions: [
        {label: '未付款', value: '0'},
        {label: '已付款', value: '1'}
      ],
      tableSelectRows: [],
      toolbar: [
        {
          btnName: '详情',
          type: 'primary',
          // 这里需要用箭头函数，因为箭头函数的this指的是它的上一层
          func: () => {
            if (this.tableSelectRows.length === 0) {
              this.$message.info('请选择一个需要查询详情的订单')
              return
            }
            if (this.tableSelectRows.length > 1) {
              this.$message.info('一次只能查询一个订单详情')
              return
            }
            let orderId = this.tableSelectRows.map(item => {
              return item.orderId
            }).toString()
            this.dialogVisible = true
            req('getOrderData', {orderId: orderId}).then(data => {
              this.dialogTableData = data.data.list
            })
          }
        },
        {
          btnName: '订单取消',
          type: 'primary',
          func: () => {
            if (this.tableSelectRows.length === 0) {
              this.$message.info('请选择需要修改状态的订单')
              return
            }
            let orderId = this.tableSelectRows.map(item => {
              return item.orderId
            }).toString()
            req('modifyOrderData', {orderId: orderId, orderState: '1'}).then(data => {
              if (data.code === 0) {
                this.tableSelectRows.map(item => {
                  item.shufflId = '1'
                })
                this.$message.success(data.msg)
                this.fetch()
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        },
        {
          btnName: '订单到货',
          type: 'primary',
          func: () => {
            if (this.tableSelectRows.length === 0) {
              this.$message.info('请选择需要修改状态的订单')
              return
            }
            let orderId = this.tableSelectRows.map(item => {
              return item.orderId
            }).toString()
            req('modifyOrderData', {orderId: orderId, orderState: '2'}).then(data => {
              if (data.code === 0) {
                this.tableSelectRows.map(item => {
                  item.shufflId = '2'
                })
                this.$message.success(data.msg)
                this.fetch()
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        },
        {
          btnName: '取消到货',
          type: 'primary',
          func: () => {
            if (this.tableSelectRows.length === 0) {
              this.$message.info('请选择需要修改状态的订单')
              return
            }
            let orderId = this.tableSelectRows.map(item => {
              return item.orderId
            }).toString()
            req('modifyOrderData', {orderId: orderId, orderState: '0'}).then(data => {
              if (data.code === 0) {
                this.tableSelectRows.map(item => {
                  item.shufflId = '0'
                })
                this.$message.success(data.msg)
                this.fetch()
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        },
        {
          btnName: '订单已取货',
          type: 'primary',
          func: () => {
            if (this.tableSelectRows.length === 0) {
              this.$message.info('请选择需要修改状态的订单')
              return
            }
            let orderId = this.tableSelectRows.map(item => {
              return item.orderId
            }).toString()
            req('modifyOrderData', {orderId: orderId, orderState: '3'}).then(data => {
              if (data.code === 0) {
                this.tableSelectRows.map(item => {
                  item.shufflId = '3'
                })
                this.$message.success(data.msg)
                this.fetch()
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        },
        {
          btnName: '取消已取货',
          type: 'primary',
          func: () => {
            if (this.tableSelectRows.length === 0) {
              this.$message.info('请选择需要修改状态的订单')
              return
            }
            let orderId = this.tableSelectRows.map(item => {
              return item.orderId
            }).toString()
            req('modifyOrderData', {orderId: orderId, orderState: '2'}).then(data => {
              if (data.code === 0) {
                this.tableSelectRows.map(item => {
                  item.shufflId = '2'
                })
                this.$message.success(data.msg)
                this.fetch()
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        }
      ],
      columnList: [
        {label: '订单编码', prop: 'orderId', width: 220},
        {label: '订单总价', prop: 'orderPrice'},
        {label: '订单状态', prop: 'orderState', distName: 'orderStateOptions'},
        {label: '支付状态', prop: 'payState', distName: 'payStateOptions'},
        {label: '门店编码', prop: 'storeId', width: 220},
        {label: '下单人', prop: 'userName'},
        {label: '手机号', prop: 'phone'},
        {label: '确认付款时间', prop: 'payTime'}
      ],
      tableData: [],
      dialogColumnList: [
        {label: '商品编码', prop: 'goodsCode', width: 220},
        {label: '商品名称', prop: 'goodsName', width: 120},
        {label: '购买数量', prop: 'buyNum'},
        {label: '总金额', prop: 'totalMoney'},
        {label: '在售价', prop: 'sellPrice'},
        {label: '成本价', prop: 'costPrice'}
      ],
      dialogTableData: [],
      pageInfo: {
        pageNum: 1,
        pageSize: 5,
        total: 0
      },
      dialogVisible: false
    }
  },
  mounted () {
    this.fetch()
  },
  methods: {
    changeTime (data) {
      this.payTimeBegin = moment(data[0]).format('YYYY-MM-DD')
      this.payTimeEnd = moment(data[1]).format('YYYY-MM-DD')
    },
    fetch () {
      this.pageInfo.pageSize = 5
      this.pageInfo.pageNum = 1
      this.search()
    },
    search () {
      req('getTableData', {
        userName: this.formData.userName,
        orderId: this.formData.orderId,
        phone: this.formData.phone,
        orderState: this.formData.orderState,
        payTimeBegin: this.payTimeBegin,
        payTimeEnd: this.payTimeEnd,
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
      // 清空数据
      this.payTimeBegin = ''
      this.payTimeEnd = ''
      this.formData.payTime = ''
      // console.log(this.formData)
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
    handleSelectionChange (rows) {
      this.tableSelectRows = rows
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
