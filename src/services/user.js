import request from '@/utils/request';
export async function query() {
  return request('/api/users');
}
export async function queryCurrent(params) {
  return request('/api/user/current', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    data: params,
  });
}
export async function queryNotices() {
  return request('/api/notices');
}
