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
  getCommClassifyList: {
    url: 'pc/cate/listCate',
    method: 'post'
  },
  getCommClassifyDetail: {
    url: 'pc/cate/findCateById',
    method: 'post'
  },
  addCommClassifyData: {
    url: 'pc/cate/saveCate',
    method: 'post'
  },
  modifyCommClassifyData: {
    url: 'pc/cate/updateCate',
    method: 'post'
  },
  deleteCommClassifyData: {
    url: 'pc/cate/deleteCate',
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
