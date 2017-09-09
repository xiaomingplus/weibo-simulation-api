const fs = require('fs');

fs.readFile('./test.jpg','base64',function(err,body){
    console.log('err',err,body.substring(0,50));
})