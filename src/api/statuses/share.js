/**
 * 发送微博相关
 */
const util = require('../../utils')
const format = require('../../utils/format');
module.exports = function (params) {
  params = Object.assign({
    status: "hello",
    pictureUrls: [],
    pictureBase64Datas: [],
    pictureFiles: []
  }, params);
  let promise;
  if (Array.isArray(params.pictureUrls) && params.pictureUrls.length > 0 || Array.isArray(params.pictureBase64Datas) && params.pictureBase64Datas.length > 0 || Array.isArray(params.pictureFiles) && params.pictureFiles.length > 0) {
    //如果有图片，先上传图片
    promise = util.weiboMultiUploadPicture({cookie: params.cookie, pictureUrls: params.pictureUrls, pictureBase64Datas: params.pictureBase64Datas, pictureFiles: params.pictureFiles})
  };
  if (promise) {
    //图片
    promise = promise.then(pics => {
      return util.weiboRequest({
        cookie: params.cookie,
        url: "/aj/mblog/add?ajwvr=6",
        form: {
          text: params.status,
          pic_id: pics
            .map(pic => pic.pid)
            .join('|'),
          updata_img_num: pics.length,
          location: 'v6_content_friends',
          appkey: '',
          style_type: '1',
          tid: '',
          pdetail: '',
          mid: '',
          isReEdit: 'false',
          gif_ids: '',
          rank: '0',
          rankid: '',
          module: 'stissue',
          pub_source: 'main_',
          pub_type: 'dialog',
          isPri: 'null',
          _t: '0'
        }
      })
    })
  } else {
    promise = util.weiboRequest({
      isMock: true,
      cookie: params.cookie,
      url: "/aj/mblog/add?ajwvr=6",
      form: {
        text: params.status,
        location: 'v6_content_friends',
        appkey: '',
        style_type: '1',
        pic_id: '',
        tid: '',
        pdetail: '',
        mid: '',
        isReEdit: 'false',
        rank: '0',
        rankid: '',
        module: 'stissue',
        pub_source: 'main_',
        pub_type: 'dialog',
        isPri: '0',
        _t: '0'
      }
    })
  }

  promise = promise.then(data => {
    if (data.statusCode === 200) {
      try {
        var body = JSON.parse(data.body);
      } catch (error) {
        return format.errorPromise(error);
      }
      if (body.code == '100000') {
        return {
          meta: {
            code: 100000, //0代表成功
          },
          data: format.parsePostWeiboResponse(body.data.html)

        }
      } else {
        return format.errorPromise(body)
      }
    } else {
      //失败
      return format.errorPromise(data)
    }
  });
  return promise;
}