const dir = require('node-dir');
const path = require('path');
const replaceExt = require('replace-ext');
const upath = require('upath');
module.exports = function(api,params){
     const apiMap = {};
     const apiAbsoluteDir = path.join(__dirname,'../api');
     return dir.promiseFiles(apiAbsoluteDir).then(files=>{
         return files.map(file=>{
            return replaceExt(path.relative(apiAbsoluteDir,file),'');
         }).filter(path=>path!=='index').forEach(api=>{
            apiMap[upath.toUnix(api)] = path.join(__dirname,'./',api);
         })
     }).then(()=>{
         if(apiMap[api]){
            return require(apiMap[api])(params)
         }else{
            return null;
         }
     })
}
