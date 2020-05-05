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
    url: 'pc/store/listStore',
    method: 'post'
  },
  getStoreAddress: {
    url: 'pc/store/findStoreAddress',
    method: 'post'
  },
  addStoreData: {
    url: 'pc/store/saveStore',
    method: 'post'
  },
  getStoreDetailData: {
    url: 'pc/store/findStoreById',
    method: 'post'
  },
  modifyStoreData: {
    url: 'pc/store/updateStoreById',
    method: 'post'
  },
  deleteStoreData: {
    url: 'pc/store/deleteStore',
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
