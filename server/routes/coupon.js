var router = require('koa-router')();
const Coupon = require('../models/coupon')

router.prefix('/api/coupon');

router.get('/all', async function (ctx, next) {
    console.log('get coupons')
    let newCoupons = []
    await Coupon.find(function(err, coupons) {
        if(err) {
            ctx.body = { message: 'error' }
        }
        // newCoupons = coupons
            ctx.body = coupons

    })
})

router.post('/add', async function(ctx, next) {
    console.log('coupon add', ctx.request.body)
    const options = ctx.request.body
    await Coupon.find({link: options.link}, function(err, coupons) {
        if(err) { ctx.body = {message: 'error'} }
        else if(coupons.length > 0) { ctx.body = { message: 'existed'}}
        else {
            const coupon = new Coupon(options)
             coupon.save(function (err) {
               if (err) {
                 console.log(error)
                 ctx.body = {
                   message: 'error'
                 }
               }
             })
             ctx.body = {
               message: 'success'
             }
        }

    })
})

module.exports = router;
