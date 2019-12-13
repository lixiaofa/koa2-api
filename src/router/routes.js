const Router = require('koa-router')
const userCtrl = require('../controller/UserController')   // 这里引入controller
const profileCtrl = require('../controller/ProfileController')
const commonCtrl = require('../controller/CommonController')



module.exports = app => {

    const router = new Router()
    const apiRouter = new Router()
    router.get('/', async(ctx,next) => {
        ctx.type = 'text/html'
        ctx.body = `<h1>这里是Koa首页</h1>`
    })


    apiRouter.post('/user/registe',userCtrl.registe)  // 用户注册
    apiRouter.post('/user/login',userCtrl.login)      // 用户登录


    apiRouter.post('/user/delete',userCtrl.delete)    // 删除用户
    apiRouter.post('/user/edit',userCtrl.edit)        // 添加或修改
    apiRouter.get('/user/getall',userCtrl.getall)     // 查询所有
    apiRouter.get('/user/getuserinfo/:id',userCtrl.getuserinfo)    // 获取用户资料
    apiRouter.get('/user/getpagedata',userCtrl.getpagedata)        // 查询分页数据
    apiRouter.post('/user/uploadAvatar',userCtrl.uploadAvatar)     //更换头像
    apiRouter.get('/user/getuserbytoken',userCtrl.getuserbytoken)  //根据token获取用户信息

    apiRouter.post('/profile/delete',profileCtrl.delete)      // 删除
    apiRouter.post('/profile/edit',profileCtrl.edit)          // 添加或修改
    apiRouter.get('/profile/getall',profileCtrl.getall)       // 查询所有
    apiRouter.get('/profile/getbyid/:_id',profileCtrl.getbyid)    // 根据id获取
    apiRouter.get('/profile/getpagedata',profileCtrl.getpagedata)    // 查询分页数据


    apiRouter.post('/common/addnews',commonCtrl.addnews)      // 增加news接口
    apiRouter.post('/common/queryallnews',commonCtrl.queryallnews)      // 查询所有new接口
    apiRouter.get('/common/newsDetails/:_id',commonCtrl.newsDetails)      // 查询new详情接口
    apiRouter.post('/common/modifynews',commonCtrl.modifynews)      // 修改new接口
    apiRouter.post('/common/deletenews',commonCtrl.delete)      // 删除new接口


    /*apiRouter.post('/common/getplayproject',commonCtrl.getplayproject)      // 首页查询接口

    apiRouter.get('/common/playprojectdetails',commonCtrl.playprojectdetails)//查询游玩项目详情

    apiRouter.get('/common/islike',commonCtrl.islike)  //项目点赞*/
    //设定api路由为router的子路由
    router.use('/api', apiRouter.routes(), apiRouter.allowedMethods())

    //如果匹配不到路由则返回404
    router.all('/*', async (ctx, next) => {

        ctx.response.status = 404;
        ctx.response.body = `<h1>~~oops page not found!</h1>`
    })
    app.use(router.routes()).use(router.allowedMethods())
}
