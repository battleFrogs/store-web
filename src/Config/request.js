import axios from "axios";
const service = axios.create({
    timeout: 40000,
    // headers: { "Content-Type": "application/x-www-form-urlencoded" },
});

const urlprefix = "http://localhost:8080"

export default {
    // get请求
    get(url, param) {
        return new Promise((resolve, reject) => {
            service({
                method: "GET",
                url: urlprefix + url,
                params: param,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
            }).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        })
    },

    // post Json请求
    postJson(url, param, data) {
        return new Promise((resolve, reject) => {
            service({
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                params: param,
                url: urlprefix + url,
                data
            }).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        })
    }
}