/**
 * 管理cookie相关
 */
const weiboLogin = require('./weibo_login.js').weiboLogin;
const config = require('rc')('weibo',{
    cookieExpire:72000
})
const {errorPromise} = require('./format')
const Store = require('./store');
const store = new Store();
const {LOGIN_ERROR} = require('../constans/code')
class Cookie {
    constructor(params) {
        this.cookie = null;
        this.username = params.username;
        this.password = params.password;
        this.cookieKey = `cookie_${this.username}`;
        //check require
    }
    interval(){
        //定时检测，更新cookie
    }
    refresh(){
        //刷新cookie
    }
     async init(){
        // console.log('cookie init',);
        //初始化
        try {
            // console.log('this.username,this.password',this.username,this.password);
           var cookie =  await new weiboLogin(this.username,this.password).init()   
        }catch(e){
            //
            console.log('init login error',e);
            return errorPromise({
                code:LOGIN_ERROR,
                message:e
            });
        }
        // console.log('new cookie',cookie);
        try {
            await store.set(this.cookieKey,cookie,parseInt(new Date()/1000)+config.cookieExpire)
        } catch (error) {
            return errorPromise(error);
        }
        //持久化保存cookie
        return cookie;
    }
     async getWeiboCookie(options){
            options = Object.assign({
                force:false
            },options);
            // console.log('getCookie',options);
            try {
                if(options.force){
                    return this.init();
                }else{
                    // console.log('get this.cookieKey',this.cookieKey);
                    var cookie = await store.get(this.cookieKey);                    
                }    
            } catch (error) {
                console.log('get this.cookieKey error',error);
                return this.init();
            }
            // console.log('get this.cookieKey success',cookie);
            return Promise.resolve(cookie)
    }
}

 module.exports = Cookie;