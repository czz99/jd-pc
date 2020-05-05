<template>
  <div class="i-search">
    <!-- :model主要是为了配合表单验证,也是resetFields事件必须的 -->
    <el-form ref="form" :inline="true" :model="model">
      <slot></slot>

      <el-form-item>
        <el-button @click="search" type="primary">查询</el-button>
        <el-button @click="reset" type="primary">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'i-search',
  props: {
    model: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
    }
  },
  methods: {
    search () {
      // 点击将事件名为search的事件传到父组件
      this.$emit('search')
    },
    reset () {
      // 在此处将ref为form的el-form的内容清空
      // 注意:表单项el-form-item要添加prop属性，prop属性需要与input框绑定数据的最后名称一致，如v-model="formData.test1",  prop则应该为  prop="test1"
      this.$refs.form.resetFields()
      this.$emit('reset')
    }
  }
}
</script>

<style lang="scss" scoped>
.i-search {
  padding: 10px;

  .el-form {
    // deep需要有外层，deep下面的所有子层优先级都最高
    /deep/ .el-form-item {
      margin-bottom: 0;

      .el-form-item__content {
        .el-input {
          .el-input__inner {
            width: 200px;
          }
        }
      }

      .el-form-item__label {
        width: 70px;
      }
    }
  }
}
</style>
