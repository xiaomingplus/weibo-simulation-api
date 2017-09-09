const Weibo = require('../dist');
const path = require('path')
const weibo = new Weibo({
    username:"xxx",//微博账号
    password:"xxxx",//微博密码
})
//发布一条文字微博
weibo.api('statuses/share',{
    status:"hello world",
    pictureBase64Datas:[
    ],//通过base64发布图片微博
    // pictureUrls:[
    //     "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1504975323393&di=a8f0f65745bd544246d7c54fc503182b&imgtype=0&src=http%3A%2F%2Fimg0.ph.126.net%2FNGUE-_4ZfUF-20Myt_14Nw%3D%3D%2F3324500950029816015.jpg",
    //     // "http://mingxing.dabaoku.com/dalunv/jinqiaoqiao/064cl.jpg"
    // ],//通过图片地址发布图片微博
    pictureFiles:[
        path.join(__dirname,'./test.png')
    ]
}).then(data=>{
    console.log('data',data);
}).catch(e=>{
    console.log('e',e);
})