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
    url: 'pc/goods/listGoods',
    method: 'post'
  },
  addGoodsData: {
    url: 'pc/goods/saveGoods',
    method: 'post'
  },
  getGoodsData: {
    url: 'pc/goods/findGoodsById',
    method: 'post'
  },
  modifyGoodsData: {
    url: 'pc/goods/updateGoods',
    method: 'post'
  },
  deleteGoodsData: {
    url: 'pc/goods/deleteGoods',
    method: 'post'
  },
  modifyGoodsState: {
    url: 'pc/goods/updateGoodsState',
    method: 'post'
  },
  getGoodsClassOne: {
    url: 'pc/cate/findGoodsClassOne',
    method: 'post'
  },
  getGoodsClassTwo: {
    url: 'pc/cate/findGoodsClassTwo',
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
