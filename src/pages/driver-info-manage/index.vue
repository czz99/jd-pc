<template>
  <div>
    <!-- :model="formData"是传了一个名字为model,值为formData的对象给i-search -->
    <i-search ref="iSearch" :model="formData" @search="fetch" @reset="reset">
      <el-row>
        <el-form-item label="司机编号" prop="userCode">
          <!-- 对象中未声明的test1,将会在访问时强制创建 -->
          <el-input v-model="formData.userCode"></el-input>
        </el-form-item>
        <el-form-item label="司机姓名" prop="userName">
          <el-input v-model="formData.userName"></el-input>
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

    <!-- 管理员 -->
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

    <!-- 店长端 -->
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
            <el-form-item label="司机姓名" prop="userName">
              <el-input v-model="dialogFormData.userName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="dialogFormData.phone"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="司机账号" prop="userAcct">
              <el-input v-model="dialogFormData.userAcct"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="密码" prop="password">
              <el-input type="password" v-model="dialogFormData.password"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="身份证号" prop="idCard">
              <el-input v-model="dialogFormData.idCard"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="用户头像" prop="photo">
              <i-file v-model="dialogFormData.photo"></i-file>
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
        </el-row>
      </el-form>
    </i-dialog>

    <el-dialog
      title="司机信息详情"
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
import IFile from '@/components/common/i-file.vue'
import req from '@/api/driver-info-manage.js'

