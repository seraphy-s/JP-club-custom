import request from '@/utils/request';

export async function fetchChengziOrderStat(params) {
  return request(`/api/user/orders/${localStorage.getItem('id')}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
}

export async function fetchAllChengziOrders(params) {
  return request(`/api/user/orders/${localStorage.getItem('id')}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
}
