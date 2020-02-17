import request from '@/utils/request';

//@param 带用户id的商品请求

//获取所有用户
export async function fetchAllUser() {
  return request('/api/user/all', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
}

export async function setRejectReason(params) {
  return request(`/api/order/reject/${params._id}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    data: params,
  });
}

//获取所有商品
export async function fetchAllList() {
  return request('/api/order/all', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
}

//获取qiniu上传token
export async function getUploadToken() {
  return request(`/genToken`, {
    method: 'Get',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
}

//上传订单信息
export async function uploadOrderInfo(params) {
  return request(`/api/order/info/upload/${params._id}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    data: params,
  });
}

//根据状态拉取当前用户数据
export async function fetchStatus(params) {
  return request(`/api/order/status/${params.id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
}

//获取数量
export async function fetchCounts(params) {
  return request(`/api/order/counts`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
}
//---------------------通用请求---------------------

//检查是否过期
export async function checkStatus() {
  return request('/api/order/check', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
}

//推广
export async function promoteOrder(params) {
  return request(`/api/order/promoting/${params.id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
}

//取消推广
export async function unpromoteOrder(params) {
  return request(`/api/order/unpromote/${params.id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
}

//删除
export async function delOrder(params) {
  return request(`/api/order/del/${params.id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
}

// 编辑
export async function editOrder(params) {
  return request(`/api/order/edit/${params.id}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    data: params.value,
  });
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request('/api/fake_list', {
    method: 'POST',
    params: {
      count,
    },
    data: { ...restParams, method: 'delete' },
  });
}
export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request('/api/fake_list', {
    method: 'POST',
    params: {
      count,
    },
    data: { ...restParams, method: 'post' },
  });
}
export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request('/api/fake_list', {
    method: 'POST',
    params: {
      count,
    },
    data: { ...restParams, method: 'update' },
  });
}
