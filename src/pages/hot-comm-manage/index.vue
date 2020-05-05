<template>
  <div>
    <!-- :model="formData"是传了一个名字为model,值为formData的对象给i-search -->
    <i-search ref="iSearch" :model="formData" @search="fetch" @reset="reset">
      <el-form-item label="商品名称" prop="goodsName">
        <!-- 对象中未声明的test1,将会在访问时强制创建 -->
        <el-input v-model="formData.goodsName"></el-input>
      </el-form-item>
      <el-form-item label="商品编号" prop="goodsCode">
        <el-input v-model="formData.goodsCode"></el-input>
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
        :width="item.width">
      </el-table-column>
    </i-table>

    <i-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      :width="dialogWidth"
      @dialog-before-close="dialogBeforeClose"
      @dialog-cancel="dialogCancel"
      @dialog-confirm="dialogConfirm">

      <el-dialog
        title="热门位商品选择"
        :visible.sync="innerVisible"
        width="1000px"
        append-to-body>
        <i-search :model="innerFormData" @search="innerFetch" @reset="innerReset">
          <el-form-item label="商品名称" prop="goodsName">
            <!-- 对象中未声明的test1,将会在访问时强制创建 -->
            <el-input v-model="innerFormData.goodsName"></el-input>
          </el-form-item>
          <el-form-item label="商品编码" prop="goodsCode">
            <el-input v-model="innerFormData.goodsCode"></el-input>
          </el-form-item>
        </i-search>
        <i-table
          :toolbar="[]"
          :tableData="innerTableData"
          :pageInfo="innerPageInfo"
          :selectionShow="true"
          @handleSizeChange="innerHandleSizeChange"
          @handleCurrentChange="innerHandleCurrentChange"
          @selection-change="innerHandleSelectionChange">
          <el-table-column
            v-for="(item, index) in innerColumnList"
            :key="index"
            :label="item.label"
            :prop="item.prop"
            align="center"
            :formatter="innerColumnFormatter"
            :width="item.width">
          </el-table-column>
        </i-table>
        <span slot="footer" class="dialog-footer">
          <el-button @click="innerVisibleCancel">取消</el-button>
          <el-button @click="innerVisibleSubmit" type="primary">提交</el-button>
        </span>
      </el-dialog>
      <el-form :model="dialogFormData" ref="form" :rules="formRules" label-width="100px">
        <el-row>
          <el-col :span='16'>
            <el-form-item label="商品" prop="goodsName">
              <el-input v-model="dialogFormData.goodsName" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='8'>
            <el-form-item class="dialogSelectBtn">
              <el-button type="primary" @click="innerFetch();innerVisibleTrue()">选择</el-button>
            </el-form-item>
          </el-col>
          <el-col :span='16'>
            <el-form-item label="热门位排序" prop="hotSort">
              <el-input v-model.number="dialogFormData.hotSort"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </i-dialog>

    <i-dialog
      v-model="setShowNumberDialogVisible"
      title="热门位商品数量设置"
      width="30%"
      @dialog-before-close="setShowNumberDialogBeforeClose"
      @dialog-cancel="setShowNumberDialogCancel"
      @dialog-confirm="setShowNumberDialogConfirm">
      <el-form :model="setShowNumberDialogFormData" ref="setShowNumberForm" :rules="setShowNumberFormRules" label-width="110px">
        <el-row>
          <el-col :span='16'>
            <el-form-item label="展示数量为：" prop="hotGoodsCnt">
              <el-input v-model.number="setShowNumberDialogFormData.hotGoodsCnt"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </i-dialog>
  </div>
</template>

<script>
import ISearch from '@/components/common/i-search.vue'
import ITable from '@/components/common/i-table.vue'
import IDialog from '@/components/common/i-dialog.vue'
import req from '@/api/hot-comm-manage.js'

