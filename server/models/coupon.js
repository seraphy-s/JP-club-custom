var mongoose = require('mongoose');

var CouponSchema = new mongoose.Schema({
    link: {
        type: String,
        require: true,
        unique: true
    }
});

var Coupon = mongoose.model('Coupon', CouponSchema);

module.exports = Coupon;
