/*
 * @Descripttion: 
 * @version: 
 * @Author: seraphy
 * @Date: 2019-10-17 16:13:43
 * @LastEditors  : seraphy
 * @LastEditTime : 2020-02-05 19:13:23
 */
var router = require('koa-router')();
const path = require('path');
const fs = require('fs');
let qiniu = require('qiniu');

const accessKey = 'j598Mn_yzACYNjyA5kMMXI9orP5F0AHnUKiRT8fy';
const secretKey = 'U2FxpzL9-6E5WUp4RG8WKSHfu7MomrTVRUB_G39W';
const bucket = 'mkclub';

const distFolder = path.resolve(__dirname, '../', 'views');

router.get('/', async function(ctx, next) {
    await ctx.render('index.html', {});
});

router.get('/genToken', async function(ctx, next) {
    let mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    let options = {
        scope: bucket,
        expires: 3600 * 24,
    };
    let putPolicy = new qiniu.rs.PutPolicy(options);
    let uploadToken = putPolicy.uploadToken(mac);
    console.log(uploadToken);
    if (uploadToken) {
        ctx.body = uploadToken;
    } else {
        ctx.body = { msg: 'error' };
    }
});

router.get('/jp', async ctx => {
    console.log('123');
    ctx.type = 'html';
    ctx.body = fs.createReadStream(`${distFolder}/index.html`);
});
// router.get('/jp', async function (ctx, next) {
//   await ctx.render('jp.html');
// })
// //

router.get('*', async function(ctx, next) {
    await ctx.render('./index.html');
});

module.exports = router;