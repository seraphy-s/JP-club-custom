var mongoose = require('mongoose');

var OrderSchema = new mongoose.Schema({
  out_trade_no: String, //商户订单号
  trade_no: String, // 支付宝交易号
  subject: String,
  phone: String,
  name: String,
  peroid: Number,
  amount: Number,
  create_at: Date
});

var Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
