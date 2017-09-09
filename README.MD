# 新浪微博模拟登录、API

主要是因为微博现在基本封禁了第三方api，所以做这个用来代替。aip的设计模拟的是官方的sdk，上手极快。

## 特性

1. 完美代替微博的api
1. 支持发送带图片微博（原图上传）
1. 支持发布批量图片微博
1. 支持发送base64，url，file格式的图片微博

## 注意事项

1. 请注意不要泄露你的微博账户和密码
1. 请关掉微博的登录保护（因为登录保护会开启验证码登录

## 如何使用？

    npm i weibo-simulation-api

    const weiboSimulation = require('weibo-simulation-api');
    const weibo = new weiboSimulation({
        username:"xxx@gmail.com",
        password:"xxxxxx"
    });

### 发送一条微博

如果只发文字的话，只需传入```status```字段即可,如果要带图片的话，```pictureBase64Datas```,```pictureUrls```,```pictureFiles```任选其一传入即可

    weibo.api('statuses/share',{
        status:"hello",
        pictureBase64Datas:[
        ],//通过base64发布图片微博
        pictureUrls:[
             "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1504975323393&di=a8f0f65745bd544246d7c54fc503182b&imgtype=0&src=http%3A%2F%2Fimg0.ph.126.net%2FNGUE-_4ZfUF-20Myt_14Nw%3D%3D%2F3324500950029816015.jpg",
             "http://mingxing.dabaoku.com/dalunv/jinqiaoqiao/064cl.jpg"
        ],//通过图片地址发布图片微博
        pictureFiles:[
            path.join(__dirname,'./test.png'),//通过file发布图片
        ]
    }).then(data=>{
        console.log('data',data);
        /*
            data = {
                meta:{
                    code:100000//100000代表成功
                },
                data:{
                    mid: '4150134172756415'
                }
            }
        */
    }).catch(e=>{
        console.log('e',e);
        /*
            e = {
                meta:{
                    code:100001,
                    message:"错误信息"
                }
            }
        */
    })

## 错误码

错误码 | 含义 | 解决办法
---------|----------|----------
100000 | 成功 | 发布成功
 9001 | cookie无效 | 这个一般是已经重试过3次以上但还是有问题的情况了，建议跟着代码调试下
 100001 | 10分钟内发的微博内容一致 | 修改文本内容
 9003 | 登录需要验证码 | 在设置里关闭微博的登录验证
 9004 | 登录错误 | 请查看具体错误信息

## 示例

 在项目的examples文件夹下

    node index.js