var router = require('koa-router')();
var jwt = require('jsonwebtoken');
var User = require('../models/user');
var Order = require('../models/order');
var Message = require('../models/message');
var Captcha = require('../models/captcha');
var Image = require('../models/image');
const Tmall = require('../models/tmall');
const createCode = require('../utils/createCode');
const axios = require('axios');
const urlencode = require('urlencode');
const createInvitationCode = require('../utils/createInvitationCode');

var QcloudSms = require('qcloudsms_js');
// 短信应用SDK AppID
var appid = 1400234931; // SDK AppID是1400开头
// 短信应用SDK AppKey
var appkey = 'e75c1613fa59ab6250b11f0e095b9b97';
// // 需要发送短信的手机号码
// var phoneNumbers = ["21212313123", "12345678902", "12345678903"];
// 短信模板ID，需要在短信应用中申请
var templateId = 443722; // NOTE: 这里的模板ID`7839`只是一个示例，真实的模板ID需要在短信控制台中申请
// 签名
var smsSign = '京尚品'; // NOTE: 这里的签名只是示例，请使用真实的已申请的签名, 签名参数使用的是`签名内容`，而不是`签名ID`

router.prefix('/api/user');

// 获取全部图片
router.get('/image/all/:id', async function(ctx, next) {
  let JDfileList = await Image.find({ image_type: 'JD' }, null, {}).exec();
  let TBfileList = await Image.find({ image_type: 'TB' }, null, {}).exec();
  ctx.body = {
    JDfileList,
    TBfileList,
  };
});

// 获取全部图片
router.post('/image/save', async function(ctx, next) {
  let options = ctx.request.body;
  let { uid, url, name, image_type } = options;
  let image = new Image({
    uid,
    url,
    name,
    image_type,
  });
  await image.save();
  ctx.body = {
    code: 200,
    message: 'ok',
  };
});

// 获取全部订单
router.get('/orders/:id', async function(ctx, next) {
  const id = ctx.request.url.replace('/api/user/orders/', '');
  let orders = [];
  let tempUser = null;
  await User.findOne({ _id: id }, function(err, user) {
    tempUser = user;
  });
  // await Order.find({ phone: tempUser.phone }, function(err, objs) {
  //   orders = objs;
  // });
  orders = await Order.find({ phone: tempUser.phone }, null, {
    sort: '-create_at',
  }).exec();
  ctx.body = orders;
});

//注册
router.post('/register', async function(ctx, next) {
  var options = ctx.request.body;
  let tempUser = [];
  var { phone, password, captcha } = options;
  let tempCaptcha = '';
  let invitation_code = options.invitation_code || '';
  await Captcha.findOne({ phone: phone }, function(err, captchaObj) {
    tempCaptcha = captchaObj;
  });
  if (!tempCaptcha) {
    ctx.body = {
      message: '未收到验证码！',
    };
    return;
  }
  console.log(tempCaptcha.code, captcha);
  if (captcha != tempCaptcha.code) {
    ctx.body = {
      message: '验证码错误！',
    };
  } else {
    await User.find({ phone: phone }, function(err, user) {
      tempuser = user;
    });
    if (tempUser.length !== 0) {
      ctx.body = {
        message: '该手机号已注册过账号，请更换手机号！',
      };
    } else {
      // let now = new Date(Date.now());
      // let end_time = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000)
      let user = new User({
        username: phone,
        phone: phone,
        password: password,
        secret: Date.now().toString(),
      });
      await user.save(function(err) {
        console.log(err);
      });
      ctx.body = {
        status: 'ok',
        message: '注册成功',
      };
    }
  }
});

//获取短信验证码
router.get('/tecent/captcha/:id', async function(ctx, next) {
  let data = {};
  let tempCaptcha = undefined;
  let code = createCode();
  let phone = ctx.request.url.replace('/api/user/tecent/captcha/', '');

  await Captcha.findOne({ phone: phone }, function(err, captcha) {
    tempCaptcha = captcha;
  });
  console.log(code);

  if (!tempCaptcha) {
    let newCaptcha = new Captcha({
      phone: phone,
      code: code,
    });
    await newCaptcha.save(function(err) {
      console.log(err);
    });
  } else {
    await Captcha.findOneAndUpdate({ phone: phone }, { code: code });
  }
  // 实例化QcloudSms
  var qcloudsms = QcloudSms(appid, appkey);
  //
  var ssender = qcloudsms.SmsSingleSender();
  var params = [code];
  await ssender.sendWithParam(86, phone, templateId, params, smsSign, '', '', function(
    err,
    res,
    resData,
  ) {
    if (err) {
      console.log('err: ', err);
    } else {
      console.log('request data: ', res.req);
      console.log('response data: ', resData);
    }
  });
  ctx.body = {
    status: 'ok',
    message: '短信已发送！',
  };
});

