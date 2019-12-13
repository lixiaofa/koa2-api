const commonService = require('../service/CommonService')
const Result = require('../models/result')
const bcrypt = require('bcrypt')
const path = require('path')
const Joi = require('joi')
const UserJoi = require('../models/validators/UserJoi')

let result = new Result()
const saltRounds = 10


module.exports = {
    // 新建new
    addnews: async(ctx) => {


        let news  = ctx.request.body

        let re = await commonService.addnews(news)
        let backData
        if(re.code) {  //执行成功
            backData = result.success('操作成功！',re.data||null)
        }else {
            backData = result.error(re.msg)
        }
        ctx.body = backData

    },
    // 获取分页数据, 这个方法的路由要视情况而定是用的post还是get请求
    queryallnews: async (ctx) => {
        let { pageIndex = 1, pageSize =10, key='' , tag = 1001 } = ctx.request.body
        console.log(ctx.request.body)
        pageIndex=Number(pageIndex),pageSize=Number(pageSize)
        // TODO: 组件其它的查询条件
        let con = {pageIndex, pageSize, key, tag}
        console.log(con)

        let backData
        let pageData = await commonService.queryallnews(con)
        backData = result.pageresult('获取成功！',pageData)
        ctx.body = backData

    },
    // 获取newsinfo
    newsDetails: async (ctx) => {
        let {_id} = ctx.params
        console.log()

        let re = await commonService.newsDetails(_id)
        let backData
        if(re) {  //获取成功

            backData = result.success('获取成功！',re)
        }else {
            backData = result.error(re.msg)
        }
        ctx.body = backData

    },
    modifynews: async (ctx) => {
        let news = ctx.request.body
        let re
        re = await commonService.update(news)
        let backData
        if(re.code) {  //执行成功
            backData = result.success('操作成功！',re.data||null)
        }else {
            backData = result.error(re.msg)
        }
        ctx.body = backData
    },

    // 删除news
    delete: async(ctx) => {
        let { ids } = ctx.request.body

        console.log(`要删除的ids值：${ids}`)
        let re = await commonService.delete(ids)
        let backData
        if(re.code) {  //删除成功
            backData = result.success('删除成功！')
        }else {
            backData = result.error(re.msg)
        }
        ctx.body = backData
    },





  /*  getplayproject: async(ctx) => {

        let { pageIndex = 1, pageSize =10, name='' } = ctx.request.body
        console.log(ctx.request.body)
        pageIndex=Number(pageIndex),pageSize=Number(pageSize)
        // TODO: 组件其它的查询条件
        let con = {pageIndex, pageSize, name}
        console.log(con)
        let backData
        let pageData = await commonService.getplayproject(con)

        backData = result.pageresult('获取成功！',pageData)
        ctx.body = backData
    },*/
    // 获取游玩项目详情
  /*  playprojectdetails: async(ctx) => {
        let { id } = ctx.query
        let users = await commonService.playprojectdetails(id)
        ctx.body = result.success('获取成功',users)
    },*/
    //项目点赞
    /*islike: async(ctx) => {

       /!* let user = ctx.request.body
        let re
        if(user._id) {  //如果存在id说明是修改
            re = await userService.update(user)
        } else {  //否则是增加
            // 加密密码
            let hashPwd
            try {
                hashPwd = await bcrypt.hash(user.password,saltRounds)
                user.password = hashPwd
            } catch (error) {
                ctx.body = result.error('密码加密时执行出错!')
                return
            }
            user.avatar = 'images/nopic.png' //给一张默认图片
            re = await userService.add(user)
        }
        let backData
        if(re.code) {  //执行成功
            backData = result.success('操作成功！',re.data||null)
        }else {
            backData = result.error(re.msg)
        }
        ctx.body = backData*!/
    },*/

}
