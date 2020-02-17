import { message } from 'antd';
import { submitForm, getSkuInfo, getCouponInfo } from './service';
const Model = {
  namespace: 'order',
  state: {},
  effects: {
    *submitOrder({ payload }, { call, put }) {
      yield call(submitForm, payload);
      message.success('提交成功');
    },
    *getSkuInfo(payload, { call, put }) {
      console.log('payload', payload);
      const skuInfo = yield call(getSkuInfo, payload);
      yield put({ type: 'skuInfo', payload: skuInfo });
    },
    *getCouponInfo(payload, { call, put }) {
      const skuInfo = yield call(getCouponInfo, payload);
      yield put({ type: 'couponInfo', payload: skuInfo });
    },
  },
  reducers: {
    skuInfo(state, action) {
      return { ...state, skuInfo: action.payload };
    },
    couponInfo(state, action) {
      return { ...state, couponInfo: action.payload };
    },
  },
};
export default Model;
