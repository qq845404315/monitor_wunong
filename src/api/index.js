import request from '@/utils/request'


export const login = () => {
    const params = {
        loginName: 'BLCCAPI',
        loginPwd: '8F~h4@j+VR@hWrqMOs'
    }
    return request({
        url: '/api/v2.0/entrance/user/userLogin',
        method: 'post',
        data: params
    })
}