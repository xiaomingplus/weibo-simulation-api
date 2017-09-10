const cheerio = require('cheerio');
const url = require('url')
exports.errorPromise = function (err) {
    return Promise.reject(exports.error(err))
}
exports.error = function (err) {
    let code = -1;
    let message = "系统错误";
    let data = {};
    let meta = {}
    if (err) {
        if (typeof (err) === 'object') {
            code = err.code || err.errCode || err.statusCode || code;
            message = err.message || err.msg || message;
            if(err.data){
                data = err.data;
            }
            meta =  {
                code,
                message
            }
        } else if (typeof (err) === 'number') {
            meta =  {
                code:err,
                message: "系统错误"
            }
        } else {
            meta = {
                code,
                message: err
            }
        }
    } else {
        meta = {
            code: code,
            message: "无错误信息"
        }
    }
    return {
        meta,
        data
    }
}
/**
 * 解析微博返回的内容
 */
exports.parsePostWeiboResponse = function(content){
    const $ = cheerio.load(content);
    const mid = $("[action-type=feed_list_item]").attr('mid');
    return {
        mid
    }
}
/**
 * 解析上传微博图片返回
 */
exports.parseUploadResponse = function(location){
    return url.parse(location,true).query;
}