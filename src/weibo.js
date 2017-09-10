const api = require('./api');
const Cookie  = require('./utils/cookie');
class Weibo {
    constructor(params) {
        this.username = params.username;
        this.password = params.password;
        // console.log('start cookie');
        this.cookie = new Cookie({
            username:this.username,
            password:this.password,
            onNeedPinCode:params.onNeedPinCode
        });        
        
    }
    api(apiPath,params){
        return api(apiPath,Object.assign({
            cookie:this.cookie
        },params));
    }
}

module.exports = Weibo;