<template>
  <div class="container">
    <el-container>
        <el-aside width="300px">
          <div height="80px">
            <i-table
              :toolbar="toolbar"
              :tableData="tableData"
              :selectionShow="false">
            </i-table>
          </div>
          <el-menu>
            <el-menu-item class="menu-box-li" v-for="(item, index) in menuList" :key="index" @click="menuDetail(item)" :index="item.menuCode">
              {{item.menuName}}
            </el-menu-item>
          </el-menu>
        </el-aside>

        <el-main>
          <div class="menuDetail">菜单详情</div>
          <el-form :model="formData" label-width="100px">
            <el-row>
              <el-col :span="8">
                <el-form-item label="菜单名称">
                  <el-input v-model="formData.menuName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item label="菜单路由">
                  <el-input v-model="formData.menuUrl"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="备注">
                  <el-input v-model="formData.menuNote"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-main>
    </el-container>

    <i-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      :width="dialogWidth"
      @dialog-before-close="dialogBeforeClose"
      @dialog-cancel="dialogCancel"
      @dialog-confirm="dialogConfirm">

      <el-form :model="dialogFormData" ref="form" :rules="formRules" label-width="100px">
        <el-row>
          <el-col :span='24'>
            <el-form-item label="名称" prop="menuName">
              <el-input v-model="dialogFormData.menuName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='24'>
            <el-form-item label="路径" prop="menuUrl">
              <el-input v-model="dialogFormData.menuUrl"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='24'>
            <el-form-item label="备注" prop="menuNote">
              <el-input v-model="dialogFormData.menuNote"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </i-dialog>
  </div>
</template>

<script>
import ITable from '@/components/common/i-table.vue'
import IDialog from '@/components/common/i-dialog.vue'
import req from '@/api/menu-manage.js'

export default {
  name: 'menu-manage',
  components: {
    ITable,
    IDialog
  },
  data () {
    return {
      formData: {
        menuName: '',
        menuUrl: '',
        menuNote: ''
      },
      dialogTitle: '',
      dialogType: '',
      dialogFormData: {
        menuName: '',
        menuUrl: '',
        menuNote: ''
      },
      dialogWidth: '25%',
      toolbar: [
        {
          btnName: '新增',
          type: 'primary',
          // 这里需要用箭头函数，因为箭头函数的this指的是它的上一层
          func: () => {
            this.dialogVisible = true
            this.dialogTitle = '新增菜单'
            this.dialogType = 'add'
          }
        },
        {
          btnName: '修改',
          type: 'primary',
          func: () => {
            if (!this.checked) {
              this.$message.info('请选择需要修改的菜单项')
              return
            }
            if (this.checked) {
              this.dialogVisible = true
              this.dialogTitle = '修改菜单'
              this.dialogType = 'modify'
              req('getMenuDetail', {menuCode: this.checked}).then(data => {
                // console.log(data)
                this.dialogFormData.menuName = data.data.menuName
                this.dialogFormData.menuUrl = data.data.menuUrl
                this.dialogFormData.menuNote = data.data.menuNote
              })
            }
          }
        },
        {
          btnName: '删除',
          type: 'primary',
          func: () => {
            if (!this.checked) {
              this.$message.info('请选择需要删除的菜单项')
              return
            }
            if (this.checked) {
              this.$confirm('此操作将永久删除该数据,是否继续?').then(() => {
                req('deleteMenuData', {menuCode: this.checked}).then(data => {
                  if (data.code === 0) {
                    this.$message.success('删除成功')
                    this.fetch()
                    this.formData.menuName = ''
                    this.formData.menuUrl = ''
                    this.formData.menuNote = ''
                    this.checked = ''
                  } else {
                    this.$message.error(data.msg)
                  }
                })
              }).catch(() => {})
            }
          }
        },
        {
          btnName: '刷新',
          type: 'primary',
          func: () => {
            this.fetch()
            this.formData.menuName = ''
            this.formData.menuUrl = ''
            this.formData.menuNote = ''
            this.checked = ''
          }
        }
      ],
      formRules: {
        menuName: [
          { required: true, message: '请输入活动名称', trigger: 'change' }
        ]
      },
      tableData: [],
      dialogVisible: false,
      menuList: [
        {
          menuName: ''
        }
      ],
      checked: ''
    }
  },
  mounted () {
    this.fetch()
  },
  methods: {
    fetch () {
      req('getMenuList', {}).then(data => {
        this.menuList = data.data
      })
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
            req('addMenuData', {...this.dialogFormData}).then(data => {
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
            req('modifyMenuData', {...this.dialogFormData, menuCode: this.checked}).then(data => {
              if (data.code === 0) {
                this.$message.success('修改成功')
                this.fetch()
                this.$refs.form.resetFields()
                this.dialogVisible = false
                this.formData.menuName = ''
                this.formData.menuUrl = ''
                this.formData.menuNote = ''
                this.checked = ''
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
    menuDetail (item) {
      req('getMenuDetail', {menuCode: item.menuCode}).then(data => {
        this.checked = data.data.menuCode
        this.formData.menuName = data.data.menuName
        this.formData.menuUrl = data.data.menuUrl
        this.formData.menuNote = data.data.menuNote
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 500px;
  margin: 10px 20px;
  border: 1px solid rgb(204, 204, 204);
  .el-aside {
    width: 300px;
    height: 500px;
    border-right: 1px solid rgb(204, 204, 204);
    .i-table {
      border-bottom: 1px solid rgb(204, 204, 204);
      display: flex;
      align-items: center;
      justify-content: space-between;

      /deep/ .btn-list {
        margin: 0px !important;
      }
    }

    .el-menu {
      .el-menu-item {
        height: 30px;
        line-height: 30px;
        font-size: 13px;
        padding-left: 50px !important;
      }
    }
  }

  .el-main {
    padding: 0px;
    .menuDetail {
      width: 800px;
      height: 50px;
      line-height: 50px;
      padding-left: 30px;
      border-right: 1px solid rgb(204, 204, 204);
      border-bottom: 1px solid rgb(204, 204, 204);
    }

    .el-form {
      // deep需要有外层，deep下面的所有子层优先级都最高
      /deep/ .el-form-item {
        margin-bottom: 0;

        .el-form-item__content {
          .el-input {
            .el-input__inner {
              width: 160px;
            }
          }
        }

        .el-form-item__label {
          width: 80px;
        }
      }
    }
  }
}
</style>
