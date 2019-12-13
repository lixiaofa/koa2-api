var path = require('path');

//错误日志输出完整路径
var errorLogPath = path.resolve(__dirname, "../../logs/error/error");
 
//响应日志输出完整路径
var responseLogPath = path.resolve(__dirname, "../../logs/response/response");

module.exports = {
    appenders: {
        errorLogger: { 
            type: 'dateFile', 
            filename: errorLogPath,
            pattern: 'yyyy-MM-dd-hh.log',
            alwaysIncludePattern:true,
            keepFileExt:true,  //保持日志文件的扩展名,file.log becomes file.2017-05-30.log instead of file.log.2017-05-30
            maxLogSize: 104800, // 文件最大存储空间
            backups: 100  //当文件内容超过文件存储空间时，备份文件的数量
        },
        resLogger: { 
            type: 'dateFile', 
            filename: responseLogPath,
            pattern: 'yyyy-MM-dd-hh.log',
            alwaysIncludePattern:true,
            keepFileExt:true,
            daysToKeep:2,       //保留2天的的访问响应日志
            maxLogSize: 104800, // 文件最大存储空间
            backups: 100  //当文件内容超过文件存储空间时，备份文件的数量  
        }
    },
    categories:{
        "resLogger": {"appenders": ["resLogger"], "level": "info"},
        "errorLogger": {"appenders": ["errorLogger"], "level": "error"},
        "default":{"appenders":["resLogger"],"level":"info"}
    }
}
