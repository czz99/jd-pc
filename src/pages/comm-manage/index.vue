<template>
  <div>
    <!-- :model="formData"是传了一个名字为model,值为formData的对象给i-search -->
    <i-search ref="iSearch" :model="formData" @search="fetch" @reset="reset">
      <el-form-item label="商品名称" prop="goodsName">
        <!-- 对象中未声明的test1,将会在访问时强制创建 -->
        <el-input v-model="formData.goodsName"></el-input>
      </el-form-item>
      <el-form-item label="商品状态" prop="state">
        <el-select v-model="formData.state" placeholder="全部">
          <el-option v-for="(item, index) in goodsStateOptions" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="广告词" prop="goodsIntroduce">
        <el-input v-model="formData.goodsIntroduce"></el-input>
      </el-form-item>
      <el-form-item label="出版社" prop="goodsPress">
        <el-input v-model="formData.goodsPress"></el-input>
      </el-form-item>
      <el-form-item label="作者" prop="goodsAuthor">
        <el-input v-model="formData.goodsAuthor"></el-input>
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
            <el-form-item label="商品名称" prop="goodsName">
              <el-input v-model="dialogFormData.goodsName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="书号" prop="isbn">
              <el-input v-model.number="dialogFormData.isbn"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="一级分类" prop="classficationlOne">
              <el-select v-model="dialogFormData.classficationlOne" placeholder="请选择" @click.native="clickClassifyOne">
                <el-option v-for="(item, index) in classifyOne" :key="index" :label="item.cateName" :value="item.cateCode"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="二级分类" prop="classficationlTwo">
              <el-select v-model="dialogFormData.classficationlTwo" placeholder="请选择" @click.native="clickClassifyTwo">
                <el-option v-for="(item, index) in classifyTwo" :key="index" :label="item.cateName" :value="item.cateCode"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="广告词" prop="goodsIntroduce">
              <el-input type="textarea" v-model="dialogFormData.goodsIntroduce"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="商品介绍" prop="goodsDetail">
              <el-input type="textarea" v-model="dialogFormData.goodsDetail"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="商家名称" prop="outsideName">
              <el-input v-model="dialogFormData.outsideName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="库存" prop="inventory">
              <el-input v-model.number="dialogFormData.inventory"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="成本价" prop="costPrice">
              <el-input v-model="dialogFormData.costPrice" oninput = "if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="在售价" prop="sellPrice">
              <el-input v-model="dialogFormData.sellPrice" oninput = "if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="作者" prop="goodsAuthor">
              <el-input v-model="dialogFormData.goodsAuthor"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="出版社" prop="goodsPress">
              <el-input v-model="dialogFormData.goodsPress"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="图片" prop="goodsPhoto">
              <i-file v-model="dialogFormData.goodsPhoto"></i-file>
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
import req from '@/api/comm-manage.js'

