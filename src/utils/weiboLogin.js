
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
            "pagerefer": "",
            "vsnf": "1",
            "su": usernameBase64,
            "service": "sso",
            "sp": this.userPwd,
            "sr": "1440*900",
            "encoding": "UTF-8",
            "cdult": "3",
            "domain": "sina.com.cn",
            "prelt": "0",
            "returntype": "TEXT",
        };
        request.post(this.loginUrl, {
            jar: j,
            form: postData
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
            if (res && res.statusCode === 200 && result.retcode == 0) {
                //登录成功
                let cookie_string = j.getCookieString(this.loginUrl); // "key1=value1; key2=value2; ..."
                return resolve(cookie_string);
            } else {
                return reject(body);
            }
        });
    })
  }
}
exports.weiboLogin = weiboLogin;