export default {
  name: 'driver-info-manage',
  components: {
    ISearch,
    ITable,
    IDialog,
    IFile
  },
  data () {
    return {
      formData: {
        userCode: '',
        userName: '',
        provinceCode: '',
        cityCode: '',
        areaCode: ''
      },
      dialogTitle: '',
      dialogFormData: {
        userName: '',
        phone: '',
        photo: '',
        userAcct: '',
        provinceCode: '',
        cityCode: '',
        areaCode: '',
        password: '',
        idCard: ''
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
      tableSelectRows: [],
      toolbar: [
        {
          btnName: '详情',
          type: 'primary',
          func: () => {
            if (this.tableSelectRows.length === 0) {
              this.$message.info('请选择一个需要查询详情的司机')
              return
            }
            if (this.tableSelectRows.length > 1) {
              this.$message.info('一次只能查询一个司机详情')
              return
            }
            let userCode = this.tableSelectRows.map(item => {
              return item.userCode
            }).toString()
            this.detailDialogVisible = true
            req('getDriverDetailData', {userCode: userCode}).then(data => {
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
            this.dialogTitle = '新增司机'
            this.dialogType = 'add'
          }
        },
        {
          btnName: '修改',
          type: 'primary',
          func: () => {
            if (this.tableSelectRows.length === 0) {
              this.$message.info('请选择需要修改信息的一个司机')
              return
            }
            if (this.tableSelectRows.length > 1) {
              this.$message.info('一次只能修改一个司机信息')
              return
            }
            this.dialogVisible = true
            this.dialogTitle = '修改司机'
            this.dialogType = 'modify'
            // 查询详情
            req('getDriverDetailData', {userCode: this.tableSelectRows[0].userCode}).then(data => {
              this.dialogFormData.userName = data.data.userName
              this.dialogFormData.phone = data.data.phone
              this.dialogFormData.userAcct = data.data.userAcct
              this.dialogFormData.password = data.data.password
              this.dialogFormData.provinceCode = data.data.provinceName
              this.dialogFormData.cityCode = data.data.cityName
              this.dialogFormData.areaCode = data.data.areaName
              this.dialogFormData.idCard = data.data.idCard
              this.dialogFormData.photo = data.data.photo
              this.provinceId = data.data.provinceCode
              this.version = data.data.version
              this.userCode = this.tableSelectRows[0].userCode
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
              this.$message.info('请选择需要删除的司机')
              return
            }
            this.$confirm('此操作将永久删除该数据,是否继续?').then(() => {
              let userCode = this.tableSelectRows.map(item => {
                return item.userCode
              }).toString()
              req('deleteDriverData', {userCode: userCode}).then(data => {
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
              this.$message.info('请选择一个需要查询详情的司机')
              return
            }
            if (this.tableSelectRows.length > 1) {
              this.$message.info('一次只能查询一个司机详情')
              return
            }
            let userCode = this.tableSelectRows.map(item => {
              return item.userCode
            }).toString()
            this.detailDialogVisible = true
            req('getDriverDetailData', {userCode: userCode}).then(data => {
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
        {label: '司机编号', prop: 'userCode', width: 220},
        {label: '司机名称', prop: 'userName'},
        {label: '手机', prop: 'phone'},
        {label: '身份证', prop: 'idCard'},
        {label: '账号', prop: 'userAcct'}
      ],
      detailDiialogColumnList: [
        {label: '用户编号', prop: 'userCode', width: 200},
        {label: '用户账号', prop: 'userAcct'},
        {label: '用户姓名', prop: 'userName'},
        {label: '电话', prop: 'phone', width: 150},
        {label: '身份证号', prop: 'idCard', width: 200},
        {label: '所在省份编号', prop: 'provinceCode', width: 110},
        {label: '所在城市编号', prop: 'cityCode', width: 110},
        {label: '所在区编号', prop: 'areaCode', width: 110},
        {label: '所在省份', prop: 'provinceName', width: 110},
        {label: '所在城市', prop: 'cityName', width: 110},
        {label: '所在区', prop: 'areaName', width: 110}
      ],
      tableData: [],
      formRules: {
        userName: [
          { required: true, message: '请输入司机姓名', trigger: 'change' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入联系电话', trigger: 'change' },
          { pattern: /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/, message: '请输入合法手机号/电话号', trigger: 'blur' }
        ],
        userAcct: [
          { required: true, message: '请输入司机账号', trigger: 'change' },
          { min: 5, max: 12, message: '长度在 5 到 12 个字符', trigger: 'blur' },
          { pattern: /^[^\u4e00-\u9fa5]+$/, message: '不允许输入中文', trigger: 'change' },
          { pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '不允许输入空格等特殊符号', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ],
        idCard: [
          { required: true, message: '请输入身份证号', trigger: 'change' },
          { pattern: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, message: '请输入合法的身份证号', trigger: 'blur' }
        ],
        photo: [
          { required: true, message: '请选择用户头像', trigger: 'change' }
        ],
        provinceCode: [
          { required: true, message: '请选择所在省份', trigger: 'change' }
        ],
        cityCode: [
          { required: true, message: '请选择所在城市', trigger: 'change' }
        ],
        areaCode: [
          { required: true, message: '请选择所在区', trigger: 'change' }
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
            req('addSDriverData', {
              userName: this.dialogFormData.userName,
              phone: this.dialogFormData.phone,
              userAcct: this.dialogFormData.userAcct,
              password: this.dialogFormData.password,
              idCard: this.dialogFormData.idCard,
              photo: this.dialogFormData.photo,
              provinceCode: this.dialogFormData.provinceCode,
              cityCode: this.dialogFormData.cityCode,
              areaCode: this.dialogFormData.areaCode
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
            req('modifyDriverData', {
              userName: this.dialogFormData.userName,
              phone: this.dialogFormData.phone,
              userAcct: this.dialogFormData.userAcct,
              password: this.dialogFormData.password,
              idCard: this.dialogFormData.idCard,
              provinceCode: this.dialogFormData.provinceCode,
              cityCode: this.dialogFormData.cityCode,
              areaCode: this.dialogFormData.areaCode,
              version: this.version,
              userCode: this.userCode
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
      req('getDriverAddress', {parentCode: '0'}).then(data => {
        if (data.code === 0) {
          this.provinceOptions = data.data
        }
      })
    },
    clickCity () {
      req('getDriverAddress', {parentCode: this.formData.provinceCode}).then(data => {
        if (data.code === 0) {
          this.cityOptions = data.data
        }
      })
    },
    clickArea () {
      req('getDriverAddress', {parentCode: this.formData.cityCode}).then(data => {
        if (data.code === 0) {
          this.areaOptions = data.data
        }
      })
    },
    dialogClickProvince () {
      req('getDriverAddress', {parentCode: '0'}).then(data => {
        if (data.code === 0) {
          this.dialogProvinceOptions = data.data
        }
      })
    },
    dialogClickCity () {
      req('getDriverAddress', {parentCode: this.dialogFormData.provinceCode}).then(data => {
        if (data.code === 0) {
          this.dialogCityOptions = data.data
        }
      })
    },
    dialogClickArea () {
      req('getDriverAddress', {parentCode: this.dialogFormData.cityCode}).then(data => {
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
