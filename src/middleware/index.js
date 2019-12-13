const jwt = require('jsonwebtoken')
const jwtKoa = require('koa-jwt'); // 用于路由权限控制
const { jwt_secret } = require('../config/config')

// 一些中间件
module.exports = (app) => {
    /* 401未授权返回自定义的数据格式 */

    app.use(async function (ctx, next) {//如果返回的是401未授权status

        try {
            await next()
        }

        catch (err) {
            console.log('err1111',err)
            if (401 == err.status) {
                ctx.status = 200  //这里还是给个成功的返回,只是将code设置成401
                ctx.body = { code: 401, msg: '您未提供Authorization header或者身份过期,请登录获取。' }
            } else {
                throw err
            }
        }
    })
    /* 路由权限控制 */
    app.use(jwtKoa({ secret: jwt_secret }).unless({

        // 设置login、registe、getplayproject接口，可以不需要认证访问
        path: [
            /^\/api\/user\/login/,
            /^\/api\/user\/registe/,

            /^((?!\/api).)*$/ // 设置接口外的其它资源，可以不需要认证访问
        ]
    }))

    app.use(async function (ctx, next) {     // 如果是携带了token的请求,解析这个token并 放置在ctx.user下


        try {

            const authorization = ctx.header.authorization  // 获取jwt
            if (authorization) {
                let token = authorization.split(' ')[1]
                if (token && token.length > 10) { //客户端传过来的Authorization: Bearer null会被解析成token为"null",简单点用长度来过滤
                    let payload = await jwt.verify(token, jwt_secret)  // 解密，获取payload
                    ctx.user = payload
                }
            }
            await next()
        }
        catch (err) {    //这个中间件不做任何路由拦截处理，因为koa-jwt已经做了, 这个中间件的作用是，如果token能够解析正确，就把它解析成登录用户对象并赋值给 ctx.user
            throw err
        }
    })
}
