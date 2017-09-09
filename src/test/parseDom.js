const cheerio = require('cheerio');
const fse = require('fs-extra')
async function main(){
    try {
        var content = await fse.readFile('./dom.html','utf-8')
    } catch (error) {
        console.log('error',error);
    }
    const $ = cheerio.load(content);
    const mid = $("[action-type=feed_list_item]").attr('mid')
}

main()