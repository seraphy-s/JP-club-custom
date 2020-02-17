var mongoose = require('mongoose');

var ExtensionSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    title: String,
    price: {
        month: Number,
        tmonth: Number,
        smonth: Number,
        year: Number
    },
    num: Number
})


var Extension = mongoose.model('Extension', ExtensionSchema)

// var e = new Extension({
//     name: 'tb_wxfd_custom',
//     title: '淘宝微信发单（定制版)',
//     price: {
//         month: 56,
//         tmonth: 162,
//         smonth: 298,
//         year: 560
//     }
// })

// e.save(function(err) {

// })

module.exports = Extension
