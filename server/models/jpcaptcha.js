var mongoose = require('mongoose');

var JPCaptchaSchema = new mongoose.Schema({
    phone: {
        type: String,
        unique: true
    },
    code: String
});

var JPCaptcha = mongoose.model('JPCaptcha', JPCaptchaSchema);

module.exports = JPCaptcha;
