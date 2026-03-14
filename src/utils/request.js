import axios from 'axios'
import { getToken, setToken } from '@/utils/auth'
import { login } from '@/api/index'


axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
const timeout = 10000000
// 创建axios实例
const service = axios.create({
    // axios中请求配置有baseURL选项，表示请求URL公共部分
    // baseURL: 'localhost:',
    // 超时
    timeout
})
// request拦截器
service.interceptors.request.use(
    config => {
        if (getToken()) {
            config.headers['token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
        }
        return config
    },
    error => {
        console.log(error)
        Promise.reject(error)
    }
)

// 响应拦截器
service.interceptors.response.use(res => {
    //文件
    if (res.config.responseType === 'blob') {
        return res
    }
    const code = res.data.code
    //登陆超时的判断
    if (code === 2000) {
        login().then(res => {
            setToken(res.data.token)
        })
    }
    if (code !== 200 && code !== 1000) {
       
        return Promise.reject(res.data)
    } else {
        return res.data
    }
},
    error => {
        return Promise.reject(error)
    }
)

export default service

//axios导出文件
export function download({ url, method = 'get', data = {}, params = {} }, fileName) {
    return service({
        methods: method,
        url: url,
        responseType: 'blob',
        data,
        params: params
    }).then(res => {
        const { headers } = res
        const contentDisposition = headers['content-disposition']
        let fileName = '导出信息.xls'
        if (contentDisposition && contentDisposition.includes('filename=')) {
            fileName = contentDisposition.slice(contentDisposition.indexOf('filename=') + 9)
            fileName = decodeURI(fileName)
        }

        const blob = new Blob([res.data])

        if ('download' in document.createElement('a')) { // 非IE下载
            const elink = document.createElement('a')
            elink.download = fileName
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob)
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
        } else { // IE10+下载
            navigator.msSaveBlob(blob, fileName)
        }
    })

}
