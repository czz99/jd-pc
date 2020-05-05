<template>
  <div>
    <!-- :model="formData"是传了一个名字为model,值为formData的对象给i-search -->
    <i-search ref="iSearch" :model="formData" @search="fetch" @reset="reset">
      <el-row>
        <el-form-item label="门店编号" prop="storeCode">
          <!-- 对象中未声明的test1,将会在访问时强制创建 -->
          <el-input v-model="formData.storeCode"></el-input>
        </el-form-item>
        <el-form-item label="门店名称" prop="storeName">
          <el-input v-model="formData.storeName"></el-input>
        </el-form-item>
        <el-form-item label="店长名称" prop="managerName">
          <el-input v-model="formData.managerName"></el-input>
        </el-form-item>
      </el-row>
      <el-form-item label="所在省份" prop="provinceCode">
        <el-select v-model="formData.provinceCode" placeholder="请选择" @click.native="clickProvince">
          <el-option v-for="(item, index) in provinceOptions" :key="index" :label="item.addName" :value="item.addCode"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所在城市" prop="cityCode">
        <el-select v-model="formData.cityCode" placeholder="请选择" @click.native="clickCity">
          <el-option v-for="(item, index) in cityOptions" :key="index" :label="item.addName" :value="item.addCode"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所在区" prop="areaCode">
        <el-select v-model="formData.areaCode" placeholder="请选择" @click.native="clickArea">
          <el-option v-for="(item, index) in areaOptions" :key="index" :label="item.addName" :value="item.addCode"></el-option>
        </el-select>
      </el-form-item>
    </i-search>

    <i-table
      v-show="userType === '0'"
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

    <i-table
      v-show="userType === '1'"
      :toolbar="dianZhangToolbar"
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

      <el-form :model="dialogFormData" ref="form" :rules="formRules" label-width="100px">
        <el-row>
          <el-col :span='12'>
            <el-form-item label="门店名称" prop="storeName">
              <el-input v-model="dialogFormData.storeName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="联系电话" prop="storePhone">
              <el-input v-model="dialogFormData.storePhone"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="店长编号" prop="managerCode">
              <el-input v-model="dialogFormData.managerCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="营业执照编码" prop="licenseCode">
              <el-input v-model.number="dialogFormData.licenseCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
             <el-form-item label="所在省份" prop="provinceCode">
              <el-select v-model="dialogFormData.provinceCode" placeholder="请选择" @click.native="dialogClickProvince" @change="changeOptions">
                <el-option v-for="(item, index) in dialogProvinceOptions" :key="index" :label="item.addName" :value="item.addCode"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="所在城市" prop="cityCode">
              <el-select v-model="dialogFormData.cityCode" placeholder="请选择" @click.native="dialogClickCity">
                <el-option v-for="(item, index) in dialogCityOptions" :key="index" :label="item.addName" :value="item.addCode"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="所在区" prop="areaCode">
              <el-select v-model="dialogFormData.areaCode" placeholder="请选择" @click.native="dialogClickArea">
                <el-option v-for="(item, index) in dialogAreaOptions" :key="index" :label="item.addName" :value="item.addCode"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="邀请码" prop="inviteCode">
              <el-input v-model.number="dialogFormData.inviteCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='16'>
            <el-form-item label="详细地址" prop="address">
              <el-input type="textarea" v-model="dialogFormData.address"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </i-dialog>

    <el-dialog
      title="门店信息详情"
      :visible.sync="detailDialogVisible">
      <el-table
        border
        :data="detailDiialogTableData">
        <el-table-column
          v-for="(item, index) in detailDiialogColumnList"
          :key="index"
          :label="item.label"
          :prop="item.prop"
          align="center"
          :width="item.width">
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ISearch from '@/components/common/i-search.vue'
import ITable from '@/components/common/i-table.vue'
import IDialog from '@/components/common/i-dialog.vue'
import req from '@/api/shop-info-manage.js'

