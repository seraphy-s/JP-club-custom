import {
  // addFakeList,
  fetchAllList,
  fetchStatus,
  fetchCounts,
  checkStatus,
  promoteOrder,
  unpromoteOrder,
  delOrder,
  editOrder,
  getUploadToken,
  uploadOrderInfo,
  pay
  // removeFakeList,
  // updateFakeList
} from './service';
import { message } from 'antd'
const Model = {
  namespace: 'listBasicList',
  state: {
    list: [],
    counts: {
      all: 0,
      promoting: 0,
      invalid: 0
    },
    uploadOrderInfoLoading: false
  },
  effects: {
    *fetch({ }, { call, put }) {
      const response = yield call(fetchAllList);
      yield put({
        type: 'queryList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *pay({ payload }, { call, put }) {
      const response = yield call(pay, payload);
      window.location.href = response
    },
    //获取上传图片token
    *getUploadToken({ }, { call, put }) {
      const uploadToken = yield call(getUploadToken);
      yield put({
        type: 'getToken',
        payload: uploadToken
      })
    },//上传订单信息
    *uploadOrderInfo({ payload }, { call, put }) {
      yield put({ type: 'setUploadOrderInfoLoading', payload: true})
      const data = yield call(uploadOrderInfo, payload);
      yield put({ type: 'setUploadOrderInfoLoading', payload: false})
      if(data.message && data.message ==='ok') {
        message.success('订单信息上传成功！')
      } else if (data.message === 'error') {
        message.error('订单信息上传失败！')
      } else {
        message.error(data.message)
      }
    },
    *check({ }, { call, put }) {
      const response = yield call(checkStatus);
    },
    *status({ payload }, { call, put }) {
      const response = yield call(fetchStatus, payload);
      yield put({
        type: 'queryList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *promote({ payload }, { call, put }) {
      const response = yield call(promoteOrder, payload);
      message.success('已提交审核！');
    },
    *unpromote({ payload }, { call, put }) {
      const response = yield call(unpromoteOrder, payload);
      message.success('取消推广成功！');
    },
    *del({ payload }, { call, put }) {
      const response = yield call(delOrder, payload);
      message.success('删除成功！');
    },
    *edit({ payload }, { call, put }) {
      const response = yield call(editOrder, payload);
    },
    *getCounts({ }, { call, put }) {
      const response = yield call(fetchCounts);
      yield put({
        type: 'showCounts',
        payload: response
      });
    },
  //   *appendFetch({ payload }, { call, put }) {
  //     const response = yield call(queryFakeList, payload);
  //     yield put({
  //       type: 'appendList',
  //       payload: Array.isArray(response) ? response : [],
  //     });
  //   },

  //   *submit({ payload }, { call, put }) {
  //     let callback;

  //     if (payload.id) {
  //       callback = Object.keys(payload).length === 1 ? removeFakeList : updateFakeList;
  //     } else {
  //       callback = addFakeList;
  //     }

  //     const response = yield call(callback, payload); // post

  //     yield put({
  //       type: 'queryList',
  //       payload: response,
  //     });
  //   },
  },
  reducers: {
    setUploadOrderInfoLoading(state, action) {
      return {
        ...state, uploadOrderInfoLoading: action.payload
      }
    },
    getToken(state, action) {
      return {
        ...state, uploadToken: action.payload
      }
    },
    queryList(state, action) {
      return { ...state, list: action.payload };
    },
    showCounts(state, action) {
      return { ...state, counts: action.payload };
    },
    appendList(
      state = {
        list: [],
      },
      action,
    ) {
      return { ...state, list: state.list.concat(action.payload) };
    },
  },
};
export default Model;
