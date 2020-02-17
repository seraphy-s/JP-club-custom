var mongoose = require('mongoose');
// 页面路由URL QQ官方加群二维码 QQ官方加群链接 福利活动水印 一句话广告 查券网站地址
var UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  phone: {
    type: String,
    unique: true,
  },
  avatar: {
    type: String,
    default: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
  },
  secret: String, //token 密钥 ---初始化---
  auth: {
    type: String,
    default: 'user',
  },
  status: {
    type: String,
    default: '0',
  }, // 0 过期， 1 正常
  begin_time: {
    type: Date,
    default: Date.now,
  }, // 开始时间
  end_time: {
    type: Date,
    default: Date.now,
  }, // 结束时间
  name: {
    type: String,
    default: '万薅联盟',
  }, // 网站名称
  logo: {
    type: String,
    default: 'http://static.jshangpin.com/qiejiang/logo/wechamber.ico',
  }, // logo
  route: String, // 页面路由URL
  QQ_qrcode: String, // QQ官方加群二维码
  show_options: {
    type: Array,
    default: ['hongbao', 'huafei', 'choujiang', 'fuli', 'tmall'],
  },
  QQ_url: {
    type: String,
    default: 'https://www.baidu.com',
  }, // QQ官方加群链接
  ad: {
    type: String,
    default: '欢迎来到xxx！',
  }, // 一句话广告
  coupon_url: {
    type: String,
    default: 'https://www.baidu.com',
  }, // 查券网站地址
  data_from: {
    type: String,
    default: 'riki',
  },
  links: {
    type: Array,
    default: [],
  },
  sid: String,
  pid: String,
  // watermark: String // 福利活动水印
});

var User = mongoose.model('User', UserSchema);

// var user = new User({
//     QQ: '1351370237',
//     password: '123',
//     phone: '15322054290'
// })

// user.save(function(err) {

// })
module.exports = User;
