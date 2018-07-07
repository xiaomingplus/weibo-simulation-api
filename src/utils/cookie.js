/**
 * 管理cookie相关
 */
const weiboLogin = require('./weiboLogin.js').weiboLogin;
const config = require('../weibo.config')
console.log('config',config);
const {weiboRequest} = require('./index');
const Store = require('./store');
const store = new Store();
const {LOGIN_ERROR} = require('../constans/code')
class Cookie {
    constructor(params) {
        this.cookie = null;
        if(!params.username || !params.password){
            throw new Error('用户名或密码必须');
            return;
        }
        this.username = params.username;
        this.password = params.password;
        this.cookieKey = `cookie_${this.username}`;
        this.onNeedPinCode = params.onNeedPinCode;
        this.timer = null;
        //check require
    }
    autoRefresh(){
        //自动刷新cookie时间
        clearTimeout(this.timer);
        this.timer = setTimeout(async () =>{
            try {
                var cookie = await store.get(this.cookieKey);
            } catch (error) {
                console.log('auto refresh fail');
                try {
                    await this.init()
                } catch (error) {
                    console.log('init fail');
                }
            }
            //请求下微博的网页
            weiboRequest({cookieStr:cookie,url:"/friends",method:"get"}).then(data=>{
                console.log('yes refresh success');
                this.autoRefresh()
            }).catch(async e=>{
                console.log('auto refresh fail ',e);
                try {
                    await this.init()
                } catch (error) {
                    console.log('init refresh fail');
                }
            });
        }, config.autoRefreshTime*1000);
    }
     async init(){
        // console.log('cookie init',);
        //初始化
        try {
            // console.log('this.username,this.password',this.username,this.password);
            this.weiboLogin = new weiboLogin(this.username,this.password,this.onNeedPinCode);
           var cookie =  await this.weiboLogin.init()
        }catch(e){
            //
            console.log('init login error',e);
            return Promise.reject({
                code:LOGIN_ERROR,
                message:e
            });
        }
        // console.log('new cookie',cookie);
        try {
            await store.set(this.cookieKey,cookie,parseInt(new Date()/1000)+config.cookieExpire)
        } catch (error) {
            return Promise.reject(error);
        }
        this.autoRefresh();
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
                // console.log('get this.cookieKey error',error);
                return this.init();
            }
            console.log('this.timer',this.timer);
            if(!this.timer){
                this.autoRefresh();
            }
            // console.log('get this.cookieKey success',cookie);
            return Promise.resolve(cookie)
    }
}

 module.exports = Cookie;
