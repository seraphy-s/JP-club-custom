var mongoose = require('mongoose');

var SwUserSchema = new mongoose.Schema({
  username: String, //用户名
  password: String, //密码
  avatar: String, //头像 ---初始化---
  secret: String, //token 密钥 ---初始化---
  phone: {
    type: String,
    unique: true
  },
  invited_by: String,
  invitation_code: String, //邀请码 ---初始化---
  invited: [{ //受邀人 注册时查找invitaion_code, 并更新invited
    phone: String
  }],
  accounts: [{
    wxid: String,
    extensions: [{
      key: String,
      name: String,
      title: String,
      isOn: Boolean,
      status: String,
      chatroom: Array,
      dataFrom: String,
      peroid: Number,
      goodsName: String
    }]
  }],
  extensions: [{ //---初始化---
    key: String,
    name: String,
    title: String,
    isOn: Boolean,
    status: String,
    begin_time: Date,
    end_time: Date,
    chatroom: Array,
    dataFrom: String,
    peroid: Number,
    goodsName: String
  }],
  // status
  //2试用 1正常使用中 0过期 3待定
  // tb_wxfd: {
  //   status: String, //使用状态 默认未 0
  //   begin_time: Date, //开始时间 默认为
  //   end_time: Date, //结束时间 默认为
  //   comission: Number, //佣金
  //   setting: { //软件设置
  //     on: Boolean //开启状态 默认为false
  //   }
  // },
  // jd_wxfd: {
  //   status: String, //使用状态 默认未 0
  //   begin_time: Date, //开始时间 默认为
  //   end_time: Date, //结束时间 默认为
  //   comission: Number, //佣金
  //   setting: { //软件设置
  //     on: Boolean //开启状态 默认为false
  //   }
  // },
  order: [{
    order_num: String,
    create_time: Date,
    amount: Number
  }],
  cdkeys: [{
    phone: Number,
    cdkey_type: String,
    cdkey: String
  }],
  pid: String,
  taobao_user_id: String,
  auth_expired_time: String,
  jf_cookie: String,
  create_at: {
    type: Date,
    default: Date.now()
  },
  convertion_num: {
    type: Number,
    default: 5
  },
  comission: {
    type: Number,
    default: 0
  }, //佣金总额
  comission_withdraw: {
    type: Number,
    default: 0
  } //使用金额
});
// var a = new

var SwUser = mongoose.model('SwUser', SwUserSchema);
// var user = new SwUser({
//     password: '123',
//     phone: '15322054290'
// })

// user.save(function(err) {

// })
module.exports = SwUser;