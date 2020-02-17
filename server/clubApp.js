const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser')();
const logger = require('koa-logger');
const jwt = require('jsonwebtoken');
const koaJwt = require('koa-jwt');
const cors = require('koa2-cors');
var socket_server = require('./socket');

var db = require('./db/config');

// const club = require('./routes/club/club');
const pay = require('./routes/pay');
const index = require('./routes/index');
const users = require('./routes/users');

// error handler
onerror(app);

// check();
app.use(cors());
app.use((ctx, next) => {
  return next().catch(err => {
    if (err.status === 401) {
      ctx.status = 401;
      ctx.body = '页面受保护，请登录后再查看\n';
    } else {
      throw err;
    }
  });
});

app.use(
  koaJwt({
    secret: 'token',
  }).unless({
    path: [
      // /^\/api/,
      /\/api\/coupon/,
      /\/api\/fd/,
      /\/api\/pay/,
      /\/api\/user\/info/,
      /\/api\/user\/message/,
      /\/api\/user\/tmall/,
      /\/api\/user\/auth/,
      /\/api\/user\/login/,
      /\/api\/user\/register/,
      /\/api\/user\/captcha/,
      /\/api\/user\/current/,
      /\/api\/order\/status\/1/,
      /^\/user/,
      /^\/admin/,
      /^\/$/,
      /css$/,
      /js$/,
      /\/genToken/,
      /png$/,
      /^\/order/,
      /^\/account/,
      /^\/owner/,
      /^\/jp/,
    ],
  }),
);

// middlewares
app.use(bodyparser);
app.use(json());
app.use(logger());

app.use(require('koa-static')(__dirname + '/dist'));

app.use(
  views(__dirname + '/dist', {
    extension: 'ejs',
  }),
);

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// routes
// app.use(fd.routes(), fd.allowedMethods());
app.use(pay.routes(), pay.allowedMethods());
// app.use(coupon.routes(), coupon.allowedMethods());
// app.use(order.routes(), order.allowedMethods());
app.use(users.routes(), users.allowedMethods());
// app.use(club.routes(), club.allowedMethods());
app.use(index.routes(), index.allowedMethods());

module.exports = app;
