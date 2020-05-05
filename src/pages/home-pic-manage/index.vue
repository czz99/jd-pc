<template>
  <div>
    <!-- :model="formData"是传了一个名字为model,值为formData的对象给i-search -->
    <i-search ref="iSearch" :model="formData" @search="fetch" @reset="reset">
      <el-form-item label="状态" prop="state">
        <el-select v-model="formData.state" placeholder="全部">
          <el-option v-for="(item, index) in stateOptions" :key="index" :label="item.label" :value="item.value"></el-option>
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
        <template slot-scope="scope">
          <el-button v-if="item.prop === 'watch'" type="text" @click="watchImg(scope.row)">预览</el-button>
          <span v-else>{{ filterDist(scope.row[item.prop], item)}}</span>
        </template>
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
        title="轮播商品选择"
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
          <!-- <el-table-column width="55" center label="选择">
            <template scope="scope">
              <el-radio
                class="radio"
                v-model="radio"
                :label="scope.$index"
                @change.native="getCurrentRow(scope.$index, scope.row)"
                style="margin-left: 10px;">
              &nbsp;</el-radio>
            </template>
          </el-table-column> -->
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
          <el-col :span='12'>
            <el-form-item label="轮播图片" prop="photo">
              <i-file v-model="dialogFormData.photo"></i-file>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="排序" prop="sort">
              <el-input v-model.number="dialogFormData.sort"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="有效期起" prop="timeBegin">
                <el-date-picker  placeholder="选择日期" v-model="dialogFormData.timeBegin" :picker-options="startTimePickerOptions" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="有效期止" prop="timeEnd">
                <el-date-picker  placeholder="选择日期" v-model="dialogFormData.timeEnd" :picker-options="endTimePickerOptions" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="商品" prop="goodsName">
              <el-input v-model="dialogFormData.goodsName" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item class="dialogSelectBtn">
              <el-button type="primary" @click="innerFetch();innerVisibleTrue()">选择</el-button>
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
import IFile from '@/components/common/i-file.vue'
import req from '@/api/home-pic-manage.js'
import moment from 'moment'

