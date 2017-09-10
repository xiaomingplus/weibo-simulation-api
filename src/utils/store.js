/**
 * kv存储
 */
const memeryStoreMap = {};//内存级别的存储
const fse = require('fs-extra');//文件存储
const path = require('path');
const {NO_CACHE} = require('../constans/code')
const config = require('rc')('weibo',{
    "tokenFolders":"./tokens"//token存储的文件夹
})

/*
const store = new Store();

store.set('key',{"key":"value"},5000).then(()=>{
    store.get('key').then(data=>{
        console.log('data',typeof(data),data);
        return true;
    }).then(()=>{
        return new Promise((resolve,reject)=>{
            setTimeout(()=>{
                console.log('6s');
                return resolve()
            },6000)
        })
    }).then(()=>{
        return store.get('key').catch(e=>{
            console.log('e',e);
            return true;
        })
    }).then((data)=>{
        console.log('data',data);
    })
})
*/

 class Store {
    constructor(params) {
        this.type = 'file';//本地文件存储
    }
    async set(key,value,cacheTime) {
            //设置store
            if (!cacheTime) { //如果没有cacheTime，说明是永久
                cacheTime = -1;//表示永久,毫秒
            }
            const struct = {};
            struct.version = 'storev1';
            struct.cacheTime = cacheTime===-1?-1:((new Date()).getTime() + parseInt(cacheTime, 10));
            struct.type = typeof(value);
            // console.log('value',value);
            if(struct.type === 'object'){
                struct.value = JSON.stringify(value);
            }else{
                struct.value = value;                
            }
            try {
                memeryStoreMap[key] = struct;
                let filePath = path.join(__dirname,'../',config.tokenFolders,`${key}.json`);
                // console.log('filePath',filePath);
                await fse.writeJson(filePath,struct);
                return Promise.resolve(struct);
            } catch (e) {
                console.log(e);
                return Promise.reject(e);
            }
        
    }
    async get(key) {
        // console.log('get Store key',key);
        //获取store内容
        let json = memeryStoreMap[key];
        // console.log('memery ',json);
        if(!json){
            try{
                let jsonPath = path.join(__dirname,'../',config.tokenFolders,`${key}.json`);
                // console.log('jsonPath',jsonPath);
                json = await fse.readJson(jsonPath);            
            }catch(e){
                return Promise.reject(e);
            }
        }
        if (!json) {
            return Promise.reject({
                code:NO_CACHE,
                msg:'内容为空'
            });
        }
        // console.log('json',json);
        if (json.version === 'storev1') {
            //检查cache是否有效
            // console.log('json.cacheTime',json.cacheTime);
            // console.log('new Date() ',new Date());
            if (json.cacheTime >= new Date() || json.cacheTime===-1) {
                memeryStoreMap[key] = json;//缓存到内存里
                //判断类型
                if(json.type === 'object'){
                    try {
                        var parseValue = JSON.parse(json.value);
                    } catch (error) {
                        return Promise.reject(error);
                    }
                    return parseValue;
                }else{
                    return json.value;                    
                }
            } else {
                try{
                    await this.remove(key);                
                }catch(e){
                    console.error('remove fail',e);
                }
                return Promise.reject({
                    code:NO_CACHE,
                    msg:'内容为空'
                });
            }
        } else {
            return json.value;
        }
    }
    async remove(key) {
        delete memeryStoreMap[key];        
        try {
            await fse.remove(path.join(__dirname,'../',config.tokenFolders,`${key}.json`));
        } catch (error) {
            return Promise.reject(error);
        }
        return Promise.resolve()
    }
}

module.exports = Store;
