const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser')();
const logger = require('koa-logger');
const jwt = require('jsonwebtoken');
const koaJwt = require('koa-jwt');
const cors = require('koa2-cors')
const check = require('./check');


var db = require('./db/config');

const index = require('./routes/index');
const order = require('./routes/order');
const users = require('./routes/users');
const coupon = require('./routes/coupon');
const fd = require('./routes/fd');
const pay = require('./routes/pay');


// error handler
onerror(app);

check();
app.use(cors())
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

// app.use(function (ctx, next) {
//   if (ctx.url.match(/^\/api\/order\//)) {
//     ctx.body = 'protected\n';
//   }
//   next()
// });
app.use(
  koaJwt({
    secret: 'token',
  }).unless({
    path: [
      // /^\/api/,
      /\/api\/coupon/,
      /\/api\/fd/,
      /\/api\/pay/,
      /\/api\/user\/login/,
      /\/api\/user\/register/,
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
    extension: 'jade',
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
app.use(fd.routes(), fd.allowedMethods());
app.use(pay.routes(), pay.allowedMethods());
app.use(coupon.routes(), coupon.allowedMethods());
app.use(order.routes(), order.allowedMethods());
app.use(users.routes(), users.allowedMethods());
app.use(index.routes(), index.allowedMethods());


module.exports = app;
