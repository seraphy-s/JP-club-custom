var mongoose = require('mongoose');

var TmallSchema = new mongoose.Schema({
  activityId: String,
  msg: String,
  itemId: String,
  createAt: {
      type: Date,
      default: Date.now,
      expires: 86400
  }
});

var Tmall = mongoose.model('Tmall', TmallSchema);

module.exports = Tmall;
