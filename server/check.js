var axios = require('axios');
var Order = require('./models/order');

module.exports = function() {
  let couponUrl = `http://japi.jingtuitui.com/api/get_coupom_info`;

  var timer = setInterval(function() {
    console.log('订单自动审核中……');
    let now = new Date(Date.now());
    Order.updateMany({ status: '1', end_time: { $lt: now } }, { status: '5' }, function(err) {
      if (err) console.log(err);
    });
    Order.find({ status: '1' }, function(err, orders) {
      //推广结束，触发更新，状态 1 => 5
      for (let order of orders) {
        let skuUrl = `http://www.taoqueqiao.com/api/tool/tqq.php?tqq_key=66670693&method=jd_danpin_view&data_id=${order.sku}`;
        axios
          .get(skuUrl)
          .then(res => {
            //商品下架或没有该商品
            if (res.data.s === 0) {
              Order.updateOne({ _id: order._id }, { status: '5' }, function(err) {
                console.log(err);
              });
            } else {
              axios({
                url: couponUrl,
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                data: {
                  appid: '1907241217559129',
                  appkey: '14081ddd75a0a69dae6d861baf5b085f',
                  url: order.discount_link,
                },
              })
                .then(res => {
                  // console.log(res.data.result);
                  console.log('优惠券查询', !res.data.result)
                  //优惠券失效
                  if (!res.data.result || res.data.result.yn === '否') {
                    Order.updateOne({ _id: order._id }, { status: '5' }, function(err) {
                      console.log(err);
                    });
                  }
                })
                .catch(err => console.log('err'));
            }
          })
          .catch(err => console.log('err'));
      }
    });
  }, 2 * 60 * 1000);
};
