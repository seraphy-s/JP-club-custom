var router = require('koa-router')();
var Order = require('../models/order');
var axios = require('axios');
var qs = require('qs');
var logger = require('../utils/logger')('order');
//tencent image
const tencentcloud = require('tencentcloud-sdk-nodejs');

const OcrClient = tencentcloud.ocr.v20181119.Client;
const models = tencentcloud.ocr.v20181119.Models;

const Credential = tencentcloud.common.Credential;
const ClientProfile = tencentcloud.common.ClientProfile;
const HttpProfile = tencentcloud.common.HttpProfile;

//

router.prefix('/api/order');

router.get('/all', async function(ctx, next) {
  await Order.find(function(err, orders) {
    ctx.body = orders;
  });
});
//
router.get('/status/all', async function(ctx, next) {
  await Order.find(function(err, orders) {
    ctx.body = orders;
  });
});

//获取商品数量
router.get('/counts', async function(ctx, next) {
  const start = new Date(Date.now());
  const now = new Date(Date.now());
  const end = now.setDate(now.getDate() + 1);
  let counts = {};
  await Order.countDocuments({}, function(err, count) {
    counts.all = count;
  });
  await Order.countDocuments({ status: '0' }, function(err, count) {
    counts['0'] = count;
  });
  await Order.countDocuments({ status: '1' }, function(err, count) {
    counts['1'] = count;
  });
  await Order.countDocuments({ status: '2' }, function(err, count) {
    counts['2'] = count;
  });
  await Order.countDocuments({ status: '3' }, function(err, count) {
    counts['3'] = count;
  });
  await Order.countDocuments({ status: '4' }, function(err, count) {
    counts['4'] = count;
  });
  await Order.countDocuments({ status: '5' }, function(err, count) {
    counts['5'] = count;
  });
  await Order.countDocuments({ status: '6' }, function(err, count) {
    counts['6'] = count;
  });
  await Order.countDocuments({ status: '7' }, function(err, count) {
    counts['7'] = count;
  });
  await Order.countDocuments({ end_time: { $gte: start, $lt: end }, status: '1' }, function(
    err,
    count,
  ) {
    counts.invalid = count;
  });
  ctx.body = counts;
});

//通过sku获取商品信息
router.get('/info/sku/:id', async function(ctx, next) {
  let data = {};
  const sku = ctx.request.url.replace('/api/order/info/sku/', '');
  console.log(sku);
  let url = `http://www.taoqueqiao.com/api/tool/tqq.php?tqq_key=66670693&method=jd_danpin_view&data_id=${sku}`;
  await axios
    .get(url)
    .then(res => {
      console.log(res);
      data = res.data;
    })
    .catch(err => console.log(err));
  console.log(data);
  ctx.body = data;
});

//通过券链接获取券信息
router.post('/info/coupon', async function(ctx, next) {
  const options = ctx.request.body;
  let data = {};
  const discount_link = options.discount_link;
  console.log(discount_link);
  let url = `http://japi.jingtuitui.com/api/get_coupom_info`;
  await axios({
    url: url,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      appid: '1907241217559129',
      appkey: '14081ddd75a0a69dae6d861baf5b085f',
      url: discount_link,
    },
  })
    .then(res => {
      console.log(res);
      data = res.data;
    })
    .catch(err => console.log(err));
  console.log(data);
  ctx.body = data;
});

function getOrderNumFromImage(resolve, reject, imageUrl) {
  let cred = new Credential(
    'AKID50g7HBMIchZCZh9Ck8LL6c8ORJwYq1W7',
    'ax96nLejZEfx31lFVXWIp6B1d1CAvZ2G',
  );
  let httpProfile = new HttpProfile();
  httpProfile.endpoint = 'ocr.tencentcloudapi.com';
  let clientProfile = new ClientProfile();
  clientProfile.httpProfile = httpProfile;
  let client = new OcrClient(cred, 'ap-guangzhou', clientProfile);

  let OCRReq = new models.GeneralBasicOCRRequest();

  let params = `{"ImageUrl":"${imageUrl}"}`;
  OCRReq.from_json_string(params);

  let orderNum = 0;
  let amount = 0;
  client.GeneralBasicOCR(OCRReq, function(errMsg, response) {
    // logger.info(OCRReq)
    if (errMsg) {
      logger.error(errMsg);
      return;
    }
    let res = JSON.parse(response.to_json_string());
    // console.log(res);
    for (let i in res.TextDetections) {
      // logger.trace(i)
      let str = res.TextDetections[i].DetectedText;
      // console.log(str)
      // var reg = new RegExp(/转化/)
      if (str === '转化') {
        // console.log(i + 1)
        let newI = parseInt(i);
        orderNum = parseInt(res.TextDetections[newI + 1].DetectedText);
        amount = parseInt(res.TextDetections[newI + 2].DetectedText.replace(/￥/, '').trim());
        logger.info('订单数:', orderNum, '金额:', amount);
        resolve({ orderNum: orderNum, amount: amount });
        break;
      }
    }
  });
}
//     logger.trace(await a)
//     // return orderNum
// logger.info(getOrderNumFromImage())
//上传订单信息
router.post('/info/upload/:id', async function(ctx, next) {
  console.log('上传订单信息');
  const id = ctx.request.url.replace('/api/order/info/upload/', '');
  const options = ctx.request.body;
  console.log(options);
  // let imageUrl = 'http://pxee13dqq.bkt.clouddn.com/image/order/example/right.png'
  let imageUrl = options.orderImgUrl;
  //审核有问题跳到状态0（报单有问题），否则跳到6（待结算）
  // const status = '6'
  let info = await new Promise((resolve, reject) =>
    getOrderNumFromImage(resolve, reject, imageUrl),
  );
  logger.info('info:', info);
  let status = options.order_num === info.orderNum ? '6' : '0';
  console.log(status, options.order_num, info.orderNum, options.order_num === info.orderNum);
  let currentOrder = {}
  await Order.findOne({ _id: id}, function(err, order) {
    if(err) { ctx.body = { message: '数据库读取错误！' }}
    currentOrder = order
  })
  let newOrder = Object.assign({}, {
      order_num: options.order_num, //订单数
      orderImgUrl: options.orderImgUrl, //订单截图
      update_time: Date.now(),
      //根据订单金额计算服务费
      fee: parseFloat((currentOrder.fee_propo * 0.01 * info.amount).toFixed(2)),
      status: status,
    },
  );
  await Order.updateOne({ _id: id }, newOrder, function(err) {
    if (err) {
      ctx.body = { message: 'error' };
    }
    if (status == '0') {
      ctx.body = { message: '报单失败，请确保订单截图及信息准确！' };
    }
    ctx.body = { message: 'ok' };
  });
});

