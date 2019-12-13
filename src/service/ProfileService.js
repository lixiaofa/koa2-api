const Profile = require('../models/Profile')

module.exports = {
    // 获取所有
    getall: async (condition) => {
        let result 
        let con ={}   // 组建查询条件
        if(condition.type) {
            con.type = type
        }
        result = await Profile.find(con)
        return result
    },
    // 添加
    add: async(model) => {
        let result   
        delete model._id 
        delete model.date    
        let re = await Profile.create(model)             //create 会返回插入到数据库后的doc对象,也即是会有_id
        re? result = { code : 1, data: re }: result = { code : 0, msg:'插入数据出错' }        
        return result
    },    
    // 删除
    delete: async (ids) => {
        let result 
        let re = await Profile.remove({ _id: { $in: ids } })
        console.log("Promise返回结果：",re)
        result = { code : 1 }
        return result
    },
    // 修改用户资料
    update: async (model) => {
        const u = await Profile.findById(model._id)
        let result
        if(!u) {
            result = { code: 0, msg : `您要修改的记录不存在`}
            return result
        }
        // 更新数据
        let { type, income, expend, describe, cash,remark} = model
        let updating = { type, income, expend, describe, cash,remark}
        await Profile.updateOne({_id:model._id},updating)
        result = { code : 1 }
        return result
    },
    // 根据id 获取信息
    getbyid: async(id) => {
        let u = await Profile.findById(id)
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
        if(con.type) {
            condition.type = con.type
        }
        let count = await Profile.countDocuments(condition)  // 计算某个条件的数据数量
        let rows = await Profile.find(condition).skip(offset).limit(pageSize)   // 使用offset和limit的方式获取当前页的数据
        return {rows,count}
    }
}