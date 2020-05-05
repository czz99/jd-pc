<template>
  <div>
    <!-- :model="formData"是传了一个名字为model,值为formData的对象给i-search -->
    <i-search ref="iSearch" :model="formData" @search="fetch" @reset="reset">
      <el-form-item label="用户名" prop="userName">
        <!-- 对象中未声明的test1,将会在访问时强制创建 -->
        <el-input v-model="formData.userName"></el-input>
      </el-form-item>
      <el-form-item label="用户账号" prop="userAcct">
        <el-input v-model="formData.userAcct"></el-input>
      </el-form-item>
      <el-form-item label="角色" prop="role">
        <el-select v-model="formData.role" placeholder="请选择">
          <el-option v-for="(item, index) in roleOptions" :key="index" :label="item.label" :value="item.value"></el-option>
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
            <el-form-item label="用户账号" prop="userAcct">
              <el-input v-model="dialogFormData.userAcct"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="用户姓名" prop="userName">
              <el-input v-model="dialogFormData.userName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="用户性别" prop="sex">
              <el-select v-model="dialogFormData.sex" placeholder="请选择">
                <el-option v-for="(item, index) in sexList" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="dialogFormData.phone"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="用户邮箱" prop="email">
              <el-input v-model="dialogFormData.email"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="身份证" prop="idCard">
              <el-input v-model="dialogFormData.idCard"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="用户密码" prop="userPwd">
              <el-input type="password" v-model="dialogFormData.userPwd"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="用户角色" prop="role">
              <el-select v-model="dialogFormData.role" placeholder="请选择">
                <el-option v-for="(item, index) in roleOptions" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="用户头像" prop="photo">
              <i-file v-model="dialogFormData.photo"></i-file>
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
import req from '@/api/user-manage.js'

export default {
  name: 'user-manage',
  components: {
    ISearch,
    ITable,
    IDialog,
    IFile
  },
  data () {
    return {
      // i-search部分
      formData: {
        userName: '',
        userAcct: '',
        role: ''
      },

      // i-dialig部分
      dialogVisible: false,
      dialogTitle: '',
      dialogWidth: '40%',
      dialogType: '',
      dialogFormData: {
        userAcct: '',
        userName: '',
        sex: '',
        phone: '',
        email: '',
        idCard: '',
        userPwd: '',
        role: '',
        photo: ''
      },
      version: '',
      userCode: '',
      userList: '',
      formRules: {
        userAcct: [
          { required: true, message: '请输入用户账号', trigger: 'change' },
          { min: 5, max: 12, message: '长度在 5 到 12 个字符', trigger: 'blur' },
          { pattern: /^[^\u4e00-\u9fa5]+$/, message: '不允许输入中文', trigger: 'change' },
          { pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '不允许输入空格等特殊符号', trigger: 'change' }
        ],
        userName: [
          { required: true, message: '请输入用户姓名', trigger: 'change' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请选择用户性别', trigger: 'change' }
        ],
        phone: [
          { required: true, message: '请输入手机号/电话号', trigger: 'change' },
          { pattern: /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/, message: '请输入合法手机号/电话号', trigger: 'blur' }
        ],
        userPwd: [
          { required: true, message: '请输入用户密码', trigger: 'change' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ],
        role: [
          { required: true, message: '请选择用户角色', trigger: 'change' }
        ],
        photo: [
          { required: true, message: '请选择用户头像', trigger: 'change' }
        ]
      },

      // i-table部分
      tableSelectRows: [],
      toolbar: [
        {
          btnName: '新增',
          type: 'primary',
          // 这里需要用箭头函数，因为箭头函数的this指的是它的上一层
          func: () => {
            this.dialogVisible = true
            this.dialogTitle = '新增用户'
            this.dialogType = 'add'
          }
        },
        {
          btnName: '修改',
          type: 'primary',
          func: () => {
            if (this.tableSelectRows.length === 0) {
              this.$message.info('请选择需要修改的一位用户')
              return
            }
            if (this.tableSelectRows.length > 1) {
              this.$message.info('一次只能修改一位用户')
              return
            }
            this.dialogVisible = true
            this.dialogTitle = '修改用户'
            this.dialogType = 'modify'
            this.getUserData()
          }
        },
        {
          btnName: '删除',
          type: 'primary',
          func: () => {
            if (this.tableSelectRows.length === 0) {
              this.$message.info('请选择需要删除的用户')
              return
            }
            this.$confirm('此操作将永久删除该数据,是否继续?').then(() => {
              this.userList = this.tableSelectRows.map(item => {
                return item.userCode
              }).toString()
              this.deleteUserData()
            }).catch(() => {})
          }
        }
      ],
      tableData: [],
      pageInfo: {
        pageNum: 1,
        pageSize: 5,
        total: 0
      },
      roleOptions: [
        {label: '管理员', value: '0'},
        {label: '店长', value: '1'}
      ],
      sexList: [
        {label: '女', value: '0'},
        {label: '男', value: '1'}
      ],
      columnList: [
        {label: '用户编号', prop: 'userCode', width: 200},
        {label: '用户账号', prop: 'userAcct'},
        {label: '用户姓名', prop: 'userName'},
        {label: '角色', prop: 'role', distName: 'roleOptions'},
        {label: '用户性别', prop: 'sex', distName: 'sexList'},
        {label: '手机号', prop: 'phone', width: 150},
        {label: '用户邮箱', prop: 'email', width: 180},
        {label: '身份证', prop: 'idCard', width: 200}
      ]
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
    // 查询详情
    getUserData () {
      req('getUserData', {userCode: this.tableSelectRows[0].userCode}).then(data => {
        this.dialogFormData.userAcct = data.data.userAcct
        this.dialogFormData.userName = data.data.userName
        this.dialogFormData.sex = data.data.sex
        this.dialogFormData.phone = data.data.phone
        this.dialogFormData.email = data.data.email
        this.dialogFormData.idCard = data.data.idCard
        this.dialogFormData.role = data.data.role
        this.dialogFormData.photo = data.data.photo
        this.version = data.data.version
        this.userCode = data.data.userCode
      })
    },
    // 删除
    deleteUserData () {
      req('deleteUserData', {userList: this.userList}).then(data => {
        if (data.code === 0) {
          this.$message.success('删除成功')
          this.fetch()
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 新增和修改
    dialogConfirm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.dialogType === 'add') {
            req('addUserData', {
              ...this.dialogFormData
            }).then(data => {
              if (data.code === 0) {
                this.$message({
                  type: 'success',
                  message: '新增成功'
                })
                this.fetch()
                this.$refs.form.resetFields()
                this.dialogVisible = false
              } else {
                this.$message({
                  type: 'error',
                  message: data.msg
                })
              }
            })
          } else if (this.dialogType === 'modify') {
            req('modifyUserData', {...this.dialogFormData, version: this.version, userCode: this.userCode}).then(data => {
              if (data.code === 0) {
                // 查询是否修改的是当前用户
                let currentUserCode = JSON.parse(sessionStorage.getItem('roleInfo')).userCode
                if (this.userCode === currentUserCode) {
                  this.$refs.form.resetFields()
                  this.dialogVisible = false
                  this.$message.success('修改成功,请重新登录~')
                  this.$router.push({path: '/login'})
                  sessionStorage.clear('userInfo')
                  sessionStorage.clear('roleInfo')
                } else {
                  this.$message.success('修改成功')
                  this.fetch()
                  this.$refs.form.resetFields()
                  this.dialogVisible = false
                }
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
