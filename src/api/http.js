// import axios from "axios";
// import { message } from 'ant-design-vue';

// // 创建 Ycloud API 实例
// const ycloudInstance = axios.create({
//     baseURL: "https://api.ycloud.com/v2", // 根据环境变量设置基础URL
//     timeout: 100000, // 设置超时时间
//     headers: {
//         'Content-Type': 'application/json',
//         'accept': 'application/json',
//         'X-API-Key': '54016a2cf8aaa449f9c9552669796243',
//     },
// });

// const whatsappInstance = axios.create({
//     baseURL: "https://whatsapi.jackycode.cn", // 根据环境变量设置基础URL
//     // baseURL: "http://localhost:3000", // 根据环境变量设置基础URL
//     timeout: 100000, // 设置超时时间
//     headers: {
//         'Content-Type': 'application/json',
//         'accept': 'application/json'
//     },
// });

// // 创建自定义 API 实例
// const customInstance = axios.create({
//     baseURL: '127.0.01', // 根据环境变量设置基础URL
//     timeout: 5000, // 设置超时时间
//     headers: {
//         'Content-Type': 'application/json',
//         // 可能需要添加自定义 API 需要的头信息
//     },
// });

// // 通用响应拦截器，处理所有API的响应
// const responseInterceptor = response => {
//     return response;
// };

// const errorInterceptor = error => {
//     // 处理错误响应
//     const { response } = error;
//     let messageContent = '网络错误'; // 使用更明确的变量名
//     let messageType = 'error'; // 默认错误类型

//     if (response) {
//         const { status, data } = response;
//         if (status >= 400 && status < 500) { // 客户端错误 (4xx)
//             messageContent = data.message || `客户端错误 ${status}`;
//             messageType = 'warning'; // 客户端错误用警告
//         } else if (status >= 500) { // 服务器错误 (5xx)
//             messageContent = data.message || `服务器错误 ${status}`;
//         }
//     }

//     message[messageType]({
//         content: messageContent,
//         duration: 2.5, // 显示时长 (秒)
//     });

//     return Promise.reject(error);
// };

// ycloudInstance.interceptors.request.use(responseInterceptor, errorInterceptor)
// customInstance.interceptors.request.use(responseInterceptor, errorInterceptor)
// whatsappInstance.interceptors.request.use(responseInterceptor, errorInterceptor)

// export { ycloudInstance, customInstance, whatsappInstance };

import axios from "axios";
import {message} from "ant-design-vue";

function createRequestClient(baseURL, customHeaders = {}, isPlainResponse = false) {
    const client = axios.create({
        baseURL: baseURL || "http://localhost:3000", // 默认地址
        timeout: 10000, // 超时时间
        headers: {
            "Content-Type": "application/json", accept: "application/json", ...customHeaders,
        },
    });

    // 请求拦截器
    client.interceptors.request.use((config) => {
        // TODO: 在这里预留 Token 逻辑
        // const token = localStorage.getItem("accessToken");
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }

        return config;
    }, (err) => {
        console.log("error", err);
        // 请求发送前出错处理
        message.error(`请求发送失败`);
        return Promise.reject(err);
    });

    // 响应拦截器
    client.interceptors.response.use((response) => {
        if (isPlainResponse) {
            // 如果是ycloud，直接返回 response.data
            return response.data;
        }
        const {code, result, message: msg} = response.data;
        if (code === 200) {
            return result; // 成功返回数据
        }
        // 抛出业务错误
        throw new Error(msg || "未知错误");
    }, (err) => {
        // 网络或服务器错误处理
        const {response} = err;
        const errorMessage = response?.data?.message || "服务器开小差了，请稍后再试";

        message.error(errorMessage); // 全局错误提示
        return Promise.reject(err);
    });

    return client;
}

const ycloudInstance = createRequestClient("https://api.ycloud.com/v2", {
    "X-API-Key": "54016a2cf8aaa449f9c9552669796243",
}, true);

// 创建 WhatsApp 实例
const whatsappInstance = createRequestClient("https://whatsapi.jackycode.cn");

// 默认导出多个实例
export {ycloudInstance, whatsappInstance};
