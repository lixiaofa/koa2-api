/*const mongoose = require('mongoose')*/
const News = require('../models/News')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {jwt_secret, expiresIn} = require('../config/config')


/* 获取一个期限为4小时的token */
function getToken(payload = {}) {
    return jwt.sign(payload, jwt_secret, {expiresIn: expiresIn})
}

module.exports = {
    // 新建new
    addnews: async (news) => {
        let re = await News.create(news)
        console.log('re111', re)
        let result = {code: 1, data: re}
        return result

    },
    // 获取分页数据,
    queryallnews: async (con) => {
        let {pageIndex, pageSize} = con
        let offset = (pageIndex - 1) * pageSize
        let condition = {}

        if (con.key) {
            condition.title = new RegExp(con.key, "i")   // 根据名字模糊查询
        }
        if (con.tag != 1001) {
            console.log('con.tag', con.tag)
            condition.tag = con.tag
        }
        console.log('condition', condition)
        let count = await News.countDocuments(condition)  // 计算某个条件的数据数量

        let rows = await News.find(condition).skip(offset).limit(pageSize)   // 使用offset和limit的方式获取当前页的数据

        return {rows, count}

    },
    // 获取newsinfo
    newsDetails: async (_id) => {
        let news
        news = await News.findById(_id)


        return news
    },
    // 修改news
    update: async (news) => {
        const u = await News.findById(news._id)

        let result
        if(!u) {
            result = { code: 0, msg : `您要修改的新闻不存在`}
            return result
        }
        let re = await News.updateOne({_id:news._id},news)
        result = { code : 1 }
        return result
    },
    // 删除new
    delete: async (ids) => {
        console.log(ids)
        let result
        let re = await News.remove({ _id: { $in: ids } })
        console.log("Promise返回结果：",re)
        result = { code : 1 }
        return result
    },


    // 查询首页数据
    // 分页查询游玩项目
    /* getplayproject: async(con) => {

         let {pageIndex,pageSize} = con

         let offset = (pageIndex-1)*pageSize


         let condition = {}

         if(con.name) {
             condition.name = new RegExp(con.name,"i")   // 根据名字模糊查询
         }

         let count = await Scenicspot.countDocuments(condition)  // 计算某个条件的数据数量

         let rows = await Scenicspot.find(condition).skip(offset).limit(pageSize)   // 使用offset和limit的方式获取当前页的数据

         return {rows,count}
     },
     // 通过id 查询项目 详情
     playprojectdetails: async(condition) => {
         let result
         //如果有传查询关键字, 查询 name的模糊匹配(使用的正则)
         /!*console.log(mongoose.Types.ObjectId(condition))*!/
         console.log(condition)
         let con = condition
         result = await Scenicspot.findOne(con)
         return result

        /!* let {id}  = con
         console.log('con' ,con)
        /!* id = mongoose.Types.ObjectId(id)*!/
         let  condition = {"_id":id}
         console.log('condition' , condition);


         let count = await Scenicspot.countDocuments(condition)  // 计算某个条件的数据数量



         let result = await Scenicspot.findOne(condition)  //  项目 详情
         return {result,count}*!/
     }*/


}
