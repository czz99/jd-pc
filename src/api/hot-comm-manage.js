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
    url: 'pc/hot/listHotGoods',
    method: 'post'
  },
  addHotCommData: {
    url: 'pc/hot/saveHot',
    method: 'post'
  },
  getGoodsData: {
    url: 'pc/shuffl/findShufflGoods',
    method: 'post'
  },
  getHotCommDetailData: {
    url: 'pc/hot/findHotGoodsById',
    method: 'post'
  },
  modifyHotCommData: {
    url: 'pc/hot/updateHotGoodsById',
    method: 'post'
  },
  deleteHotCommData: {
    url: 'pc/hot/deleteHotGoods',
    method: 'post'
  },
  getShowNumber: {
    url: 'pc/hot/findHotShow',
    method: 'post'
  },
  setShowNumber: {
    url: 'pc/hot/updateHotGoodsShow',
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
