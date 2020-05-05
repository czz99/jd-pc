<template>
  <div class="container">
    <el-container>
        <el-aside>
          <div>
            <i-table
              :toolbar="toolbar"
              :tableData="tableData"
              :selectionShow="false">
            </i-table>
          </div>
        <el-tree :data="treeData" :props="defaultProps" node-key="menuId" @node-click="handleNodeClick">
          </el-tree>
        </el-aside>

        <el-main>
          <div class="menuDetail">分类详情</div>
          <el-form :model="formData" label-width="100px">
            <el-row>
              <el-col :span="8">
                <el-form-item label="分类名称">
                  <el-input v-model="formData.cateName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item label="备注">
                  <el-input v-model="formData.cateNote"></el-input>
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
            <el-form-item label="分类名称" prop="cateName">
              <el-input v-model="dialogFormData.cateName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='24'>
            <el-form-item label="备注" prop="cateNote">
              <el-input v-model="dialogFormData.cateNote"></el-input>
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
import req from '@/api/comm-classify-manage.js'

export default {
  name: 'comm-classify-manage',
  components: {
    ITable,
    IDialog
  },
  data () {
    return {
      formData: {},
      dialogTitle: '',
      dialogFormData: {
        cateName: '',
        cateNote: ''
      },
      dialogWidth: '25%',
      dialogType: '',
      toolbar: [
        {
          btnName: '新增',
          type: 'primary',
          // 这里需要用箭头函数，因为箭头函数的this指的是它的上一层
          func: () => {
            if (this.formData.level === 2) {
              this.$message.info('二级分类无法新增子类，请选择一级分类或不选分类进行新增')
              return
            }
            this.dialogVisible = true
            this.dialogTitle = '新增分类'
            this.dialogType = 'add'
          }
        },
        {
          btnName: '修改',
          type: 'primary',
          func: () => {
            if (!this.formData.level) {
              this.$message.info('请选择需要修改的分类')
              return
            }
            if (this.formData.level) {
              this.dialogVisible = true
              this.dialogTitle = '修改分类'
              this.dialogType = 'modify'
              req('getCommClassifyDetail', {cateCode: this.formData.cateCode}).then(data => {
                this.dialogFormData.cateName = data.data.cateName
                this.dialogFormData.cateNote = data.data.cateNote
              })
            }
          }
        },
        {
          btnName: '删除',
          type: 'primary',
          func: () => {
            if (!this.formData.level) {
              this.$message.info('请选择需要删除的分类')
              return
            }
            this.$confirm('此操作将永久删除该数据,是否继续?').then(() => {
              req('deleteCommClassifyData', {cateCode: this.formData.cateCode}).then(data => {
                if (data.code === 0) {
                  this.$message.success('删除成功')
                  this.fetch()
                  // 清空formData数据
                  for (var key in this.formData) {
                    delete this.formData[key]
                  }
                } else {
                  this.$message.error(data.msg)
                }
              })
            }).catch(() => {})
          }
        },
        {
          btnName: '刷新',
          type: 'primary',
          func: () => {
            this.fetch()
            // 清空formData数据
            for (var key in this.formData) {
              delete this.formData[key]
            }
          }
        }
      ],
      formRules: {
        cateName: [
          { required: true, message: '请输入分类名称', trigger: 'change' }
        ]
      },
      tableData: [],
      pageInfo: {
        pageNum: 1,
        pageSize: 5,
        total: 0
      },
      dialogVisible: false,
      treeData: [],
      defaultProps: {
        label: 'cateOneName',
        children: 'twoList'
      }
    }
  },
  mounted () {
    this.fetch()
  },
  methods: {
    fetch () {
      req('getCommClassifyList', {}).then(data => {
        this.treeData = data.data
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
            // 选中了一级分类，要新增二级分类
            if (this.formData.cateCodeParent && this.formData.level === 1) {
              req('addCommClassifyData', {...this.dialogFormData, level: '2', cateCodeParent: this.formData.cateCode}).then(data => {
                if (data.code === 0) {
                  this.$message.success('新增成功')
                  this.fetch()
                  this.$refs.form.resetFields()
                  this.dialogVisible = false
                  // 清空formData数据
                  for (var key in this.formData) {
                    delete this.formData[key]
                  }
                } else {
                  this.$message.error(data.msg)
                }
              })
            } else {
              // 没选择分类，直接新增一级分类
              req('addCommClassifyData', {...this.dialogFormData, level: '1', cateCodeParent: '0'}).then(data => {
                if (data.code === 0) {
                  this.$message.success('新增成功')
                  this.fetch()
                  this.$refs.form.resetFields()
                  this.dialogVisible = false
                } else {
                  this.$message.error(data.msg)
                }
              })
            }
          } else if (this.dialogType === 'modify') {
            req('modifyCommClassifyData', {...this.dialogFormData, cateCode: this.formData.cateCode, version: this.formData.version}).then(data => {
              if (data.code === 0) {
                this.$message.success('修改成功')
                this.fetch()
                this.$refs.form.resetFields()
                this.dialogVisible = false
                // 清空formData数据
                for (var key in this.formData) {
                  delete this.formData[key]
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
    handleNodeClick (node) {
      req('getCommClassifyDetail', {cateCode: node.cateOneCode}).then(data => {
        this.formData = data.data
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

    .el-tree {
      padding-left: 30px;
      padding-top: 20px;
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
