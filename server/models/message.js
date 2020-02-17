var mongoose = require('mongoose');

var MessageSchema = new mongoose.Schema({
  phone: String,
  message: String,
  title: {
    type: String,
    default: '未知',
  },
  desc: {
    type: String,
    default: '未知',
  },
  create_at: {
    type: Date,
    default: Date.now,
    expires: 86400,
  },
  expired_at: {
    type: Date,
  },
});

var Message = mongoose.model('Message', MessageSchema);

// var a = new Message({
//     phone: '123',
//     message: '123'
// })
// a.save((err) => console.log(err))

module.exports = Message;
