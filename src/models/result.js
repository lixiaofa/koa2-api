class Result {
    error(code ,msg,data) {  // 错误消息的msg必须提供, data可有可无

        return data? { code: code, msg: msg, data:data }: { code: code,msg: msg }
    }
    success(msg, data) {
        return { code: 200, msg: msg, data: data }
    }
    pageresult(msg, data) {   //分页数据的返回
      /*  return { code: 200, msg: msg, rows: data.rows, count: data.count }*/
        return { code: 200, msg: msg, data:{list:data.rows ,count:data.count} }
    }
}

module.exports = Result
