import req from '../fetch/index.js'

const config = {
  // 查询用户列表接口
  getTableData: {
    url: 'pc/user/listUsers',
    method: 'post'
  },
  // 新增用户信息接口
  addUserData: {
    url: 'pc/user/saveUser',
    method: 'post'
  },
  // 查询用户详细信息接口
  getUserData: {
    url: 'pc/user/getUserByUserCode',
    method: 'post'
  },
  // 修改用户信息接口
  modifyUserData: {
    url: 'pc/user/updateUser',
    method: 'post'
  },
  // 删除用户信息接口
  deleteUserData: {
    url: 'pc/user/deleteUser',
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
