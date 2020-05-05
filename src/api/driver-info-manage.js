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
  getTableData: {
    url: 'pc/driver/listDriver',
    method: 'post'
  },
  getDriverAddress: {
    url: 'pc/store/findStoreAddress',
    method: 'post'
  },
  addSDriverData: {
    url: 'pc/driver/saveDriver',
    method: 'post'
  },
  getDriverDetailData: {
    url: 'pc/driver/findDriverById',
    method: 'post'
  },
  modifyDriverData: {
    url: 'pc/driver/updateDriverById',
    method: 'post'
  },
  deleteDriverData: {
    url: 'pc/driver/deleteDriver',
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
