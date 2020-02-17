var mongoose = require('mongoose');

var CaptchaSchema = new mongoose.Schema({
    phone: {
        type: String,
        unique: true
    },
    code: String
});

var Captcha = mongoose.model('Captcha', CaptchaSchema);

module.exports = Captcha;
