var net = require('net');
var User = require('./models/user');
var Message = require('./models/message');
var iconv = require('iconv-lite');

const len = 40;
let expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
let regex = new RegExp(expression);

//模块引入
var listenPort = 4002; //监听端口
var server = net
  .createServer(function(socket) {
    // 创建socket服务端
    console.log('connect: ' + socket.remoteAddress + ':' + socket.remotePort);
    // socket.setEncoding('utf8');
    //接收到数据
    socket.on('data', async function(chunk) {
      var dataStr = iconv.decode(chunk, 'gbk');
      console.log('client send:' + dataStr);
      if (dataStr != 1) {
        let dataArr = dataStr.split('#');
        let phone = dataArr[0].replace(' ', '');
        let password = dataArr[1].replace(' ', '');
        let message = dataArr[2];
        let title = '未知';
        if (message.indexOf('CQ') > -1) {
          // 替换cq码
          message = await message.replace(/\[.*?\]/g, ''); // 非贪婪模式匹配[]内所有内容
        }
        let msgArr = await message.split(/[\n]/);
        console.log('msgArr', msgArr);
        for (let i = 0; i < msgArr.length; i++) {
          let msg = await msgArr[i];
          if (msg.length > 3 && !msg.match(regex)) {
            console.log('msgmsgmsgmsgmsg', msg);
            title = await msg;
            break;
          }
        }
        if (title === '未知') {
          title = message.replace(regex, '');
        }
        console.log('phone: ', phone, 'password: ', password, 'message: ', message);
        // console.log(chunk)
        let isAuth = false;
        await User.findOne({ phone: phone }, function(err, user) {
          // console.log(user, password, user.name, user.passowrd, user.password == password, user.status != '0')
          if (err) console.log(err);
          if (user && user.password == password && user.status != '0') {
            console.log('user found');
            isAuth = true;
          }
        });
        console.log('isAuth', isAuth);
        if (isAuth) {
          let now = new Date(Date.now());
          let end_time = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000);
          let msg = await new Message({
            phone: phone,
            message: message,
            title: title,
            // create_at: now,
            expired_at: end_time,
            desc: message.length >= len ? message.substring(0, len) + '...' : message,
          });
          console.log('save msg', msg);
          await msg.save(function(err) {
            if (err) console.log(err);
          });
        }
      }
    });
    socket.write('Hello client!\r\n');
    // socket.pipe(socket);
    //数据错误事件
    socket.on('error', function(exception) {
      console.log('socket error:' + exception);
      socket.end();
    });
    //客户端关闭事件
    socket.on('close', function(data) {
      console.log('client closed!');
      // socket.remoteAddress + ' ' + socket.remotePort);
    });
  })
  .listen(listenPort);
//服务器监听事件
server.on('listening', function() {
  console.log('server listening:' + server.address().port);
});
//服务器错误事件
server.on('error', function(exception) {
  console.log('server error:' + exception);
});