export default {
  name: 'comm-manage',
  components: {
    ISearch,
    ITable,
    IDialog,
    IFile
  },
  data () {
    return {
      formData: {
        goodsName: '',
        state: '',
        goodsIntroduce: '',
        goodsAuthor: '',
        goodsPress: ''
      },
      dialogTitle: '新增商品',
      dialogType: '',
      tableSelectRows: [],
      dialogFormData: {
        goodsName: '',
        isbn: '',
        classficationlOne: '',
        classficationlTwo: '',
        goodsIntroduce: '',
        goodsDetail: '',
        outsideName: '',
        inventory: '',
        costPrice: '',
        sellPrice: '',
        goodsPhoto: '',
        goodsAuthor: '',
        goodsPress: ''
      },
      version: '',
      goodsCode: '',
      classOneid: '',
      classTwoid: '',
      modifySelectAgain: false,
      dialogWidth: '45%',
      toolbar: [
        {
          btnName: '新增',
          type: 'primary',
          // 这里需要用箭头函数，因为箭头函数的this指的是它的上一层
          func: () => {
            // console.log(this.dialogVisible)
            this.dialogVisible = true
            this.dialogTitle = '新增商品'
            this.dialogType = 'add'
          }
        },
        {
          btnName: '修改',
          type: 'primary',
          func: () => {
            if (this.tableSelectRows.length === 0) {
              this.$message.info('请选择需要修改的一件商品')
              return
            }
            if (this.tableSelectRows.length > 1) {
              this.$message.info('一次只能修改一件商品')
              return
            }
            this.dialogVisible = true
            this.dialogTitle = '修改商品'
            this.dialogType = 'modify'
            // 查询详情
            req('getGoodsData', {goodsCode: this.tableSelectRows[0].goodsCode}).then(data => {
              // console.log(Number(data.data.isbn))
              this.dialogFormData.goodsName = data.data.goodsName
              this.dialogFormData.isbn = Number(data.data.isbn)
              this.dialogFormData.classficationlOne = data.data.classficationlOne
              this.dialogFormData.classficationlTwo = data.data.classficationlTwo
              this.dialogFormData.goodsIntroduce = data.data.goodsIntroduce
              this.dialogFormData.goodsDetail = data.data.goodsDetail
              this.dialogFormData.outsideName = data.data.outsideName
              this.dialogFormData.inventory = data.data.inventory
              this.dialogFormData.costPrice = Number(data.data.costPrice)
              this.dialogFormData.sellPrice = Number(data.data.sellPrice)
              this.dialogFormData.goodsAuthor = data.data.goodsAuthor
              this.dialogFormData.goodsPress = data.data.goodsPress
              this.dialogFormData.goodsPhoto = data.data.goodsPhoto
              this.version = data.data.version
              this.goodsCode = this.tableSelectRows[0].goodsCode
              this.classOneid = data.data.classficationlOneId
              this.classTwoid = data.data.classficationlTwoId
            })
          }
        },
        {
          btnName: '删除',
          type: 'primary',
          func: () => {
            if (this.tableSelectRows.length === 0) {
              this.$message.info('请选择需要删除的商品')
              return
            }
            this.$confirm('此操作将永久删除该数据,是否继续?').then(() => {
              let goodsCode = this.tableSelectRows.map(item => {
                return item.goodsCode
              }).toString()
              req('deleteGoodsData', {goodsCode: goodsCode}).then(data => {
                if (data.code === 0) {
                  this.$message.success('删除成功')
                  this.fetch()
                }
              })
            }).catch(() => {})
          }
        },
        {
          btnName: '上架',
          type: 'primary',
          func: () => {
            if (this.tableSelectRows.length === 0) {
              this.$message.info('请选择需要上架的商品')
              return
            }
            let goodsCode = this.tableSelectRows.map(item => {
              return item.goodsCode
            }).toString()
            req('modifyGoodsState', {goodsCode: goodsCode, state: '1'}).then(data => {
              if (data.code === 0) {
                this.tableSelectRows.map(item => {
                  item.goodsCode = '1'
                })
                this.$message.success('上架成功')
                this.fetch()
              }
            })
          }
        },
        {
          btnName: '下架',
          type: 'primary',
          func: () => {
            if (this.tableSelectRows.length === 0) {
              this.$message.info('请选择需要下架的商品')
              return
            }
            let goodsCode = this.tableSelectRows.map(item => {
              return item.goodsCode
            }).toString()
            req('modifyGoodsState', {goodsCode: goodsCode, state: '2'}).then(data => {
              if (data.code === 0) {
                this.tableSelectRows.map(item => {
                  item.goodsCode = '2'
                })
                this.$message.success('下架成功')
                this.fetch()
              }
            })
          }
        }
      ],
      goodsStateOptions: [
        {label: '未发布', value: '0'},
        {label: '在售', value: '1'},
        {label: '下架', value: '2'}
      ],
      classifyOne: [],
      classifyTwo: [],
      columnList: [
        {label: '商品名称', prop: 'goodsName', width: 120},
        {label: '成本价', prop: 'costPrice'},
        {label: '在售价', prop: 'sellPrice'},
        {label: '销量', prop: 'saleCnt'},
        {label: '一级分类', prop: 'classficationlOne'},
        {label: '二级分类', prop: 'classficationlTwo'},
        {label: '广告词', prop: 'goodsIntroduce', width: 200},
        {label: '商品介绍', prop: 'goodsDetail', width: 200},
        {label: '商品状态', prop: 'state', distName: 'goodsStateOptions'},
        {label: '上架时间', prop: 'shelve', width: 200},
        {label: '商家名称', prop: 'outsideName', width: 120},
        {label: '商品库存', prop: 'inventory'},
        {label: '书号', prop: 'isbn', width: 120},
        {label: '作者', prop: 'goodsAuthor', width: 120},
        {label: '出版社', prop: 'goodsPress', width: 120}
      ],
      tableData: [],
      formRules: {
        goodsName: [
          { required: true, message: '请输入商品名称', trigger: 'change' },
          { pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '不允许输入空格等特殊符号', trigger: 'change' }
        ],
        isbn: [
          { required: true, message: '请输入书号', trigger: 'change' },
          { type: 'number', message: '请输入数字' }
        ],
        classficationlOne: [
          { required: true, message: '请选择一级分类', trigger: 'change' }
        ],
        classficationlTwo: [
          { required: true, message: '请选择二级分类', trigger: 'change' }
        ],
        outsideName: [
          { required: true, message: '请输入商家名称', trigger: 'change' }
        ],
        inventory: [
          { required: true, message: '请输入商品库存', trigger: 'change' },
          { type: 'number', message: '请输入数字' }
        ],
        costPrice: [
          { required: true, message: '请输入成本价', trigger: 'change' }
        ],
        sellPrice: [
          { required: true, message: '请输入在售价', trigger: 'change' }
        ],
        goodsAuthor: [
          { required: true, message: '请输入作者', trigger: 'change' }
        ],
        goodsPress: [
          { required: true, message: '请输入出版社', trigger: 'change' }
        ],
        goodsPhoto: [
          { required: true, message: '请选择商品图片' }
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
    // 新增和修改
    dialogConfirm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.dialogType === 'add') {
            req('addGoodsData', {
              goodsName: this.dialogFormData.goodsName,
              isbn: this.dialogFormData.isbn,
              classficationlOneId: this.dialogFormData.classficationlOne,
              classficationlTwoId: this.dialogFormData.classficationlTwo,
              goodsIntroduce: this.dialogFormData.goodsIntroduce,
              goodsDetail: this.dialogFormData.goodsDetail,
              outsideName: this.dialogFormData.outsideName,
              inventory: this.dialogFormData.inventory,
              costPrice: this.dialogFormData.costPrice,
              sellPrice: this.dialogFormData.sellPrice,
              goodsPhoto: this.dialogFormData.goodsPhoto,
              goodsAuthor: this.dialogFormData.goodsAuthor,
              goodsPress: this.dialogFormData.goodsPress
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
              this.dialogFormData.classficationlOne = this.classOneid
              this.dialogFormData.classficationlTwo = this.classTwoid
            }
            req('modifyGoodsData', {
              goodsName: this.dialogFormData.goodsName,
              isbn: this.dialogFormData.isbn,
              classficationlOneId: this.dialogFormData.classficationlOne,
              classficationlTwoId: this.dialogFormData.classficationlTwo,
              goodsIntroduce: this.dialogFormData.goodsIntroduce,
              goodsDetail: this.dialogFormData.goodsDetail,
              outsideName: this.dialogFormData.outsideName,
              inventory: this.dialogFormData.inventory,
              costPrice: this.dialogFormData.costPrice,
              sellPrice: this.dialogFormData.sellPrice,
              goodsAuthor: this.dialogFormData.goodsAuthor,
              goodsPress: this.dialogFormData.goodsPress,
              goodsPhoto: this.dialogFormData.goodsPhoto,
              version: this.version,
              goodsCode: this.goodsCode
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
    // 获取一级分类
    clickClassifyOne () {
      req('getGoodsClassOne', {}).then(data => {
        if (data.code === 0) {
          this.classifyOne = data.data
        }
      })
    },
    // 获取二级分类
    clickClassifyTwo () {
      req('getGoodsClassTwo', {classificationlOneId: this.dialogFormData.classficationlOne}).then(data => {
        if (data.code === 0) {
          this.classifyTwo = data.data
          this.modifySelectAgain = true
        }
      })
    }
  },
  // 解决下拉框二次赋值带来的问题
  computed: {
    firstChange () {
      return this.dialogFormData.classficationlOne
    }
  },
  watch: {
    firstChange: {
      handler (value, oldValue) {
        if (this.modifySelectAgain === true && oldValue !== '') {
          this.dialogFormData.classficationlTwo = ''
        }
      }
    }
  }
}
</script>
