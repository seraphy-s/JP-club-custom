/*
 * @Descripttion: 
 * @version: 
 * @Author: seraphy
 * @Date: 2019-12-25 18:14:05
 * @LastEditors  : seraphy
 * @LastEditTime : 2019-12-25 19:59:42
 */
var mongoose = require('mongoose');

var ImageSchema = new mongoose.Schema({
    uid: String,
    name: String,
    status: {
        type: String,
        default: 'done'
    },
    url: String,
    image_type: {
        type: String,
        default: 'JD'
    }
});

var Image = mongoose.model('Image', ImageSchema);

module.exports = Image;