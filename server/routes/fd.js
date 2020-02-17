var router = require('koa-router')();
var jwt = require('jsonwebtoken');
const axios = require('axios')
const SwUser = require('../models/swuser')
const FdOrder = require('../models/fdorder')
const Extension = require('../models/extension')
const Captcha = require('../models/captcha')
const createCode = require('../utils/createCode')
const createInvitationCode = require('../utils/createInvitationCode')
var urlencode = require('urlencode')

var QcloudSms = require("qcloudsms_js");
// 短信应用SDK AppID
var appid = 1400234931;  // SDK AppID是1400开头
// 短信应用SDK AppKey
var appkey = "e75c1613fa59ab6250b11f0e095b9b97";
// // 需要发送短信的手机号码
// var phoneNumbers = ["21212313123", "12345678902", "12345678903"];
// 短信模板ID，需要在短信应用中申请
var templateId = 443722;  // NOTE: 这里的模板ID`7839`只是一个示例，真实的模板ID需要在短信控制台中申请
// 签名
var smsSign = "京尚品";  // NOTE: 这里的签名只是示例，请使用真实的已申请的签名, 签名参数使用的是`签名内容`，而不是`签名ID`



router.prefix('/api/fd');

//验证token
async function verifyToken(user_id, token) {
  if(!token) {
    return false
  }
  console.log(0)
  let verified = false
  await SwUser.findOne({ _id: user_id}, function(err, user) {
    if(err) console.log(err)
    try {
      var decoded = jwt.verify(token.replace('Bearer ', ''), user.secret)
      console.log(1)
      verified = true
    } catch(err) {
      console.log(2)
      verified = false
    }
  })
  return verified
}

router.get('/extensions', async function(ctx, next) {
  console.log('extensions')
  let data = []
  await Extension.find({}, function(err, extensions) {
      data = extensions
  })
  ctx.body = data
})

router.post('/login', async function (ctx, next) {
  var options = ctx.request.body;
  var { phone, password } = options;

  console.log(options);
  var token = undefined;
  var info = null;
  await SwUser.findOne({ phone: phone, }, function (err, user) {
    console.log('user', user)
    if (err) {
      ctx.body = {
        message: '数据库错误！'
      }
    }
    info = user
  });
  if(!info) {
    ctx.body = {
      message: '用户名或密码错误！'
    }
    return
  }
  if (info.password && info.password === password) {
    let secret = Date.now().toString()  
    await SwUser.updateOne({_id: info._id}, { secret: secret })
    token = jwt.sign({ phone: info.phone, _id: info._id, }, secret, { expiresIn: '700d', })
    ctx.body = {
      message: '登录成功！',
      status: 'ok',
      id: info._id,
      token: token,
    }
  } else {
    ctx.body = {
      message: '用户名或密码错误！'
    }
  }
});

