/*
 * @Descripttion:
 * @version:
 * @Author: seraphy
 * @Date: 2019-10-17 16:13:43
 * @LastEditors: seraphy
 * @LastEditTime : 2020-02-16 13:29:41
 */
var mongoose = require('mongoose');

var db = mongoose.connection;

// mongoose.connect('mongodb://localhost/club', {
//   useUnifiedTopology: true,
// });
// mongoose.Promise = global.Promise

mongoose.connect('mongodb://localhost/club', {
  auth: { authSource: 'admin' },
  user: 'custom123',
  pass: 'custom123',
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.set('useCreateIndex', true);
mongoose.set(`useFindAndModify`, true);

module.exports = db;
