const Weibo = require('../lib');
const path = require('path');
const readline = require('readline');

const weibo = new Weibo({
    username: "jiantingzhe@qq.com", //微博账号
    password: "Weibo110139", //微博密码
    onNeedPinCode: function (params) {
        //当需要验证码的时候会回调这里,这里会传入本次验证码的url和codeKey，人工辨识后，然后回调下params.callback('具体的验证码');
        console.log('codePictureUrl', params.codePictureUrl);
        console.log('codeKey', params.codeKey);
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question('请输入验证码\n', (pinCode) => {
            console.log(`你输入的验证码为：${pinCode}`);
            params.callback(pinCode)
            rl.close();
        })
    }
})

//发布一条文字微博
weibo.api('statuses/share', {
    status: "hello world",
    pictureBase64Datas: [], //通过base64发布图片微博
    // pictureUrls:[
    //     "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1504975323393&di=a8f0f65745bd544246d7c54fc503182b&imgtype=0&src=http%3A%2F%2Fimg0.ph.126.net%2FNGUE-_4ZfUF-20Myt_14Nw%3D%3D%2F3324500950029816015.jpg",
    //     // "http://mingxing.dabaoku.com/dalunv/jinqiaoqiao/064cl.jpg"
    // ],//通过图片地址发布图片微博
    pictureFiles: [
        path.join(__dirname, './test.png')
    ]
}).then(data => {
    console.log('data', data);
}).catch(e => {
    console.log('e', e);
})
