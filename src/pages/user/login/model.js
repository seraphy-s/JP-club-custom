import { routerRedux } from 'dva/router';
import { message } from 'antd'
import { accountLogin, getFakeCaptcha } from './service';
import { getPageQuery, setAuthority } from './utils/utils';
import { reloadAuthorized } from '../../../utils/Authorized';
const Model = {
  namespace: 'userLogin',
  state: {
    status: undefined,
  },
  effects: {
    *login({ payload }, { call, put }) {
      yield localStorage.clear();
      const response = yield call(accountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      }); // Login successfully

      if (response.status === 'ok') {
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;

        if (redirect) {
          const redirectUrlParams = new URL(redirect);

          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);

            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        console.log('redirect', redirect, localStorage.getItem('id'));
        message.success(response.message)
        yield put(routerRedux.replace(redirect || '/account/settings'));
      } else {
        message.warning(response.message)
      }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.id, payload.currentAuthority, payload.token);
      reloadAuthorized();
      return { ...state, status: payload.status, type: payload.type };
    },
  },
};
export default Model;
