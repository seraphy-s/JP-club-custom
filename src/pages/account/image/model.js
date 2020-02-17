/*
 * @Descripttion: 
 * @version: 
 * @Author: seraphy
 * @Date: 2019-12-25 17:29:12
 * @LastEditors  : seraphy
 * @LastEditTime : 2019-12-25 20:08:30
 */
import { fetchAll, getUploadToken, saveImage } from './service';
import { Modal, Button } from 'antd';

const { confirm } = Modal;
const Model = {
    namespace: 'image',
    state: {
        JDfileList: [],
        TBfileList: [],
    },
    effects: {
        * fetchAll({ payload }, { call, put }) {
            const response = yield call(fetchAll, payload);
            yield put({
                type: 'save',
                payload: {
                    JDfileList: response.JDfileList,
                    TBfileList: response.TBfileList,
                },
            });
        },

        * saveImage({ payload }, { call, put }) {
            const response = yield call(saveImage, payload);
            yield put({
                type: 'save',
                payload: response,
            });
        },
        //获取上传图片token
        * getUploadToken({}, { call, put }) {
            const uploadToken = yield call(getUploadToken);
            yield put({
                type: 'getToken',
                payload: uploadToken
            })
        },
    },
    reducers: {
        save(state, action) {
            return {...state, ...action.payload };
        },
        getToken(state, action) {
            return {
                ...state,
                uploadToken: action.payload
            }
        },
        setFileList(state, action) {
            return {...state, JDfileList: state.JDfileList.slice(), TBfileList: state.TBfileList.slice() }
        }
    },
};
export default Model;