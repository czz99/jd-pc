<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="visible"
      :width="width"
      :before-close="dialogBeforeClose"
      @close="dialogClose"
      :append-to-body="appendToBody">

      <slot></slot>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogCancel">取消</el-button>
        <el-button @click="dialogConfirm" type="primary">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'i-dialog',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '50%'
    },
    appendToBody: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      visible: false
    }
  },
  methods: {
    dialogClose () {
      this.visible = false // 加一句比较稳
      this.$emit('input', this.visible) // 一个组件上的 v-model （此处指index中的i-dialog中的v-model="dialogVisible"）默认会利用名为 value 的 prop 和名为 input 的事件
    },
    dialogBeforeClose () {
      this.$emit('dialog-before-close')
      this.visible = false
    },
    dialogCancel () {
      this.$emit('dialog-cancel')
    },
    dialogConfirm () {
      this.$emit('dialog-confirm')
    }
  },
  watch: {
    value: {
      handler (value) {
        this.visible = value
      },
      deep: true
    }
  }
}
</script>
