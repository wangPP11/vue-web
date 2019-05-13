import axios from 'axios'
import {Message} from 'element-ui'

//axios.defaults.baseURL = "/api/";  // 默认地址
axios.defaults.baseURL = "http://www.ping-w.com/vueweb";  // 默认地址
axios.defaults.withCredentials = true; // 准许携带cookie信息
//整理数据
axios.defaults.transformRequest = function (data) {
    data = JSON.stringify(data);
    return data;
};

// 路由请求拦截
// http request 拦截器
axios.interceptors.request.use(config => {
        config.headers['Accept'] = 'application/json';
        config.headers['Content-Type'] = 'application/json;charset=UTF-8';
        //判断是否存在token，如果存在的话，则每个http header都加上token
        const token = localStorage.getItem("token");
        if(token != undefined){
            config.headers['Authorization'] = token;
        }
        return config;
    },
    error => {
        return Promise.reject(error.response);
    });

// 路由响应拦截
// http response 拦截器
axios.interceptors.response.use(resp=> {
    if (resp.status && resp.status == 200 && resp.data.code != '0') {
        Message.error({message: resp.data.message})
        if (resp.data.code == '20301') {
            // Token过期
            setTimeout(() => {
                window.location.href = location.origin + location.pathname;
            }, 1000);
        }
        return Promise.resolve(resp);
    }
    return resp.data;
}, err=> {
    if(err.response == undefined){
        Message.error({message: err.message})
    }else{
        if (err.response.status == 504||err.response.status == 404) {
            Message.error({message: '服务器被吃了⊙﹏⊙∥'});
        } else if (err.response.status == 403) {
            Message.error({message: '权限不足,请联系管理员!'});
        }else {
            Message.error({message: '未知错误!'});
        }
    }
    return Promise.resolve(err);
})
export default axios;