//上传订单信息
router.post('/reject/:id', async function(ctx, next) {
  console.log('上传订单信息');
  const id = ctx.request.url.replace('/api/order/reject/', '');
  const options = ctx.request.body;
  let newOrder = Object.assign(
    {},
    {
      reject_reason: options.reject_reason,
      update_time: Date.now(),
      status: '4',
    },
  );
  await Order.updateOne({ _id: id,}, newOrder)
  ctx.body = {
        message: 'ok',
      }
})

//根据状态筛选商品
router.get('/status/:id', async function(ctx, next) {
  const id = ctx.request.url.replace('/api/order/status/', '');
  await Order.find({ status: id }, function(err, orders) {
    ctx.body = orders;
  });
});

//添加商品
router.post('/add', async function(ctx, next) {
  const options = ctx.request.body;
  var newOrder = Object.assign({ status: '2', type: '-', update_time: Date.now() }, options);
  var order = new Order(newOrder);
  console.log(newOrder);
  //验证推广中的商品是否存在该sku
  await Order.find({ sku: options.sku, status: '1' }, function(err, orders) {
    if(err) {
      ctx.body = {
        status: '-1',
        message: '保存失败，数据库错误！',
      };
      if(orders.length > 0) {
        ctx.body = {
          status: '0',
          message: '保存失败，商品已存在！',
        };
      }
    }
  })
  await order.save(function(err) {
    if (!err) {
      ctx.body = {
        status: '-1',
        message: '保存失败，数据库错误！',
      };
    }
  });
  ctx.body = {
    status: '1',
    message: '保存成功！',
  };
});

//编辑
router.post('/edit/:id', async function(ctx, next) {
  const id = ctx.request.url.replace('/api/order/edit/', '');
  const options = ctx.request.body;
  var newOrder = Object.assign(
    {
      type: '-',
      update_time: Date.now(),
    },
    options,
  );
  await Order.update({ _id: id }, newOrder, function(err) {
    if (err) {
      ctx.body = {
        message: 'error',
      };
    }
    ctx.body = {
      message: 'Ok',
    };
  });
});

//删除
router.get('/del/:id', async function(ctx, next) {
  const id = ctx.request.url.replace('/api/order/del/', '');
  await Order.remove(
    {
      _id: id,
    },
    function(err) {
      ctx.body = {
        message: 'Ok',
      };
    },
  );
});

//推广
router.get('/promoting/:id', async function(ctx, next) {
  const id = ctx.request.url.replace('/api/order/promoting/', '');
  let now = new Date(Date.now());
  let end_time = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
  await Order.updateOne({_id: id}, {
      status: '1',
      end_time: end_time,
      out_trade_no: Date.now().toString()
    })
  ctx.body = {
        message: 'Ok',
      };
})

//进入审核
router.get('/promote/:id', async function(ctx, next) {
  const id = ctx.request.url.replace('/api/order/promote/', '');
  await Order.updateOne(
    {
      _id: id,
    },
    { status: '3' },
    function(err) {
      ctx.body = {
        message: 'Ok',
      };
    },
  );
});

//取消推广
router.get('/unpromote/:id', async function(ctx, next) {
  const id = ctx.request.url.replace('/api/order/unpromote/', '');
  await Order.updateOne({_id: id}, {status: '5'})
  ctx.body = {
        message: 'Ok',
      }
})

//检查是否过期
router.get('/check', async function(ctx, next) {
  // let now = new Date(Date.now())
  // await Order.updateMany({
  //       status: '1',
  //       end_time: {
  //         $lt: now
  //       }
  //     }, {
  //   status: '0'
  // }, function (err) {

  // })
  ctx.body = {
    message: 'Ok',
  };
});

module.exports = router;
