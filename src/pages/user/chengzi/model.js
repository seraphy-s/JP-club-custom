import { fetchAllChengziOrders, fetchChengziOrderStat } from './service';
import { Modal, Button } from 'antd';

const { confirm } = Modal;
const Model = {
  namespace: 'chengzi',
  state: {
    stat: {
      all_orders: 0,
      current_month_orders: 0,
      current_month_amount: 0,
    },
    orders: [],
  },
  effects: {
    *fetchChengziOrderData({ payload }, { call, put }) {
      const response = yield call(fetchChengziOrderStat, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchAllChengziOrders({ payload }, { call, put }) {
      const response = yield call(fetchAllChengziOrders, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, orders: action.payload };
    },
  },
};
export default Model;
