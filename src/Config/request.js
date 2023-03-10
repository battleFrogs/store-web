import { notification } from "antd";
import axios from "axios";
const service = axios.create({
    timeout: 40000,
    baseURL: "http://localhost:8080"
    // headers: { "Content-Type": "application/x-www-form-urlencoded" },
});

// 对处理结果业务的统一处理
function responseResult(res, resolve, reject) {
    const { code, msg } = res.data
    if (code !== 200) {
        notification.error({ placement: "topRight", message: "请求错误", description: msg })
        reject(msg)
        return;
    }
    resolve(res.data.data)
}


export default {
    // get请求
    get(url, param) {
        return new Promise((resolve, reject) => {
            service({
                method: "GET",
                url,
                params: param
            }).then(res => {
                responseResult(res, resolve, reject)
            }).catch(err => {
                reject(err.message)
            })
        })
    },

    // post Json请求
    postJson(url, param, data) {
        return new Promise((resolve, reject) => {
            service({
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                params: param,
                url: url,
                data
            }).then(res => {
                responseResult(res, resolve, reject)
            }).catch(err => {
                reject(err)
            })
        })
    }
}