router.post('/register', async function (ctx, next) {
  var options = ctx.request.body;
  let tempUser = []
  var { phone, password, captcha } = options
  let tempCaptcha = ''
  let invitation_code = options.invitation_code || ''
  await Captcha.findOne({ phone: phone }, function(err, captchaObj) {
    tempCaptcha = captchaObj
  })
  if(!tempCaptcha) {
    ctx.body = {
      message: "未收到验证码！"
    }
    return
  }
  console.log(tempCaptcha.code, captcha)
  if(captcha != tempCaptcha.code) {
    ctx.body = {
      message: "验证码错误！"
    }
  } else {
     await SwUser.find({phone: phone}, function(err, swuser) {tempUser = swuser})
    if(tempUser.length !== 0) {
      ctx.body = {
        message: "该手机号已注册过账号，请更换手机号！"
      }
    } else {
      let now = new Date(Date.now());
      let end_time = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000)
      let user = new SwUser({
        username: phone,
        phone: phone,
        password: password,
        secret: Date.now().toString(),
        avatar: '',
        invitation_code: createInvitationCode(),
        extensions: [
            {
                "key": "tb_wxfd",
                "name": "tb_wxfd",
                "title": "淘宝微信发单（精简版）",
                "isOn": false,
                "status": "2",
                "begin_time": now,
                "end_time": end_time,
                "peroid": 15,
                "goodsName": "short",
                "dataFrom": "bangdan"
            }, 
            {
                "key": "tb_wxfd_custom",
                "name": "tb_wxfd_custom",
                "title": "淘宝微信发单（定制版）",
                "isOn": false,
                "status": "3",
                "begin_time": now,
                "end_time": end_time,
                "peroid": 15,
                "goodsName": "short",
                "dataFrom": "bangdan",
            }, 
            {   
                "key": "jd_wxfd",
                "name": "jd_wxfd",
                "title": "京东微信发单（精简版）",
                "isOn": false,
                "status": "2",
                "begin_time": now,
                "end_time": end_time,
                "peroid": 15,
                "goodsName": "short"
            }, 
            {   
                "key": "jd_wxfd_custom",
                "name": "jd_wxfd_custom",
                "title": "京东微信发单（定制版）",
                "isOn": false,
                "status": "3",
                "begin_time": now,
                "end_time": now,
                "peroid": 15,
                "goodsName": "short"
            }
        ],
        invited_by: invitation_code
      })
      if(invitation_code) {
        await SwUser.findOneAndUpdate({ invitation_code: invitation_code }, {
          $push: {
            invited: { phone: phone }
          }
        })
      }
      await user.save(function(err){  console.log(err)})
      ctx.body = {
        status: 'ok',
        message: '注册成功'
      }
    }
  }
});

// 重置密码
router.post('/reset', async function (ctx, next) {
  var options = ctx.request.body;
  var { phone, password, captcha } = options
  let tempCaptcha = null
  await Captcha.findOne({ phone: phone }, function(err, captchaObj) {
    tempCaptcha = captchaObj
  })
  if(!tempCaptcha) {
    ctx.body = {
      message: "未收到验证码！"
    }
    return
  }
  console.log(tempCaptcha.code, captcha)
  if(captcha != tempCaptcha.code) {
    ctx.body = {
      message: "验证码错误！"
    }
  } else {
     await SwUser.findOneAndUpdate({phone: phone}, { password: password })
      ctx.body = {
        status: 'ok',
        message: '更改密码成功'
      }
  }
});


//获取短信验证码
router.get('/captcha/tencent/:id', async function(ctx, next) {
    let data = {}
    let tempCaptcha = undefined
    let code = createCode()
    let phone = ctx.request.url.replace('/api/fd/captcha/', '')


    await Captcha.findOne({phone: phone}, function(err, captcha) {
      tempCaptcha = captcha
    })
    console.log(code)

    if(!tempCaptcha) {
        let newCaptcha = new Captcha({
          phone: phone,
          code: code
        })
      await newCaptcha.save(function(err){ console.log(err) })
    } else {
      await Captcha.findOneAndUpdate({phone: phone}, {code: code})
    }
    // 实例化QcloudSms
    var qcloudsms = QcloudSms(appid, appkey);
    //
    var ssender = qcloudsms.SmsSingleSender();
    var params = [code];
    await ssender.sendWithParam(86, phone, templateId, params, smsSign, "", "", function(err, res, resData) {
        if (err) {
            console.log("err: ", err);
        } else {
            console.log("request data: ", res.req);
            console.log("response data: ", resData);
        }
    })
    ctx.body = {
      status: 'ok',
      message: '短信已发送！'
    }
  })

//获取语音验证码
router.get('/captcha/:id', async function(ctx, next) {
  let data = {}
  let tempCaptcha = undefined
  let code = createCode()
  let phone = ctx.request.url.replace('/api/fd/captcha/', '')
  let account = 'VM84443780'
  let password = '49b483881197c231fc831a997a385e9c'
  // let mobile = phone
  let format = 'json'
  let content = urlencode(`您的企鹅酱验证码是${code}。您的企鹅酱验证码是${code}。您的企鹅酱验证码是${code}。`)
  let url = `http://api.vm.ihuyi.com/webservice/voice.php?method=Submit&account=${account}&password=${password}&mobile=${phone}&format=${format}&content=${content}`
  console.log(code)
  await Captcha.findOne({phone: phone}, function(err, captcha) {
    tempCaptcha = captcha
  })
  // console.log(tempCaptcha)

  if(!tempCaptcha) {
      let newCaptcha = new Captcha({
        phone: phone,
        code: code
      })
    await newCaptcha.save(function(err){ console.log(err) })
  } else {
    await Captcha.findOneAndUpdate({phone: phone}, {code: code})
  }
  await axios.get(url).then(res => {
    // console.log(res.data)
    data = res.data
  }).catch(err => console.log(err))
  ctx.body = data
})


