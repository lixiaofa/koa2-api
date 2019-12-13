const env = process.env.NODE_ENV || 'development'

let port,database,mongodbUrl;

let jwt_secret = 'qwqasdf#$123$%##*(&&!@#aic'    // 用于jsonwebtoken的加密串
let expiresIn = '4h'    //身份过期时间 4h=4小时

if(env === 'development') { // 如果是开发环境
    port = 5000
    database = {
        host: 'localhost',
        database: 'koa-test',
        username: 'root',
        password: '123456',
        port: '3306'
    }
    mongodbUrl = 'mongodb://127.0.0.1:27017/test'
}

if(env === 'production') {  //如果是生产环境

}

module.exports = {
    port,
    database,
    mongodbUrl,
    jwt_secret,
    expiresIn
}