export default {
  name: 'hot-comm-manage',
  components: {
    ISearch,
    ITable,
    IDialog
  },
  data () {
    return {
      formData: {},
      dialogTitle: '',
      dialogType: '',
      dialogFormData: {
        hotSort: '',
        goodsCode: '',
        goodsName: '',
        hotId: ''
      },
      version: '',
      dialogWidth: '35%',
      innerFormData: {
        goodsName: '',
        goodsCode: ''
      },
      setShowNumberDialogFormData: {
        hotGoodsCnt: ''
      },
      innerVisible: false,
      setShowNumberDialogVisible: false,
      tableSelectRows: [],
      innerTableSelectRows: [],
      // radio: false,
      toolbar: [
        {
          btnName: '新增',
          type: 'primary',
          // 这里需要用箭头函数，因为箭头函数的this指的是它的上一层
          func: () => {
            this.dialogVisible = true
            this.dialogTitle = '新增热门位商品'
            this.dialogType = 'add'
          }
        },
        {
          btnName: '修改',
          type: 'primary',
          func: () => {
            if (this.tableSelectRows.length === 0) {
              this.$message.info('请选择需要修改的一件热门位商品')
              return
            }
            if (this.tableSelectRows.length > 1) {
              this.$message.info('一次只能修改一件热门位商品')
              return
            }
            this.dialogVisible = true
            this.dialogTitle = '修改热门位商品'
            this.dialogType = 'modify'
            req('getHotCommDetailData', {hotId: this.tableSelectRows[0].hotId}).then(data => {
              this.dialogFormData.goodsName = data.data.goodsName
              this.dialogFormData.goodsCode = data.data.goodsCode
              this.dialogFormData.hotSort = Number(data.data.hotSort)
              this.dialogFormData.hotId = data.data.hotId
              this.version = data.data.version
            })
          }
        },
        {
          btnName: '删除',
          type: 'primary',
          func: () => {
            if (this.tableSelectRows.length === 0) {
              this.$message.info('请选择需要删除的热门位商品')
              return
            }
            this.$confirm('此操作将永久删除该数据,是否继续?').then(() => {
              this.hotId = this.tableSelectRows.map(item => {
                return item.hotId
              }).toString()
              req('deleteHotCommData', {hotId: this.hotId}).then(data => {
                if (data.code === 0) {
                  this.$message.success('删除成功')
                  this.fetch()
                } else {
                  this.$message.error(data.msg)
                }
              })
            }).catch(() => {})
          }
        },
        {
          btnName: '展示数量设置',
          type: 'primary',
          func: () => {
            this.setShowNumberDialogVisible = true
            req('getShowNumber', {}).then(data => {
              this.setShowNumberDialogFormData.hotGoodsCnt = data.data
            })
          }
        }
      ],
      columnList: [
        {label: '排序', prop: 'hotSort'},
        {label: '商品编号', prop: 'goodsCode'},
        {label: '商品名称', prop: 'goodsName'},
        {label: '商品价格', prop: 'sellPrice'},
        {label: '商品介绍', prop: 'goodsIntroduce'}
      ],
      tableData: [],
      innerStateOptions: [
        {label: '未发布', value: '0'},
        {label: '上架', value: '1'},
        {label: '下架', value: '2'}
      ],
      innerColumnList: [
        {label: '商品编号', prop: 'goodsCode', width: 200},
        {label: '商品名称', prop: 'goodsName'},
        {label: '商品状态', prop: 'state', distName: 'innerStateOptions'},
        {label: '一级分类', prop: 'classficationlOne'},
        {label: '二级分类', prop: 'classficationlTwo'}
      ],
      innerTableData: [],
      formRules: {
        goodsName: [
          { required: true, message: '请选择商品', trigger: 'change' }
        ],
        hotSort: [
          { required: true, message: '请输入热门位排序', trigger: 'change' },
          { type: 'number', message: '请输入数字' }
        ]
      },
      setShowNumberFormRules: {
        hotGoodsCnt: [
          { required: true, message: '请输入展示数量', trigger: 'change' },
          { type: 'number', message: '请输入数字' }
        ]
      },
      pageInfo: {
        pageNum: 1,
        pageSize: 5,
        total: 0
      },
      innerPageInfo: {
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
    handleSelectionChange (rows) {
      this.tableSelectRows = rows
    },
    dialogBeforeClose () {
      this.$refs.form.resetFields()
    },
    dialogCancel () {
      this.dialogVisible = false
      this.$refs.form.resetFields()
    },
    // 新增和修改
    dialogConfirm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.dialogType === 'add') {
            req('addHotCommData', {
              hotSort: this.dialogFormData.hotSort,
              goodsCode: this.dialogFormData.goodsCode
            }).then(data => {
              if (data.code === 0) {
                this.$message.success('新增成功')
                this.fetch()
                this.$refs.form.resetFields()
                this.dialogVisible = false
              } else {
                this.$message.error(data.msg)
              }
            })
          } else {
            req('modifyHotCommData', {
              goodsCode: this.dialogFormData.goodsCode,
              hotSort: this.dialogFormData.hotSort,
              hotId: this.dialogFormData.hotId,
              version: this.version
            }).then(data => {
              if (data.code === 0) {
                this.$message.success('修改成功')
                this.fetch()
                this.$refs.form.resetFields()
                this.dialogVisible = false
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        } else {
          return false
        }
      })
    },
    // 内嵌的弹框部分
    innerVisibleTrue () {
      this.innerVisible = true
    },
    innerSearch () {
      req('getGoodsData', {
        ...this.innerFormData,
        pageSize: this.innerPageInfo.pageSize,
        pageNum: this.innerPageInfo.pageNum
      }).then(data => {
        // console.log(data)
        this.innerTableData = data.data.list
        this.innerPageInfo.pageNum = data.data.pageNum
        this.innerPageInfo.pageSize = data.data.pageSize
        this.innerPageInfo.total = data.data.total
      })
    },
    innerVisibleCancel () {
      this.innerVisible = false
      // this.$refs.innerDialogInfo.resetFields()
    },
    innerVisibleSubmit () {
      if (this.innerTableSelectRows.length === 0) {
        this.$message.info('请选择一件热门商品')
        return
      }
      if (this.innerTableSelectRows.length > 1) {
        this.$message.info('一次只能选择一件热门商品')
        return
      }
      this.innerVisible = false
      this.dialogFormData.goodsCode = this.innerTableSelectRows[0].goodsCode
      this.dialogFormData.goodsName = this.innerTableSelectRows[0].goodsName
    },
    innerFetch () {
      this.innerPageInfo.pageSize = 5
      this.innerPageInfo.pageNum = 1
      this.innerSearch()
    },
    innerReset () {
      this.innerFetch()
    },
    innerHandleSizeChange (value) {
      this.innerPageInfo.pageSize = value
      this.innerSearch()
    },
    innerHandleCurrentChange (value) {
      this.innerPageInfo.pageNum = value
      this.innerSearch()
    },
    innerHandleSelectionChange (rows) {
      this.innerTableSelectRows = rows
    },
    innerColumnFormatter (row, column, cellValue, index) {
      let distName = this.innerColumnList.filter(item => {
        return item.prop === column.property
      })[0].distName

      if (distName) {
        return this[distName].filter(item => {
          return item.value === row[column.property]
        })[0].label
      } else {
        return row[column.property]
      }
    },
    setShowNumberDialogBeforeClose () {
      this.$refs.setShowNumberForm.resetFields()
    },
    setShowNumberDialogCancel () {
      this.setShowNumberDialogVisible = false
      this.$refs.setShowNumberForm.resetFields()
    },
    setShowNumberDialogConfirm () {
      this.$refs.setShowNumberForm.validate((valid) => {
        if (valid) {
          req('setShowNumber', {hotGoodsCnt: this.setShowNumberDialogFormData.hotGoodsCnt}).then(data => {
            if (data.code === 0) {
              this.$message.success('展示数量设置成功')
              this.fetch()
              this.$refs.setShowNumberForm.resetFields()
              this.setShowNumberDialogVisible = false
            } else {
              this.$message.error(data.msg)
            }
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form {
  .el-col {
    .dialogSelectBtn {
      /deep/ .el-form-item__content {
        margin-left: 20px !important;
      }
    }
  }
}
</style>
