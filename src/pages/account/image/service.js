/*
 * @Descripttion: 
 * @version: 
 * @Author: seraphy
 * @Date: 2019-12-25 17:29:12
 * @LastEditors  : seraphy
 * @LastEditTime : 2019-12-25 18:34:46
 */
import request from '@/utils/request';

export async function fetchAll(params) {
    return request(`/api/user/image/all/${localStorage.getItem('id')}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
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

export async function saveImage(params) {
    return request(`/api/user/image/save`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        data: params
    });
}