export default {
  name: 'home-pic-manage',
  components: {
    ISearch,
    ITable,
    IDialog,
    IFile
  },
  data () {
    return {
      formData: {
        state: ''
      },
      innerFormData: {
        goodsName: '',
        goodsCode: ''
      },
      dialogTitle: '新增轮播图',
      dialogFormData: {
        photo: '',
        sort: '',
        timeBegin: '',
        timeEnd: '',
        goodsCode: '',
        goodsName: ''
      },
      dialogWidth: '40%',
      innerVisible: false,
      tableSelectRows: [],
      innerTableSelectRows: [],
      toolbar: [
        {
          btnName: '新增',
          type: 'primary',
          // 这里需要用箭头函数，因为箭头函数的this指的是它的上一层
          func: () => {
            this.dialogVisible = true
          }
        },
        {
          btnName: '删除',
          type: 'primary',
          func: () => {
            if (this.tableSelectRows.length === 0) {
              this.$message.info('请选择需要删除的轮播图')
              return
            }
            this.$confirm('此操作将永久删除该数据,是否继续?').then(() => {
              let shufflId = this.tableSelectRows.map(item => {
                return item.shufflId
              }).toString()
              // 删除轮播图
              req('deleteHomePicData', {shufflId: shufflId}).then(data => {
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
          btnName: '启用',
          type: 'primary',
          func: () => {
            if (this.tableSelectRows.length === 0) {
              this.$message.info('请选择需要启用的轮播图')
              return
            }
            let shufflId = this.tableSelectRows.map(item => {
              return item.shufflId
            }).toString()
            // 修改轮播图状态
            req('modifyHomePicState', {shufflId: shufflId, state: '1'}).then(data => {
              if (data.code === 0) {
                this.tableSelectRows.map(item => {
                  item.shufflId = '1'
                })
                this.$message.success('启用成功')
                this.fetch()
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        },
        {
          btnName: '禁用',
          type: 'primary',
          func: () => {
            if (this.tableSelectRows.length === 0) {
              this.$message.info('请选择需要禁用的轮播图')
              return
            }
            let shufflId = this.tableSelectRows.map(item => {
              return item.shufflId
            }).toString()
            // 修改轮播图状态
            req('modifyHomePicState', {shufflId: shufflId, state: '2'}).then(data => {
              if (data.code === 0) {
                this.tableSelectRows.map(item => {
                  item.shufflId = '2'
                })
                this.$message.success('禁用成功')
                this.fetch()
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        }
      ],
      columnList: [
        {label: '排序', prop: 'sort'},
        {label: '图片路径', prop: 'photo', width: 350},
        {label: '状态', prop: 'state', distName: 'stateOptions'},
        {label: '预览', prop: 'watch'},
        {label: '有效期起', prop: 'timeBegin'},
        {label: '有效期止', prop: 'timeEnd'}
      ],
      tableData: [],
      stateOptions: [
        {label: '启用', value: '1'},
        {label: '禁用', value: '2'}
      ],
      innerStateOptions: [
        {label: '未发布', value: '0'},
        {label: '上架', value: '1'},
        {label: '下架', value: '2'}
      ],
      innerColumnList: [
        {label: '商品编码', prop: 'goodsCode', width: 200},
        {label: '商品名称', prop: 'goodsName'},
        {label: '商品状态', prop: 'state', distName: 'innerStateOptions'},
        {label: '一级分类', prop: 'classficationlOne'},
        {label: '二级分类', prop: 'classficationlTwo'}
      ],
      innerTableData: [],
      formRules: {
        photo: [
          { required: true, message: '请选择图片', trigger: 'change' }
        ],
        sort: [
          { required: true, message: '请输入排序', trigger: 'change' },
          { type: 'number', message: '请输入数字' }
        ],
        timeBegin: [
          { required: true, message: '请选择起始时间', trigger: 'change' }
        ],
        timeEnd: [
          { required: true, message: '请选择结束时间', trigger: 'change' }
        ],
        goodsName: [
          { required: true, message: '请选择商品', trigger: 'change' }
        ]
      },
      // 开始时间的限制
      startTimePickerOptions: {
        disabledDate: (value) => {
          if (this.dialogFormData.timeEnd !== '' && this.dialogFormData.timeEnd !== null) {
            return this.dialogFormData.timeEnd < value
          } else {
            return this.dialogFormData.timeEnd > value
          }
        }
      },
      // 结束时间的限制
      endTimePickerOptions: {
        disabledDate: (value) => {
          return this.dialogFormData.timeBegin > value
        }
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
      this.modifySelectAgain = false
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
    // 新增
    dialogConfirm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let timeBegin = moment(this.dialogFormData.timeBegin).format('YYYY-MM-DD')
          let timeEnd = moment(this.dialogFormData.timeEnd).format('YYYY-MM-DD')
          // if (timeEnd < timeBegin || timeEnd === timeBegin) {
          //   this.$message({type: 'error', message: '请选择正确的有效时间'})
          //   return false
          // }
          // 新增轮播图
          req('addHomePicData', {
            photo: this.dialogFormData.photo,
            sort: this.dialogFormData.sort,
            timeBegin: timeBegin,
            timeEnd: timeEnd,
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
          return false
        }
      })
    },
    // 查看图片
    watchImg (data) {
      window.open(data.photo)
    },
    // 转换字典
    filterDist (value, item) {
      if (item.distName) {
        return this[item.distName].filter(distItem => {
          return distItem.value === value
        })[0].label
      } else {
        return value
      }
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
    },
    // 嵌套的弹出框部分函数
    innerVisibleTrue () {
      this.innerVisible = true
    },
    innerSearch () {
      req('getGoodsData', {
        ...this.innerFormData,
        pageSize: this.innerPageInfo.pageSize,
        pageNum: this.innerPageInfo.pageNum
      }).then(data => {
        this.innerTableData = data.data.list
        this.innerPageInfo.pageNum = data.data.pageNum
        this.innerPageInfo.pageSize = data.data.pageSize
        this.innerPageInfo.total = data.data.total
      })
    },
    innerVisibleCancel () {
      this.innerVisible = false
    },
    innerVisibleSubmit () {
      if (this.innerTableSelectRows.length === 0) {
        this.$message.info('请选择一件轮播商品')
        return
      }
      if (this.innerTableSelectRows.length > 1) {
        this.$message.info('一次只能选择一件轮播商品')
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
