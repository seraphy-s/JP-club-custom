import { parse } from 'qs';
export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}
export function setAuthority(id, authority, token) {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  localStorage.setItem('id', id);
  localStorage.setItem('token', token);
  return localStorage.setItem('antd-pro-authority', JSON.stringify(proAuthority));
}
