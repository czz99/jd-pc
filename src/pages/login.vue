<template>
  <div class="container">
    <div class="loginItem">
      <div>请登录</div>
      <el-form :model="formData" :rules="rules" ref="form" class="demo-ruleForm">
        <el-form-item  prop="username">
          <el-input type="text" v-model="formData.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item  prop="password">
          <el-input type="password" v-model="formData.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login">登&nbsp;&nbsp;&nbsp;录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
const qs = require('qs')

export default {
  name: 'login',
  data () {
    return {
      formData: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    login () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          axios({
            method: 'post',
            url: 'http://112.74.100.14:8080/uaa/auth/form', // http://112.74.100.14:8080 http://2r991680e8.qicp.vip
            data: qs.stringify(this.formData), // qs.stringify转换成查询字符串
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded' // 请求头，form的post的请求
            }
          }).then(data => { // 参数data为请求成功返回的数据
            if (data.data.code === 0) {
              this.$message.success('登录成功')

              sessionStorage.setItem('userInfo', JSON.stringify(data.data.data)) // 存值，JSON.stringify()的作用是将 JavaScript 对象转换为 JSON 字符串
              // this.$router.push({path: '/home'})
              this.getUserInfo(data.data.data.access_token)
            } else {
              this.$message.error(data.data.msg)
            }
          })
        } else {
          return false
        }
      })
    },
    getUserInfo (token) {
      axios({
        method: 'post',
        url: 'http://112.74.100.14:8080/pc/user/information', // http://112.74.100.14:8080 http://2r991680e8.qicp.vip
        data: qs.stringify({access_token: token}), // qs.stringify转换成查询字符串
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded' // 请求头，form的post的请求
        }
      }).then(data => { // 参数data为请求成功返回的数据
        if (data.data.code === 0) {
          sessionStorage.setItem('roleInfo', JSON.stringify(data.data.data)) // 存值，JSON.stringify()的作用是将 JavaScript 对象转换为 JSON 字符串
          if (data.data.data.role === '0') {
            this.$router.push({path: '/user-manage'})
          } else {
            this.$router.push({path: '/client-manage'})
          }
        } else {
          this.$message.error(data.data.msg)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  // width: 1200px;
  // height: 580px;
  width: 100%;
  height: 100%;
  background:url('../assets/u0.jpg') no-repeat;
  background-size:100% 100%;

  .loginItem {
    position: absolute;
    right: 50px;
    top: 80px;
    width: 278px;
    height: 249px;
    background: rgba(255, 255, 255, 0.1);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    div:first-child {
      font-weight: 400;
      font-size: 16px;
      color: #999999;
      height: 50px;
      line-height: 50px;
    }

    /deep/ .el-form{
      .el-form-item {
        margin-bottom: 15px;
        .el-form-item__content {
          text-align: center;

          .el-input {
            .el-input__inner {
              border-radius: 10px;
              outline: none;
              width: 230px;
              border: none;
              height: 30px;
              line-height: 30px;
              font-size: 14px;
            }
          }

          .el-button {
            width: 117px;
            height: 34px;
            font-size: 13px;
            background: inherit;
            background-color: rgba(22, 155, 213, 1);
            border: none;
            border-radius: 5px;
            color: #fff;
          }
        }
      }
    }
  }
}
</style>
