var router = require('koa-router')();
var AlipaySdk = require('alipay-sdk').default;
var fs = require('fs');
var path = require('path');
var urlencode = require('urlencode');
var Qs = require('qs');
const User = require('../models/user');
const Order = require('../models/order');

const distFolder = path.resolve(__dirname);

router.prefix('/api/pay');

const alipaySdk = new AlipaySdk({
  appId: '2021001119618504',
  privateKey: fs.readFileSync(`${distFolder}/private-key.pem`, 'ascii'),
  alipayPublicKey: fs.readFileSync(`${distFolder}/public-key.pem`, 'ascii'),
});

// club ----------------------------------------------------------------

//发单付款成功
router.post('/club/success', async function(ctx, next) {
  const postData = ctx.request.body;
  console.log('pay notice', postData);
  // const sdk = new AlipaySdk(postData.alipay_trade_app_pay_response)
  // const vertify = alipaySdk.checkNotifySign(postData)
  const vertify = true;
  console.log(vertify);
  if (vertify) {
    let { subject, notify_time, total_amount, trade_status, trade_no, out_trade_no } = postData;
    if (trade_status !== 'TRADE_SUCCESS') {
      ctx.body = 'failure';
      return;
    }
    let passback_params = urlencode.decode(postData.passback_params);
    let info = null;
    let new_end_time = null;
    let new_begin_time = null;
    let { id, name, peroid } = JSON.parse(passback_params);
    console.log(passback_params, id);
    await User.findOne({ _id: id }, function(err, user) {
      info = user;
      console.log(info);
    });
    let { status, begin_time, end_time } = info;
    if (status === '1' || status === '2') {
      new_begin_time = begin_time;
      new_end_time = new Date(end_time.getTime() + parseInt(peroid) * 24 * 60 * 60 * 1000);
    } else {
      let now = new Date(Date.now());
      new_begin_time = now;
      new_end_time = new Date(now.getTime() + parseInt(peroid) * 24 * 60 * 60 * 1000);
    }
    await User.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          status: '1',
          begin_time: new_begin_time,
          end_time: new_end_time,
        },
      },
    );
    //保存订单
    let newOrder = new Order({
      out_trade_no: out_trade_no,
      trade_no: trade_no,
      phone: info.phone,
      name: name,
      subject: subject,
      peroid: peroid,
      amount: total_amount,
      create_at: notify_time,
    });
    await newOrder.save(function(err) {
      console.log(err);
    });
    ctx.body = 'success';
  } else {
    ctx.body = 'failure';
  }
});

router.post('/club/:id', async function(ctx, next) {
  const id = ctx.request.url.replace('/api/pay/club/', '');
  const options = ctx.request.body;
  console.log(options);
  let outTradeNo = Date.now().toString() + '_' + id;
  // const bizContent = {
  //     "out-trade-no": outTradeNo,
  //     "product-code": "FAST_INSTANT_TRADE_PAY",
  //     "total-amount": "24.00",
  //     "subject": "iphone 16G",
  // }
  // ctx.body = '123'
  // console.log(alipaySdk)
  const result = await alipaySdk
    .exec('alipay.trade.page.pay', {
      notifyUrl: 'http://47.104.152.197:4000/api/pay/club/success',
      returnUrl: 'http://47.104.152.197:4000/account/order',
      bizContent: {
        outTradeNo: outTradeNo,
        productCode: 'FAST_INSTANT_TRADE_PAY',
        totalAmount: options.price,
        subject: `${options.title} ${options.peroid}天`,
        passbackParams: urlencode(
          JSON.stringify({
            id: id,
            name: options.name,
            peroid: options.peroid.toString(),
          }),
        ),
        // requestFromUrl: 'http://localhost:3001'
      },
    })
    .catch(res => (ctx.body = res.serverResult.headers.location));
  console.log('result', result);
  ctx.body = result;
});

module.exports = router;

// result
// {
//   serverResult: {
//     data: '',
//     status: 302,
//     headers: {
//       server: 'Tengine/2.1.0',
//       date: 'Mon, 23 Sep 2019 09:09:49 GMT',
//       'content-length': '0',
//       connection: 'keep-alive',
//       'set-cookie': [Array],
//       location: 'https://unitradeprod.alipay.com/appAssign.htm?alipay_exterface_invoke_assign_target=invoke_c354e430d56b344264315c6b3e62d633&alipay_exterface_invoke_assign_sign=_ocp_v9_q1n_sq_v_q0_k_g_f_a_bx9_p_e_s_m_ww_q2_z%2B1_mq_k_ev_sf8_sb2m_r5_v_o_ie_cb84g%3D%3D',
//       via: 'spanner-internet-5352.et15[302]'
//     },
//     res: {
//       status: 302,
//       statusCode: 302,
//       statusMessage: 'Found',
//       headers: [Object],
//       size: 0,
//       aborted: false,
//       rt: 341,
//       keepAliveSocket: false,
//       data: '',
//       requestUrls: [Array],
//       timing: null,
//       remoteAddress: '110.75.231.202',
//       remotePort: 443,
//       socketHandledRequests: 1,
//       socketHandledResponses: 1
//     }
//   },
//   errorMessage: '[AlipaySdk]HTTP 请求错误'
// }
