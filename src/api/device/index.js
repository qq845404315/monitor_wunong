import service from '@/utils/request'

export const getDeviceList = () => {
    return service({
        url: '/api/v2.0/entrance/device/getsysUserDevice',
        method: 'get'
    })
}

export const getRealTimeData = (id) => {
    return service({
        url: '/api/v2.0/entrance/device/getRealTimeData',
        method: 'get',
        params: {
            deviceAddrs: id
        }
    })
}

export const geyCameraList = (deviceAddr) => {
    return service({
        url: '/api/v2.0/entrance/device/getDeviceCamera',
        method: 'get',
        params: {
            deviceAddr: deviceAddr
        }
    })
}

