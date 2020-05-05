<template>
  <div>
    <div class="file-box">
      <el-button @click="addImg" type="primary">选择</el-button>
      <span v-show="imgPath">{{imgPath}}</span>
    </div>
    <input type="file" id="file" ref="file" @change="fileChange($event)" style="display:none">
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'i-file',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      imgPath: ''
    }
  },
  watch: {
    value: {
      handler (value) {
        this.imgPath = value

        if (!value) {
          document.getElementById('file').value = ''
        }
      },
      deep: true
    }
  },
  methods: {
    addImg () {
      this.$refs.file.click()
    },
    fileChange (event) {
      if (event.target.files.length) {
        let form = new FormData()
        let imageFile = document.getElementById('file').files[0]
        // console.log('123', imageFile)
        form.append('file', imageFile)
        form.append('access_token', JSON.parse(sessionStorage.getItem('userInfo')).access_token)
        axios({
          method: 'post',
          url: 'http://112.74.100.14:8080/pc/tengxun/uploadImage', // http://112.74.100.14:8080 http://2r991680e8.qicp.vip
          data: form,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(data => {
          // console.log(data)
          this.imgPath = data.data.data
          this.$emit('input', this.imgPath)
        })
      } else {
        this.imgPath = ''
        this.$eimt('input', this.imgPath)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.file-box {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space:nowrap;
}
</style>
