<template>
  <div>
    <el-container>
      <el-header height="80px">
        <router-link to="/">行走书店管理系统</router-link>

        <div class="user-info">
          <el-popover
            placement="top">
            <el-button size="mini" type="text" @click="signOut">退出登录</el-button>
            <div slot="reference">
              <img :src="userInfo.photo" alt="">
              <span>{{userInfo.userAcct}}</span>
            </div>
          </el-popover>
        </div>
      </el-header>

      <el-container>
        <el-aside width="200px" height="10px">
          <el-menu @select="handlerSelect">
            <el-menu-item v-for="(item, index) in menuList" :index="item.menuUrl" :key="index">
              <span>{{item.menuName}}</span>
            </el-menu-item>
          </el-menu>
        </el-aside>

        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>

    </el-container>
  </div>
</template>

<script>
import req from '@/api/home.js'

export default {
  name: 'home',
  data () {
    return {
      userInfo: {
        photo: require('../assets/u18.jpg'),
        userAcct: 'admin',
        role: ''
      },
      menuList: [
        {menuName: '', menuUrl: ''}
      ]
    }
  },
  mounted () {
    // 顶部用户信息
    let role = JSON.parse(sessionStorage.getItem('roleInfo')).role
    let userAcct = JSON.parse(sessionStorage.getItem('roleInfo')).userAcct
    let photo = JSON.parse(sessionStorage.getItem('roleInfo')).photo
    this.userInfo.userAcct = userAcct
    this.userInfo.photo = photo
    this.userInfo.role = role

    // 根据不同用户跳转不同页面(管理员 店长)
    if (role === '0') {
      this.$router.push({path: '/user-manage'})
    } else if (role === '1') {
      this.$router.push({path: '/client-manage'})
    }

    // 根据用户获取菜单列表
    req('getMenuList', {role: role}).then(data => {
      this.menuList = data.data
    })
  },
  methods: {
    // 两个参数都是el-menu-item 中的index值,第一个是字符串类型,第二个是数组类型(可不写)
    handlerSelect (key, path) {
      if (key !== this.$route.path) {
        this.$router.replace({path: key})
        // this.$router.push({path: key, query: {}})
      }
    },
    signOut () {
      this.$router.push({path: '/login'})
      sessionStorage.clear('userInfo')
      sessionStorage.clear('roleInfo')
    }
  }
}
</script>

<style lang="scss" scoped>
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgb(242,242,242);
  padding: 0 50px;
  border-bottom: 1px solid rgb(204, 204, 204);

  .router-link-active {
    font-size: 28px;
    color: #409EFF;
    text-decoration: none;
  }

  .user-info .el-popover__reference{
    display: flex;
    align-items: center;
    height: 100%;
    color: #409EFF;

    img {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      margin-right: 20px;
    }
  }
}

.el-menu-item {
  height: 50px;
  font-size: 13px;
  text-align: center;
}

.el-main {
  padding: 0;
}
</style>
