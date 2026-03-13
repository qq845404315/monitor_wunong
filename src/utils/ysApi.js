import axios from 'axios';

// 萤石云API配置
const YS_CONFIG = {
  BASE_URL: 'https://open.ys7.com',
  API_TOKEN_GET: '/api/lapp/token/get',
  API_DEVICE_LIST: '/api/lapp/device/list',
  API_DEVICE_INFO: '/api/lapp/device/info',
  API_TOKEN_REFRESH: '/api/lapp/token/refresh',
  API_EZOPEN_GET: '/api/lapp/v2/live/address/get',
};

// 存储Token信息
let tokenInfo = null;
let tokenTimer = null;

/**
 * 获取萤石云AccessToken
 * @param {string} appKey - 应用Key
 * @param {string} appSecret - 应用密钥
 * @returns {Promise<Object>} 包含accessToken和expireTime的对象
 */
export async function getAccessToken(appKey, appSecret) {
  try {
    const response = await axios.post(
      `${YS_CONFIG.BASE_URL}${YS_CONFIG.API_TOKEN_GET}`,
      {
        appKey: appKey,
        appSecret: appSecret,
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const { code, msg, data } = response.data;

    if (code === '200') {
      console.log('Token获取成功:', data);
      
      // 保存token信息
      tokenInfo = {
        accessToken: data.accessToken,
        expireTime: data.expireTime, // 过期时间，格式：YYYY-MM-DD HH:mm:ss
        expiresAt: new Date(data.expireTime).getTime(), // 转换为时间戳
        appKey: appKey,
        appSecret: appSecret,
      };

      // 设置定时器，在token过期前5分钟刷新
      const expireTimestamp = new Date(data.expireTime).getTime();
      const now = Date.now();
      const refreshTime = expireTimestamp - now - 5 * 60 * 1000; // 提前5分钟刷新

      if (refreshTime > 0) {
        if (tokenTimer) clearTimeout(tokenTimer);
        tokenTimer = setTimeout(() => {
          refreshAccessToken();
        }, refreshTime);
      }

      return tokenInfo;
    } else {
      throw new Error(`获取Token失败: ${msg} (code: ${code})`);
    }
  } catch (error) {
    console.error('获取Token失败:', error);
    throw error;
  }
}

/**
 * 刷新Token
 * @returns {Promise<Object>} 新的token信息
 */
export async function refreshAccessToken() {
  if (!tokenInfo || !tokenInfo.appKey || !tokenInfo.appSecret) {
    throw new Error('请先获取Token');
  }

  try {
    const response = await axios.post(
      `${YS_CONFIG.BASE_URL}${YS_CONFIG.API_TOKEN_REFRESH}`,
      {
        accessToken: tokenInfo.accessToken,
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const { code, msg, data } = response.data;

    if (code === '200') {
      console.log('Token刷新成功:', data);
      
      // 更新token信息
      tokenInfo.accessToken = data.accessToken;
      tokenInfo.expireTime = data.expireTime;
      tokenInfo.expiresAt = new Date(data.expireTime).getTime();

      // 重新设置定时器
      const expireTimestamp = new Date(data.expireTime).getTime();
      const now = Date.now();
      const refreshTime = expireTimestamp - now - 5 * 60 * 1000;

      if (refreshTime > 0) {
        if (tokenTimer) clearTimeout(tokenTimer);
        tokenTimer = setTimeout(() => {
          refreshAccessToken();
        }, refreshTime);
      }

      return tokenInfo;
    } else {
      throw new Error(`刷新Token失败: ${msg} (code: ${code})`);
    }
  } catch (error) {
    console.error('刷新Token失败:', error);
    throw error;
  }
}

/**
 * 获取设备列表
 * @param {string} accessToken - 访问令牌
 * @returns {Promise<Array>} 设备列表
 */
export async function getDeviceList(accessToken) {
  try {
    const response = await axios.post(
      `${YS_CONFIG.BASE_URL}${YS_CONFIG.API_DEVICE_LIST}`,
      {
        accessToken: accessToken,
        pageStart: 0,
        pageSize: 50,
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const { code, msg, data } = response.data;

    if (code === '200') {
      return data.list || [];
    } else {
      throw new Error(`获取设备列表失败: ${msg} (code: ${code})`);
    }
  } catch (error) {
    console.error('获取设备列表失败:', error);
    throw error;
  }
}

/**
 * 获取设备详细信息
 * @param {string} accessToken - 访问令牌
 * @param {string} deviceSerial - 设备序列号
 * @returns {Promise<Object>} 设备信息
 */
export async function getDeviceInfo(accessToken, deviceSerial) {
  try {
    const response = await axios.post(
      `${YS_CONFIG.BASE_URL}${YS_CONFIG.API_DEVICE_INFO}`,
      {
        accessToken: accessToken,
        deviceSerial: deviceSerial,
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const { code, msg, data } = response.data;

    if (code === '200') {
      return data;
    } else {
      throw new Error(`获取设备信息失败: ${msg} (code: ${code})`);
    }
  } catch (error) {
    console.error('获取设备信息失败:', error);
    throw error;
  }
}

/**
 * 获取EZOPEN地址
 * @param {string} accessToken - 访问令牌
 * @param {string} deviceSerial - 设备序列号
 * @param {number} channelNo - 通道号（通常为1）
 * @returns {Promise<string>} EZOPEN地址
 */
export async function getEzopenUrl(accessToken, deviceSerial, channelNo = 1) {
  try {
    const response = await axios.post(
      `${YS_CONFIG.BASE_URL}${YS_CONFIG.API_EZOPEN_GET}`,
      {
        accessToken: accessToken,
        deviceSerial: deviceSerial,
        channelNo: channelNo,
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const { code, msg, data } = response.data;

    if (code === '200') {
      return data.url;
    } else {
      throw new Error(`获取EZOPEN地址失败: ${msg} (code: ${code})`);
    }
  } catch (error) {
    console.error('获取EZOPEN地址失败:', error);
    throw error;
  }
}

/**
 * 获取当前Token信息
 * @returns {Object|null} 当前token信息
 */
export function getCurrentTokenInfo() {
  return tokenInfo;
}

/**
 * 检查Token是否有效
 * @returns {boolean} 是否有效
 */
export function isTokenValid() {
  if (!tokenInfo) return false;
  
  const now = Date.now();
  // 提前5分钟认为token已过期，需要刷新
  return tokenInfo.expiresAt > now + 5 * 60 * 1000;
}

/**
 * 清理Token和定时器
 */
export function clearToken() {
  if (tokenTimer) {
    clearTimeout(tokenTimer);
    tokenTimer = null;
  }
  tokenInfo = null;
}

/**
 * 根据appKey和appSecret获取EZOPEN地址
 * @param {string} appKey - 应用Key
 * @param {string} appSecret - 应用密钥
 * @param {string} deviceSerial - 设备序列号
 * @param {number} channelNo - 通道号
 * @returns {Promise<string>} EZOPEN地址
 */
export async function getEzopenUrlWithCredentials(appKey, appSecret, deviceSerial, channelNo = 1) {
  // 先获取token
  const tokenData = await getAccessToken(appKey, appSecret);
  
  // 获取EZOPEN地址
  const ezopenUrl = await getEzopenUrl(tokenData.accessToken, deviceSerial, channelNo);
  
  return ezopenUrl;
}

export default {
  getAccessToken,
  refreshAccessToken,
  getDeviceList,
  getDeviceInfo,
  getEzopenUrl,
  getCurrentTokenInfo,
  isTokenValid,
  clearToken,
  getEzopenUrlWithCredentials,
  YS_CONFIG,
};