router.get('/user/current/:id', async function (ctx, next) {
  const user_id = ctx.request.url.replace('/api/fd/user/current/', '')
  let token = ctx.req.headers.authorization || undefined
  let verified = await verifyToken(user_id, token)
  let info = {}
  if (verified) {
    await SwUser.findOne({ _id: user_id }, function(err, user) {
      info = user
    })
    //检测插件是否过期
    let extensions = info.extensions
    for(let extension of extensions) {
      let { name, status, end_time } = extension
      let end_time_stamp = end_time.valueOf()
      if(status !== '0' && status !== '3' && end_time_stamp <= Date.now()) {
        await SwUser.findOneAndUpdate({ _id: user_id, "extensions.name": name }, {
          "$set": {
            "extensions.$.status": '0'
          }
        })
      }
    }
    await SwUser.findOne({ _id: user_id }, function(err, user) {
      info = user
    })
    ctx.body = info
  } else {
    ctx.body = {
      message: '令牌过期或在其他地方登录，请重新登录！'
    }
  }
})


// 佣金转化为天数
router.post('/user/comission/convertion/:id', async function (ctx, next) {
  const user_id = ctx.request.url.replace('/api/fd/user/comission/convertion/', '')
  const options = ctx.request.body
  let token = ctx.req.headers.authorization || undefined
  let verified = await verifyToken(user_id, token)
  if (verified) {
    let user = null
    await SwUser.findOne({_id: user_id}, function(err, swuser) {
      user = swuser
    })
    if(user && user.convertion_num <= 0) {
      ctx.body = {
        message: "剩余可转化次数不足！"
      }
    } else if(user && (user.comission - user.comission_withdraw) < options.convertion_amount) {
      ctx.body = {
        message: "佣金不足！"
      }
    } else {
      let convertion_amount = options.convertion_amount
      let name = options.convertion_type
      let extension = null
      let user_extension = user.extensions.find(item => item.name === name)
      await Extension.findOne({ name: name }, function(err, obj) {
        extension = obj
      })
      if(!user_extension) {
        ctx.body = {
        message: "账户中不存在该插件！"
      }
        return
      }
      if(!extension) {
        ctx.body = {
        message: "插件库中不存在该插件！"
      }
        return
      }
      let peroid =  30 / extension.price.month  * convertion_amount * 3
      let { status, begin_time, end_time } = user_extension
      if(status === '1' || status === '2') {
        new_begin_time = begin_time
        new_end_time = new Date(end_time.getTime() + parseInt(peroid) * 24 * 60 * 60 * 1000)
      } else {
        let now = new Date(Date.now())
        new_begin_time = now
        new_end_time = new Date(now.getTime() + parseInt(peroid) * 24 * 60 * 60 * 1000)
      }
      let new_convertion_num = user.convertion_num - 1
      let new_comission_withdraw = user.comission_withdraw + convertion_amount
      await SwUser.findOneAndUpdate({ "_id": user_id, "extensions.name": name }, {
        "$set": {
          "comission_withdraw": new_comission_withdraw,
          "convertion_num": new_convertion_num,
          "extensions.$.status": '1',
          "extensions.$.begin_time": new_begin_time,
          "extensions.$.end_time": new_end_time
        }
      })

      ctx.body = {
        status: 'ok',
        message: '转化天数成功'
      }
    }
  } else {
    ctx.body = {
      message: '令牌过期或在其他地方登录，请重新登录！'
    }
  }
})

