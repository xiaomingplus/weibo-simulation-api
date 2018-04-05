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
        });

    }
    api(apiPath,params){
        const apiLib = api(apiPath,Object.assign({
            cookie:this.cookie
        },params));
        return apiLib
    }
}

module.exports = Weibo;