//获取语音验证码
router.get('/captcha/:id', async function(ctx, next) {
  let data = {};
  let tempCaptcha = undefined;
  let code = createCode();
  let phone = ctx.request.url.replace('/api/user/captcha/', '');
  let account = 'VM84443780';
  let password = '49b483881197c231fc831a997a385e9c';
  // let mobile = phone
  let format = 'json';
  let content = urlencode(
    `您的企鹅酱验证码是${code}。您的企鹅酱验证码是${code}。您的企鹅酱验证码是${code}。`,
  );
  let url = `http://api.vm.ihuyi.com/webservice/voice.php?method=Submit&account=${account}&password=${password}&mobile=${phone}&format=${format}&content=${content}`;
  console.log(code);
  await Captcha.findOne({ phone: phone }, function(err, captcha) {
    tempCaptcha = captcha;
  });
  // console.log(tempCaptcha)

  if (!tempCaptcha) {
    let newCaptcha = new Captcha({
      phone: phone,
      code: code,
    });
    await newCaptcha.save(function(err) {
      console.log(err);
    });
  } else {
    await Captcha.findOneAndUpdate({ phone: phone }, { code: code });
  }
  await axios
    .get(url)
    .then(res => {
      // console.log(res.data)
      data = res.data;
    })
    .catch(err => console.log(err));
  ctx.body = data;
});

//登录
router.post('/login', async function(ctx, next) {
  var options = ctx.request.body;
  var { phone, type, password } = options;

  console.log(options);
  var token = undefined;
  var info = {};
  await User.findOne({ phone: phone, password: password }, function(err, user) {
    console.log(user);
    if (err) {
      ctx.body = {
        message: '请求错误！',
      };
    }
    if (user) {
      token = jwt.sign({ phone: user.phone, _id: user._id }, 'token', { expiresIn: '7d' });
      info = user;
      ctx.body = {
        message: '登录成功！',
        status: 'ok',
        id: info._id,
        type,
        currentAuthority: info.auth || 'user',
        token: token,
      };
    } else {
      ctx.body = {
        message: '用户名或密码错误！',
      };
    }
  });
});

//获取当前用户信息
router.post('/current', async function(ctx, next) {
  const options = ctx.request.body;
  let user = await User.findOne({ _id: options.id }, null, {}).exec();
  // console.log(tempUser)
  // let links = tempUser.links.toString()
  // let user = Object.assign(tempUser, {
  //     links: links
  // })
  // console.log(user)
  // if (user.status == '0') {
  //     ctx.body = user;
  //     return;
  // }
  // let { end_time } = user;
  // let end_time_stamp = end_time.valueOf();
  // if (end_time_stamp > Date.now()) {
  //未过期
  ctx.body = user;
  // } else {
  //     await User.findOneAndUpdate({ _id: user._id }, { status: '0' })
  //     user = await User.findOne({ _id: options.id }, null, {}).exec();
  //     ctx.body = user;
  // }
});

//club 保存当前用户信息
router.post('/save', async function(ctx, next) {
  const options = ctx.request.body;
  console.log(options);
  // let links = options.links.split(',')
  // console.log(options.links)
  // return
  // options = Object.assign({}, options, {
  //     links
  // })
  let tempUser = null;
  await User.findOne({ route: options.route }, function(err, user) {
    tempUser = user;
  });
  if (tempUser && tempUser._id != options.id) {
    ctx.body = {
      message: '该页面路由已存在，请换成其他路由！',
    };
    return;
  }
  await User.updateOne({ _id: options.id }, options);
  ctx.body = {
    status: 'ok',
    message: '更新成功！',
  };
});