// 添加微信账号插件配置
router.post('/user/account/add/:id', async function (ctx, next) {
  const user_id = ctx.request.url.replace('/api/fd/user/account/add/', '')
  const options = ctx.request.body
  let token = ctx.req.headers.authorization || undefined
  let verified = await verifyToken(user_id, token)
  if (verified) {
    await SwUser.updateOne({_id: user_id}, {accounts: options.accounts})
    ctx.body = {
        status: 'ok',
        message: '保存成功'
      }
  } else {
    ctx.body = {
      message: '令牌过期或在其他地方登录，请重新登录！'
    }
  }
})

// 更改并保存微信账号插件配置
router.post('/user/account/setting/save/:id', async function (ctx, next) {
  const user_id = ctx.request.url.replace('/api/fd/user/account/setting/save/', '')
  const options = ctx.request.body
  let token = ctx.req.headers.authorization || undefined
  let verified = await verifyToken(user_id, token)
  if (verified) {
    let user = null
    let { wxid, key, isOn, dataFrom, goodsName, peroid, chatroom } = options
    // let { key, wxid, isOn, peroid } = options
    await SwUser.findOne({"_id": user_id}, function(err, info) {
      user = info
    })
    let account = user.accounts.find(item => item.wxid === wxid)
    let newExtensions = []
    for(let extension of account.extensions) {
      if(extension.key === key) {
        let newExtension = Object.assign(extension, {
          isOn: isOn,
          peroid: peroid,
          dataFrom: dataFrom,
          goodsName: goodsName,
          chatroom: chatroom
        })
        newExtensions.push(newExtension)
      } else {
        newExtensions.push(extension)
      }
      // newExtensions.push(extension)
    }
    let newAccount = Object.assign(account, {
      extensions: newExtensions
    })
    await SwUser.updateOne({ "_id":  user_id, "accounts.wxid": wxid }, {
      "$set": {
        "accounts.$": newAccount
      }
    })
    await SwUser.findOne({"_id": user_id}, function(err, info) {
      user = info
    })
    // ctx.body = user.accounts
    ctx.body = {
        status: 'ok',
        message: '保存成功'
      }
  } else {
    ctx.body = {
      message: '令牌过期或在其他地方登录，请重新登录！'
    }
  }
})


// 保存淘宝pid、taobao_user_id
router.post('/user/account/info/save/:id', async function (ctx, next) {
  const user_id = ctx.request.url.replace('/api/fd/user/account/info/save/', '')
  const options = ctx.request.body
  let token = ctx.req.headers.authorization || undefined
  let verified = await verifyToken(user_id, token)
  if (verified) {
    let { pid, taobao_user_id,  jf_cookie } = options
    let auth_expired_time = options.auth_expired_time || ''
    await SwUser.updateOne({_id: user_id}, {pid: pid, taobao_user_id: taobao_user_id, auth_expired_time: auth_expired_time, jf_cookie: jf_cookie})
    ctx.body = {
        status: 'ok',
        message: '保存成功'
      }
  } else {
    ctx.body = {
      message: '令牌过期或在其他地方登录，请重新登录！'
    }
  }
})

//获取所有订单
router.get('/user/orders/:id', async function(ctx, next) {
  console.log(123)
  const phone = ctx.request.url.replace('/api/fd/user/orders/', '')
  let orders = []
  await FdOrder.find({ phone: phone }, function(err, objs) {
    orders = objs
  })
  ctx.body = orders
})

//获取所有订单
router.get('/user/invited/:id', async function(ctx, next) {
  console.log(123)
  const user_id = ctx.request.url.replace('/api/fd/user/invited/', '')
  let user = null
  await SwUser.findOne({ _id: user_id }, function(err, obj) {
    // console.log(user)
    if(err) {
      ctx.body = []
    }
    user = obj
  })
  let { invited } = await user
  let newInvited = []
  for(let item of await invited) {
    let phone = item.phone
    let amount = 0
    let orders = []
    await FdOrder.find({ phone: phone }, function(err, objs) {
      orders = objs
    })
    let order_num = await orders.length
    for(let order of await orders) {
      let single_amount = await order.amount
      amount = await amount + single_amount
    }
    await newInvited.push({
      phone: phone,
      order_num : order_num,
      amount: amount
    })
  } 
  ctx.body = newInvited
})

