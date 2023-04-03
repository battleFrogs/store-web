import { notification } from "antd";
import axios from "axios";
import history from "./history";
export const baseURL = "http://localhost:8080"

const service = axios.create({
    timeout: 40000,
    baseURL
    // headers: { "Content-Type": "application/x-www-form-urlencoded" },
});


// 添加请求前拦截器
service.interceptors.request.use(config => {
    if (sessionStorage.getItem("token")) {
        console.log(sessionStorage.getItem("token"))
        config.headers['Authorization'] = sessionStorage.getItem("token")
    }
    return config
}, function (error) {
    return Promise.reject(error)
});


// 对处理结果业务的统一处理
function useResponseResult(res, resolve, reject) {
    const { code, msg } = res.data
    if (code === 401) {
        history.push('/')
        return
    }
    if (code !== 200) {
        notification.error({ placement: "topRight", message: "接口错误", description: msg })
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
                useResponseResult(res, resolve, reject)
            }).catch(err => {
                notification.error({ placement: "topRight", message: "请求错误", description: err.message })
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
                useResponseResult(res, resolve, reject)
            }).catch(err => {
                notification.error({ placement: "topRight", message: "请求错误", description: err.message })
                reject(err)
            })
        })
    },

    postExport(url, param, data) {
        return new Promise((resolve, reject) => {
            service({
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                params: param,
                url: url,
                data,
                responseType: 'blob'
            }).then(res => {
                const url = window.URL.createObjectURL(new Blob([res.data]))
                const link = document.createElement('a')
                link.href = url
                link.setAttribute('download', '列表导出.xlsx')
                document.body.appendChild(link)
                link.click()
            }).catch(err => {
                notification.error({ placement: "topRight", message: "请求错误", description: err.message })
                reject(err)
            })
        })
    }
}