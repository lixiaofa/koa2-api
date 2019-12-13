const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { jwt_secret, expiresIn } = require('../config/config')

const saltRounds = 10

/* 获取一个期限为4小时的token */
function getToken(payload = {}) {
    return jwt.sign(payload, jwt_secret, { expiresIn: expiresIn })
}

module.exports = {
    // 获取所有用户
    getall: async (condition) => {
        let result
        //如果有传查询关键字, 查询 name的模糊匹配(使用的正则)
        console.log()

        let con = condition? {name: new RegExp(condition,"i") }: {}

        console.log(con)
        result = await User.find(con)
        return result
    },
    // 注册
    registe: async(user) => {


        const u = await User.findOne({ name : user.name })


        let result

        if(u) {
            result = { code: 0, msg: `用户名${user.name}已经存在`}
            return result
        }
        // 将数据插入到数据库中


        let re = await User.create(user)
       /* console.log(re)*/


       //create 会返回插入到数据库后的doc对象,也即是会有_id
        // 生成 token
        let token = getToken({ _id:re.id, name:user.name, role:re.role })
        result = { code : 1, data: token }
        return result
    },
    // 登录
    login: async(user) => {

        const u = await User.findOne({ name : user.name })

        let result
        if(!u) {
            result = { code: 0, msg: `用户不存在,请重新输入`}
            return result
        }
        // 比较密码是否一致
        try {
            let flag = await bcrypt.compare(user.password,u.password)
            console.log(flag)
            if(!flag) {

                result = { code: 0, msg: `密码不正确`}
                console.log(result)
                return result
            }
        } catch (error) {
            return {code:0, msg:'比较加密密码时执行出错!'}
        }
        // 生成 token
        let token = getToken({ _id:u._id, name:user.name, role:u.role })
        result = { code: 1, data: {token:token} }
        return result
    },
    // 添加
    add: async(user) => {
        const u = await User.findOne({ name : user.name })
        let result
        if(u) {
            result = { code: 0, msg: `用户名${user.name}已经存在`}
            return result
        }
        // 将数据插入到数据库中
        delete user._id  //因为前端传过来的对象包含有_id属性, 创建的时候要将这个_id删除掉,才能添加成功
        let re = await User.create(user)             //create 会返回插入到数据库后的doc对象,也即是会有_id
        result = { code : 1, data: re }
        return result
    },
    // 删除用户
    delete: async (ids) => {
        let result
        let re = await User.remove({ _id: { $in: ids } })
        console.log("Promise返回结果：",re)
        result = { code : 1 }
        return result
    },
    // 修改用户资料
    update: async (user) => {
        const u = await User.findById(user._id)
        let result
        if(!u) {
            result = { code: 0, msg : `您要修改的用户不存在`}
            return result
        }
        const sameNameUsers = await User.findOne({ name : user.name, _id: {$ne: user._id} })
        if(sameNameUsers) {
            result = { code: 0, msg: `用户名${user.name}已经存在`}
            return result
        }
        // 更新数据
        let { name, email, avatar, role} = user
        let updating = {name,email,avatar,role}
        let re = await User.updateOne({_id:user._id},updating)
        result = { code : 1 }
        return result
    },
    // 根据id 或者用户名获取用户资料
    getuserinfo: async(id,name) => {
        let u
        if(id) {
            u = await User.findById(id)
        }else if(name) {
            u= await User.findOne({name})
        }
        return u
    },
    // 获取分页数据
    getpagedata: async(con) => {
        /*  使用sequelize的分页数据获取
        let offset = (pageIndex-1)*pageSize
        let singers = await Singer.findAndCountAll({
            where: {
                index: {[Op.eq]:index},
                area: {[Op.eq]:area}
            },
            offset,
            limit: pageSize
        })
        return singers
        */
        let {pageIndex,pageSize} = con
        let offset = (pageIndex-1)*pageSize
        let condition = {}
        if(con.name) {
            condition.name = new RegExp(con.name,"i")   // 根据名字模糊查询
        }
        let count = await User.countDocuments(condition)  // 计算某个条件的数据数量
        let rows = await User.find(condition).skip(offset).limit(pageSize)   // 使用offset和limit的方式获取当前页的数据
        return {rows,count}
    },
    uploadAvatar: async(_id,avatarUrl) => {
        const u = await User.findById(_id)
        let result = { code : 1 }
        if(u) {
            // 更新头像
            let updating = { avatar: avatarUrl }
            let re = await User.updateOne({_id},updating)
            //  result = { code : 1 }
        }
        return result
    }
}