// 转化佣金
router.post('/user/comission/convert/:id', async function (ctx, next) {
  const user_id = ctx.request.url.replace('/api/fd/user/comission/convert/', '')
  const options = ctx.request.body
  let token = ctx.req.headers.authorization || undefined
  let verified = await verifyToken(user_id, token)
  if (verified) {
    await SwUser.updateOne({_id: user_id}, {accounts: options.accounts})
    ctx.body = {
        status: 'ok',
        message: '保存成功'
      }
  } else {
    ctx.body = {
      message: '令牌过期或在其他地方登录，请重新登录！'
    }
  }
})

// 添加当前wxid插件配置
router.post('/user/account/extension/add/:id', async function (ctx, next) {
  console.log('wxid')
  const user_id = ctx.request.url.replace('/api/fd/user/account/extension/add/', '')
  const account = ctx.request.body
  let newExtension = Object.assign({}, {...account.extension}, {key: Date.now().toString()})
  console.log(account, newExtension)
  let token = ctx.req.headers.authorization || undefined
  let verified = await verifyToken(user_id, token)
  if (verified) {
    await SwUser.updateOne({"_id": user_id, "accounts.wxid": account.wxid}, {
      "$push": {
        "accounts.$.extensions": newExtension
      }
    }, { upsert: true, new: true })
    ctx.body = {
      status: 'ok',
      message: '添加成功！'
    }

  } else {
    ctx.body = {
      message: '令牌过期或在其他地方登录，请重新登录！'
    }
  }
})

router.get('/test/:id', async function(ctx, next) {
  const user_id = ctx.request.url.replace('/api/fd/test/', '')
  let token = ctx.req.headers.authorization || undefined
  let verified = await verifyToken(user_id, token)
  if (verified) {
    ctx.body = {
      message: ''
    }
  } else {
    ctx.body = {
      message: '令牌过期或在其他地方登录，请重新登录！'
    }
  }
})

router.post('/check', async function(ctx, next) {
  console.log('check')
  let options = ctx.request.body
  let { phone, name } = options
  let user = undefined
  await SwUser.findOne({ phone: phone }, function(err, swuser) {
    user = swuser
  })
  if(!user) {
    ctx.body = { message: '未查询到当前账户' }
    return
  }
  let extension = await user.extensions.find(extension => extension.name === name)
  let { end_time } = extension
  let end_time_stamp = end_time.valueOf()
  if(end_time_stamp > Date.now()) {
    //未过期
    console.log(extension, end_time, end_time_stamp)
    ctx.body = {
      message: 'ok',
    }
  } else {
    await SwUser.findOneAndUpdate({ "phone": phone, "extensions.name": name }, {
      "$set": {
        "extensions.$.status": '0'
      }
    })
    ctx.body = {
      message: 'expired'
    }
  }
})

// 检查所有的插件是否过期
router.get('/checkall/:id', async function(ctx, next) {
  let id = ctx.request.url.replace('/api/fd/checkall/', '')
  console.log('check')
  let user = undefined
  await SwUser.findOne({ _id: id }, function(err, swuser) {
    user = swuser
  })
  if(!user) {
    ctx.body = { message: '未查询到当前账户' }
    return
  }
  for(let extension of user.extensions) {
    let { name, end_time } = extension
    let end_time_stamp = end_time.valueOf()
    if(end_time_stamp > Date.now()) {
      //未过期
      console.log(extension, end_time, end_time_stamp)

    } else {
      await SwUser.findOneAndUpdate({ "_id": id, "extensions.name": name }, {
        "$set": {
          "extensions.$.status": '0'
        }
      })
    }
  }
  ctx.body = {
      message: 'check all extensions ok',
  }
  // let extension = await user.extensions.find(extension => extension.name === name)

})


module.exports = router;
