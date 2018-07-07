
// 模拟登录微博，并保存cookie备用
"use strict";
const request = require('request');
const fs = require('fs');
const querystring = require('querystring');
const encodePostData = require('./encode_post_data.js');
const readline = require('readline');
const {NEED_PIN} = require('../constans/code');
var j = request.jar()
const url = require('url')
class weiboLogin {
  constructor(userName, userPwd,onNeedPinCode) {
    // 初始化一些登录信息
    // 用户名
    this.userName = userName;
    // 密码
    this.userPwd = userPwd;
    // 登录的网页地址
    this.loginUrl = "https://login.sina.com.cn/sso/login.php?client=ssologin.js(v1.4.15)";
  };
  async init() {
    return new Promise((resolve,reject)=>{
        let usernameBase64 = Buffer.from(this.userName).toString('base64')
        let postData = {
            "entry": "sso",
            "gateway": "1",
            "from": "null",
            "savestate": "30",
            "useticket": "0",
            pagerefer: 'https://login.sina.com.cn/sso/login.php?client=ssologin.js(v1.4.15)',
            "vsnf": "1",
            "su": usernameBase64,
            "service": "sso",
            "sp": this.userPwd,
            "sr": "1440*900",
            "encoding": "UTF-8",
            "cdult": "3",
            "domain": "sina.com.cn",
            "prelt": "47",
            "returntype": "TEXT",
        };
        let headers = {
            'Pragma': 'no-cache',
            'Origin': 'https://login.sina.com.cn',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Safari/537.36',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': '*/*',
            'Cache-Control': 'no-cache',
            'Referer': 'https://login.sina.com.cn/signup/signin.php?entry=sso',
            'Connection': 'keep-alive'
        }
        request.post(this.loginUrl, {
            jar: j,
            form: postData,
            headers
        },  (err, res, body)=> {
            if (err) {
                //错误
                return reject(err);
            }
            let result = {};
            try {
                result = JSON.parse(body);
            } catch (e) {
                return reject(e);
            }
            console.log('result',result);
            if (res && res.statusCode === 200 && result.retcode == 0 && result.crossDomainUrlList[0]) {
                //登录成功,再去登录weibo.com下
                let weiboPassUrl = result.crossDomainUrlList[0];
                request.get(weiboPassUrl,{
                    jar: j,
                    headers
                },(err,res,body)=>{
                    if (err) {
                        //错误
                        return reject(err);
                    }
                    let cookie_string = j.getCookieString(weiboPassUrl); // "key1=value1; key2=value2; ..."
                    // console.log('cookie_string',cookie_string);
                    return resolve(cookie_string); 
                })


            } else {
                return reject(body);
            }
        });
    })
  }
}
exports.weiboLogin = weiboLogin;
