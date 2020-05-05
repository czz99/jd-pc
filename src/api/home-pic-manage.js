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
    url: 'pc/shuffl/listShuffl',
    method: 'post'
  },
  addHomePicData: {
    url: 'pc/shuffl/saveShuffl',
    method: 'post'
  },
  getGoodsData: {
    url: 'pc/shuffl/findShufflGoods',
    method: 'post'
  },
  deleteHomePicData: {
    url: 'pc/shuffl/deleteShuffl',
    method: 'post'
  },
  modifyHomePicState: {
    url: 'pc/shuffl/updateShufflState',
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
