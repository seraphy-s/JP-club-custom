import { fetchAllOrders, pay } from './service';
import { Modal, Button } from 'antd';

const { confirm } = Modal;
const Model = {
  namespace: 'orderList',
  state: {
    orders: [],
  },
  effects: {
    *fetchAll({ payload }, { call, put }) {
      const response = yield call(fetchAllOrders, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *payOrder({ payload }, { call, put }) {
      const response = yield call(pay, payload);
      confirm({
        title: '请您在新打开的页面上完成付款',
        content: '付款完成前请不要关闭此窗口。完成付款后请根据您的情况点击下面按钮。',
        okText: '已完成支付',
        cancelText: '付款遇到问题',
        centered: true,
        onOk() {
          location.reload();
        },
        onCancel() {
          console.log('Cancel');
        },
      });
      window.open(response);
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, orders: action.payload };
    },
  },
};
export default Model;
