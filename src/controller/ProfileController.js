const profileService = require('../service/ProfileService')
const Result = require('../models/result')

let result = new Result()
module.exports = {
    getall: async (ctx) => {
        let con = { type } = ctx.query
        let models = await profileService.getall(con)
        ctx.body = result.success('获取成功',models)
    },
    // 增加或修改用户资料
    edit: async(ctx) => {
        let model = ctx.request.body
        let re
        if(model._id) {  //如果存在id说明是修改
            re = await profileService.update(model)
        } else {  //否则是增加
            re = await profileService.add(model)
        }        
        let backData
        if(re.code) {  //执行成功
            backData = result.success('操作成功！',re.data||null)
        }else {
            backData = result.error(re.msg)
        }
        ctx.body = backData
    },
    // 删除
    delete: async(ctx) => {
        let { ids } = ctx.request.body
        let idsArr = ids.split(',')
        console.log(`要删除的ids值：${ids}`)
        let re = await profileService.delete(idsArr)
        let backData
        if(re.code) {  //删除成功
            backData = result.success('删除成功！')
        }else {
            backData = result.error(re.msg)
        }
        ctx.body = backData
    },
    // 根据id 获取
    getbyid: async(ctx) => {
        let { id } = ctx.params
        let re = await profileService.getbyid(id)
        let backData
        if(re) {  //获取成功
            backData = result.success('获取成功！',re)
        }else {
            backData = result.error(re.msg)
        }
        ctx.body = backData
    },
    // 获取分页数据, 这个方法的路由要视情况而定是用的post还是get请求
    getpagedata: async(ctx) => {
        let { pageIndex = 1, pageSize =20, type='' } = ctx.query
        pageIndex=Number(pageIndex),pageSize=Number(pageSize)
        // TODO: 组建其它的查询条件
        let con = {pageIndex, pageSize, type} 
        let backData       
        let pageData = await profileService.getpagedata(con)
        backData = result.pageresult('获取成功！',pageData)
        ctx.body = backData
    }
}