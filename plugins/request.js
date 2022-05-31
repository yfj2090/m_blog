import qs from 'qs'
import axios from 'axios'

const instance = axios.create({
    baseURL: '/api'
})

// 添加请求拦截器
instance.interceptors.request.use((config) => {
    return config
})

// fetch
export default async function fetch(options) {
    var { url='/', paylod = {}, method = 'GET', ext = {} } = options
    return instance({
        url,
        method,
        proxy: undefined,
        data: paylod,
        ...ext
    }).then(_ => _).catch(_ => console.log(_))
}