const showOptionName = key => {
  switch (key) {
    case 'hongbao':
      return {
        key: 'hongbao',
        name: '红包',
        icon: 'icon-hongbao-',
      };
    case 'huafei':
      return {
        key: 'huafei',
        name: '话费',
        icon: 'icon-ziyuan',
      };
    case 'choujiang':
      return {
        key: 'choujiang',
        name: '抽奖',
        icon: 'icon-xunzhang',
      };
    case 'fuli':
      return {
        key: 'fuli',
        name: '福利',
        icon: 'icon-liwu_jiangpin_choujiang',
      };
    case 'tmall':
      return {
        key: 'tmall',
        name: '天猫包邮',
        icon: 'icon-liwu_jiangpin_choujiang',
      };

    default:
      return {
        key: '',
        name: '',
        icon: '',
      };
  }
};
// 获取用户信息
router.get('/info/:id', async function(ctx, next) {
  let route = ctx.request.url.replace('/api/user/info/', '');
  let tempUser = null;
  await User.findOne({ route: route }, function(err, user) {
    // console.log(user);
    tempUser = user;
  });
  if (!tempUser) {
    ctx.body = null;
    return;
  }
  if (tempUser.status == '0') {
    ctx.body = tempUser;
    return;
  }
  let { end_time } = tempUser;
  let end_time_stamp = end_time.valueOf();
  if (end_time_stamp > Date.now()) {
    //未过期
    let {
      name,
      phone,
      logo,
      route,
      QQ_qrcode,
      QQ_url,
      ad,
      coupon_url,
      data_from,
      sid,
      pid,
      show_options,
      links,
    } = tempUser;
    let tempMessages = [];
    let newOptions = [];
    for (let option of await show_options) {
      await newOptions.push(showOptionName(option));
    }
    if (data_from == 'group') {
      console.log(data_from);
      tempMessages = await Message.find({ phone: phone }, null, {
        sort: '-create_at',
        limit: 100,
      }).exec();
      ctx.body = {
        name: name,
        logo: logo,
        route: route,
        QQ_qrcode: QQ_qrcode,
        QQ_url: QQ_url,
        ad: ad,
        sid: sid,
        pid: pid,
        coupon_url: coupon_url,
        data_from: data_from,
        messages: tempMessages,
        options: newOptions,
        links,
      };
      // console.log(tempMessages[0]);
    } else {
      ctx.body = {
        name: name,
        logo: logo,
        route: route,
        QQ_qrcode: QQ_qrcode,
        QQ_url: QQ_url,
        ad: ad,
        sid: sid,
        pid: pid,
        coupon_url: coupon_url,
        data_from: data_from,
        messages: tempMessages,
        options: newOptions,
        links,
      };
    }
    console.log(tempMessages.length);
  } else {
    await User.findOneAndUpdate({ _id: tempUser._id }, { status: '0' }, function(err, user) {
      tempUser = user;
    });
    ctx.body = tempUser;
  }
});

// 获取一条群消息
router.get('/message/:id', async function(ctx, next) {
  let id = ctx.request.url.replace('/api/user/message/', '');
  let tempMsg = null;
  await Message.findOne({ _id: id }, function(err, msg) {
    tempMsg = msg;
  });
  ctx.body = tempMsg;
});

//club 验证账号和密码
router.post('/auth', async function(ctx, next) {
  const options = ctx.request.body;
  let { phone, password } = options;
  let isAuth = false;
  let tempUser = null;
  await User.findOne({ phone: phone, password: password }, function(err, user) {
    if (user) {
      isAuth = true;
      tempUser = user;
    }
  });
  if (isAuth) {
    ctx.body = tempUser.route;
  } else {
    ctx.body = 'false';
  }
});

//天猫包邮
router.post('/tmall/save', async function(ctx, next) {
  const options = ctx.request.body;
  const tmall = new Tmall(options);
  await tmall.save(function(err) {
    if (err) console.log(err);
  });
  ctx.body = 'ok';
});

//天猫包邮
router.get('/tmall/all', async function(ctx, next) {
  let tempTmalls = [];
  tempTmalls = await Tmall.find({}, null, {
    sort: '-createAt',
  }).exec();
  ctx.body = tempTmalls;
});

//天猫包邮
router.get('/tmall/item/:id', async function(ctx, next) {
  let id = ctx.request.url.replace('/api/user/tmall/item/', '');
  let tempTmall = null;
  await Tmall.findOne({ _id: id }, function(err, tmall) {
    if (err) console.log(err);
    console.log(tmall);
    tempTmall = tmall;
  });
  ctx.body = tempTmall;
});

module.exports = router;
