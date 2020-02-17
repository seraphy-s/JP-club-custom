import request from '@/utils/request';

export async function queryCurrent() {
  return request('/api/user/current', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    data: {
      id: localStorage.getItem('id')
    }
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

export async function saveInfo(params) {
  return request('/api/user/save', {
    method: 'POST',
    headers: {
      ContentType: 'appliaction/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    data: {
      id: localStorage.getItem('id'),
      ...params
    }
  });
}