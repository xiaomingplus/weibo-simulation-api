const qs = require('querystring');
const url = require('url');
var location = 'https://weibo.com/aj/static/upimgback.html?_wv=5&callback=STK_ijax_1504967343356&ret=1&pid=006qRkPZgy1fjdok7kb7aj30jg08c3yi'

var query = url.parse(location,true).query;

console.log('urlObj',query);