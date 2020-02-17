import { message } from 'antd';
import { getUploadToken, queryCurrent, saveInfo } from './service';

const Model = {
  namespace: 'accountSettings',
  state: {
    currentUser: {},
    uploadToken: '',
  },
  effects: {
    //获取上传图片token
    *getUploadToken({}, { call, put }) {
      const uploadToken = yield call(getUploadToken);
      yield put({
        type: 'getToken',
        payload: uploadToken,
      });
    },

    *fetchCurrent({ payload }, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },

    *saveInfo({ payload }, { call, put }) {
      const response = yield call(saveInfo, payload);
      if (response.status && response.status === 'ok') {
        message.success(response.message);
      } else {
        message.info(response.message);
      }
      // yield put({
      //   type: 'saveCurrentUser',
      //   payload: response,
      // });
    },
  },
  reducers: {
    saveCurrentUser(state, action) {
      return { ...state, currentUser: action.payload || {} };
    },
    getToken(state, action) {
      return {
        ...state,
        uploadToken: action.payload,
      };
    },
  },
};
export default Model;
