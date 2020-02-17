import request from '@/utils/request';

export async function fetchAllOrders(params) {
  return request(`/api/user/orders/${localStorage.getItem('id')}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
}

//结算
export async function pay(params) {
  return request(`/api/pay/club/${localStorage.getItem('id')}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    data: params
  });
}