export default {
  name: 'shop-info-manage',
  components: {
    ISearch,
    ITable,
    IDialog
  },
  data () {
    return {
      formData: {
        storeCode: '',
        storeName: '',
        managerName: '',
        provinceCode: '',
        cityCode: '',
        areaCode: ''
      },
      dialogTitle: '',
      dialogFormData: {
        storeName: '',
        storePhone: '',
        managerCode: '',
        licenseCode: '',
        provinceCode: '',
        cityCode: '',
        areaCode: '',
        address: '',
        inviteCode: ''
      },
      version: '',
      storeCode: '',
      provinceId: '',
      cityId: '',
      areaId: '',
      modifySelectAgain: false,
      dialogWidth: '40%',
      detailDialogVisible: false,
      detailDiialogTableData: [],
      toolbar: [
        {
          btnName: '详情',
          type: 'primary',
          func: () => {
            if (this.tableSelectRows.length === 0) {
              this.$message.info('请选择一个需要查询详情的门店')
              return
            }
            if (this.tableSelectRows.length > 1) {
              this.$message.info('一次只能查询一个门店详情')
              return
            }
            let storeCode = this.tableSelectRows.map(item => {
              return item.storeCode
            }).toString()
            this.detailDialogVisible = true
            req('getStoreDetailData', {storeCode: storeCode}).then(data => {
              this.detailDiialogTableData = Array(data.data)
            })
          }
        },
        {
          btnName: '新增',
          type: 'primary',
          // 这里需要用箭头函数，因为箭头函数的this指的是它的上一层
          func: () => {
            this.dialogVisible = true
            this.dialogTitle = '新增门店'
            this.dialogType = 'add'
          }
        },
        {
          btnName: '修改',
          type: 'primary',
          func: () => {
            if (this.tableSelectRows.length === 0) {
              this.$message.info('请选择需要修改信息的一个门店')
              return
            }
            if (this.tableSelectRows.length > 1) {
              this.$message.info('一次只能修改一个门店信息')
              return
            }
            this.dialogVisible = true
            this.dialogTitle = '修改门店'
            this.dialogType = 'modify'
            // 查询详情
            req('getStoreDetailData', {storeCode: this.tableSelectRows[0].storeCode}).then(data => {
              this.dialogFormData.storeName = data.data.storeName
              this.dialogFormData.storePhone = data.data.storePhone
              this.dialogFormData.managerCode = data.data.managerCode
              this.dialogFormData.licenseCode = Number(data.data.licenseCode)
              this.dialogFormData.provinceCode = data.data.provinceName
              this.dialogFormData.cityCode = data.data.cityName
              this.dialogFormData.areaCode = data.data.areaName
              this.dialogFormData.address = data.data.address
              this.dialogFormData.inviteCode = Number(data.data.inviteCode)
              this.version = data.data.version
              this.storeCode = this.tableSelectRows[0].storeCode
              this.provinceId = data.data.provinceCode
              this.cityId = data.data.cityCode
              this.areaId = data.data.areaCode
            })
          }
        },
        {
          btnName: '删除',
          type: 'primary',
          func: () => {
            if (this.tableSelectRows.length === 0) {
              this.$message.info('请选择需要删除的门店')
              return
            }
            this.$confirm('此操作将永久删除该数据,是否继续?').then(() => {
              let storeCode = this.tableSelectRows.map(item => {
                return item.storeCode
              }).toString()
              req('deleteStoreData', {storeCode: storeCode}).then(data => {
                if (data.code === 0) {
                  this.$message.success('删除成功')
                  this.fetch()
                } else {
                  this.$message.error(data.msg)
                }
              })
            }).catch(() => {})
          }
        }
      ],
      dianZhangToolbar: [
        {
          btnName: '详情',
          type: 'primary',
          func: () => {
            if (this.tableSelectRows.length === 0) {
              this.$message.info('请选择一个需要查询详情的门店')
              return
            }
            if (this.tableSelectRows.length > 1) {
              this.$message.info('一次只能查询一个门店详情')
              return
            }
            let storeCode = this.tableSelectRows.map(item => {
              return item.storeCode
            }).toString()
            this.detailDialogVisible = true
            req('getStoreDetailData', {storeCode: storeCode}).then(data => {
              this.detailDiialogTableData = Array(data.data)
            })
          }
        }
      ],
      provinceOptions: [],
      cityOptions: [],
      areaOptions: [],
      dialogProvinceOptions: [],
      dialogCityOptions: [],
      dialogAreaOptions: [],
      columnList: [
        {label: '门店编号', prop: 'storeCode', width: 220},
        {label: '门店名称', prop: 'storeName'},
        {label: '联系电话', prop: 'storePhone'},
        {label: '详细地址', prop: 'address', width: 220},
        {label: '店长名称', prop: 'managerName'},
        {label: '邀请码', prop: 'inviteCode'},
        {label: '门店账号', prop: 'managerAcct'}
      ],
      detailDiialogColumnList: [
        {label: '门店编号', prop: 'storeCode', width: 220},
        {label: '门店名称', prop: 'storeName'},
        {label: '联系电话', prop: 'storePhone', width: 150},
        {label: '店长编号', prop: 'managerCode', width: 220},
        {label: '营业执照编号', prop: 'licenseCode', width: 220},
        {label: '所在省份编号', prop: 'provinceCode', width: 110},
        {label: '所在城市编号', prop: 'cityCode', width: 110},
        {label: '所在区编号', prop: 'areaCode', width: 110},
        {label: '详细地址', prop: 'address', width: 220},
        {label: '邀请码', prop: 'inviteCode', width: 110},
        {label: '所在省份', prop: 'provinceName', width: 110},
        {label: '所在城市', prop: 'cityName', width: 110},
        {label: '所在区', prop: 'areaName', width: 110}
      ],
      tableData: [],
      tableSelectRows: [],
      formRules: {
        storeName: [
          { required: true, message: '请输入门店名称', trigger: 'change' },
          { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' },
          { pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '不允许输入空格等特殊符号', trigger: 'change' }
        ],
        storePhone: [
          { required: true, message: '请输入联系电话', trigger: 'change' },
          { pattern: /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/, message: '请输入合法手机号/电话号', trigger: 'blur' }
        ],
        managerCode: [
          { required: true, message: '请输入店长编号', trigger: 'change' }
        ],
        licenseCode: [
          { required: true, message: '请输入营业执照编码', trigger: 'change' },
          { type: 'number', message: '请输入数字' }
        ],
        provinceCode: [
          { required: true, message: '请选择所在省份', trigger: 'change' }
        ],
        cityCode: [
          { required: true, message: '请选择所在城市', trigger: 'change' }
        ],
        areaCode: [
          { required: true, message: '请选择所在区', trigger: 'change' }
        ],
        address: [
          { required: true, message: '请输入详细地址', trigger: 'change' }
        ],
        inviteCode: [
          { required: true, message: '请输入邀请码', trigger: 'change' },
          { type: 'number', message: '请输入数字' }
        ]
      },
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
    dialogConfirm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.dialogType === 'add') {
            req('addStoreData', {
              storeName: this.dialogFormData.storeName,
              storePhone: this.dialogFormData.storePhone,
              managerCode: this.dialogFormData.managerCode,
              licenseCode: this.dialogFormData.licenseCode,
              provinceCode: this.dialogFormData.provinceCode,
              cityCode: this.dialogFormData.cityCode,
              areaCode: this.dialogFormData.areaCode,
              address: this.dialogFormData.address,
              inviteCode: this.dialogFormData.inviteCode
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
          } else if (this.dialogType === 'modify') {
            if (this.modifySelectAgain === false) {
              this.dialogFormData.provinceCode = this.provinceId
              this.dialogFormData.cityCode = this.cityId
              this.dialogFormData.areaCode = this.areaId
            }
            req('modifyStoreData', {
              storeName: this.dialogFormData.storeName,
              storePhone: this.dialogFormData.storePhone,
              managerCode: this.dialogFormData.managerCode,
              licenseCode: this.dialogFormData.licenseCode,
              provinceCode: this.dialogFormData.provinceCode,
              cityCode: this.dialogFormData.cityCode,
              areaCode: this.dialogFormData.areaCode,
              address: this.dialogFormData.address,
              inviteCode: this.dialogFormData.inviteCode,
              version: this.version,
              storeCode: this.storeCode
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
    changeOptions (data) {
      this.modifySelectAgain = true
    },
    clickProvince () {
      req('getStoreAddress', {parentCode: '0'}).then(data => {
        if (data.code === 0) {
          this.provinceOptions = data.data
        }
      })
    },
    clickCity () {
      req('getStoreAddress', {parentCode: this.formData.provinceCode}).then(data => {
        if (data.code === 0) {
          this.cityOptions = data.data
        }
      })
    },
    clickArea () {
      req('getStoreAddress', {parentCode: this.formData.cityCode}).then(data => {
        if (data.code === 0) {
          this.areaOptions = data.data
        }
      })
    },
    dialogClickProvince () {
      req('getStoreAddress', {parentCode: '0'}).then(data => {
        if (data.code === 0) {
          this.dialogProvinceOptions = data.data
        }
      })
    },
    dialogClickCity () {
      req('getStoreAddress', {parentCode: this.dialogFormData.provinceCode}).then(data => {
        if (data.code === 0) {
          this.dialogCityOptions = data.data
        }
      })
    },
    dialogClickArea () {
      req('getStoreAddress', {parentCode: this.dialogFormData.cityCode}).then(data => {
        if (data.code === 0) {
          this.dialogAreaOptions = data.data
        }
      })
    }
  },
  // 解决下拉框二次赋值带来的问题
  computed: {
    provinceChange () {
      return this.formData.provinceCode
    },
    cityChange () {
      return this.formData.cityCode
    },
    dialogProvinceChange () {
      return this.dialogFormData.provinceCode
    },
    dialogCityChange () {
      return this.dialogFormData.cityCode
    },
    userType () {
      // console.log(JSON.parse(sessionStorage.getItem('roleInfo')).role)
      return JSON.parse(sessionStorage.getItem('roleInfo')).role
    }
  },
  watch: {
    provinceChange: {
      handler (value, oldValue) {
        if (oldValue !== '') {
          this.formData.cityCode = ''
          this.formData.areaCode = ''
        }
      }
    },
    cityChange: {
      handler (value, oldValue) {
        if (oldValue !== '') {
          this.formData.areaCode = ''
        }
      }
    },
    dialogProvinceChange: {
      handler (value, oldValue) {
        if (this.modifySelectAgain === true && oldValue !== '') {
          this.dialogFormData.cityCode = ''
          this.dialogFormData.areaCode = ''
        }
      }
    },
    dialogCityChange: {
      handler (value, oldValue) {
        if (this.modifySelectAgain === true && oldValue !== '') {
          this.dialogFormData.areaCode = ''
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form {
  .el-col {
    .el-form-item {
      /deep/ .el-form-item__label {
        width: 110px !important;
      }
      /deep/ .el-form-item__content {
        margin-left: 110px !important;
        .el-input {
          .el-input__inner {
          }
        }
      }
    }
  }
}

.i-search {
  .el-form-item {
    margin-right: 12px;
  }
}
</style>
