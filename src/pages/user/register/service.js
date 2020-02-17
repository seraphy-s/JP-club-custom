import request from '@/utils/request';

export async function register(params) {
  return request('/api/user/register', {
    method: 'POST',
    data: params,
  });
}

export async function getCaptcha(phone) {
  return request(`/api/user/captcha/${phone}`, {
    method: 'GET',
  });
}
