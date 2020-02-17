import request from '@/utils/request';
export async function submitForm(params) {
  return request('/api/order/add', {
    method: 'POST',
    data: Object.assign(params, {
      uid: localStorage.getItem('id'),
    }),
  });
}

export async function getSkuInfo(params) {
  // http: //www.taoqueqiao.com/api/tool/tqq.php?tqq_key=66670693&method=jd_danpin_view&data_id=
  return request(`/api/order/info/sku/${params.sku}`, {
    methos: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
}

export async function getCouponInfo(params) {
  return request(`/api/order/info/coupon`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    data: params,
  });
}
