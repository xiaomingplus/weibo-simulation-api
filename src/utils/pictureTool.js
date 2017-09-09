const base64Img = require('base64-img');
const request = require('request');
exports.urlToBase64 = function(url){
    return new Promise((resolve,reject)=>{
        return request.get(url,{encoding: null},(err,res,body)=>{
            if(err){
                return reject(err);
            }else{
                return resolve(body.toString('base64')); 
            }
        })
    })
}