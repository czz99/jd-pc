import req from '../fetch/index.js'

const config = {
  // portExport: {
  //   url: '/api/media/stimulate/exportExcel',
  //   method: 'post',
  //   fileConfig: {
  //     type: 'file',
  //     fileName: '销售激励报表'
  //   }
  // },
  getMenuList: {
    url: 'webauth/menu/listMenus',
    method: 'post'
  },
  getMenuDetail: {
    url: 'webauth/menu/findMenuById',
    method: 'post'
  },
  addMenuData: {
    url: 'webauth/menu/saveMenu',
    method: 'post'
  },
  modifyMenuData: {
    url: 'webauth/menu/updateMenu',
    method: 'post'
  },
  deleteMenuData: {
    url: 'webauth/menu/deleteMenu',
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
