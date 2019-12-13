const userService = require('../service/UserService')
const Result = require('../models/result')
const bcrypt = require('bcrypt')
const path = require('path')
const Joi = require('joi')
const UserJoi = require('../models/validators/UserJoi')

let result = new Result()
const saltRounds = 10


module.exports = {
    getall: async (ctx) => {
        let { keyWord } = ctx.query
        let users = await userService.getall(keyWord)
        ctx.body = result.success('获取成功',users)
    },
    //注册
    registe: async (ctx,next) => {


        let user = ctx.request.body

        const { error } = Joi.validate(user, UserJoi,{ abortEarly: false, allowUnknown:true })
        if(error) {
            ctx.body = result.error('数据验证不通过,请提供正确的数据格式',error)
            return
        }
        user.avatar = 'images/nopic.png'         // 注册的时候给一个默认头像,在个人资料页,用户可以更改头像
        // 加密密码
        try {
            let hashPwd = await bcrypt.hash(user.password,saltRounds)
            user.password = hashPwd
        } catch (error) {
            ctx.body = result.error('密码加密时执行出错!')
            return
        }
        let re = await userService.registe(user)

        let backData
        if(re.code) {  //注册成功
            backData = result.success('注册成功！',re.data)
        }else {
            backData = result.error(re.msg)
        }
        ctx.body = backData
    },
    // 登录
    login: async (ctx,next) => {
        console.log('ctx2222' , ctx)
        let user = ctx.request.body
        let re = await userService.login(user)

        let backData

        if(re.code) {  //登录成功-----
            backData = result.success('登录成功！',re.data)
        }else {
            backData = result.error(403 , re.msg)
        }
        console.log('backData' , backData)

        ctx.body = backData

    },

    // 删除用户
    delete: async(ctx) => {
        let { ids } = ctx.request.body
        let idsArr = ids.split(',')
        console.log(`要删除的ids值：${ids}`)
        let re = await userService.delete(idsArr)
        let backData
        if(re.code) {  //删除成功
            backData = result.success('删除成功！')
        }else {
            backData = result.error(re.msg)
        }
        ctx.body = backData
    },
    // 增加或修改用户资料
    edit: async(ctx) => {
        let user = ctx.request.body
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
        ctx.body = backData
    },
    getuserinfo: async(ctx) => {
        let {id} = ctx.params
        let { name=''} = ctx.query
        let re = await userService.getuserinfo(id,name)
        let backData
        if(re) {  //获取成功
            // re.password = '不告诉你'
            // 参考：https://koajs.com/#request
            let origin = ctx.request.origin
            re.avatar = re.avatar? origin+'/'+re.avatar : ''
            delete re.password  //不给前台传password字段
            backData = result.success('获取成功！',re)
        }else {
            backData = result.error(re.msg)
        }
        ctx.body = backData
    },
    // 获取分页数据, 这个方法的路由要视情况而定是用的post还是get请求
    getpagedata: async(ctx) => {
        let { pageIndex = 1, pageSize =20, name='' } = ctx.query
        pageIndex=Number(pageIndex),pageSize=Number(pageSize)
        // TODO: 组件其它的查询条件
        let con = {pageIndex, pageSize, name}
        let backData
        let pageData = await userService.getpagedata(con)
        backData = result.pageresult('获取成功！',pageData)
        ctx.body = backData
    },
    // 更新头像
    uploadAvatar: async(ctx) => {
        let uploadFiles = ctx.request.files
        let {_id} = ctx.request.query
        let uploadImg = uploadFiles
        let origin = ctx.request.origin
        let avatarUrl = path.basename(uploadImg.file.path)

        let re = await userService.uploadAvatar(_id,avatarUrl)
        ctx.body = result.success('更新成功',origin+"/upload/"+avatarUrl)  //这里返回的头像的http地址
    },
    // 根据token获取用户信息
    getuserbytoken: async(ctx) => {

        let { _id } = ctx.user  //其实登录用户是被记录在ctx.user下了
        let re = await userService.getuserinfo(_id,null)
        let backData
        if(re) {  //获取成功
            // re.password = '不告诉你'
            // 参考：https://koajs.com/#request
            let origin = ctx.request.origin
            re.avatar = re.avatar? origin+'/upload/'+re.avatar : ''
            delete re.password  //不给前台传password字段
            backData = result.success('获取成功！',re)
        }else {
            backData = result.error(re.msg)
        }
        ctx.body = backData
    }
}
