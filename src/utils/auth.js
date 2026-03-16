import Cookies from 'js-cookie'

const TokenKey = 'AccessToken'

export const getToken = () => {
  return Cookies.get(TokenKey)
}

export const setToken = (token) => {
  return Cookies.set(TokenKey, token, {expires: 1})
}

export const removeToken = () => {
  return Cookies.remove(TokenKey)
}

export const getMetData = () => {
  return JSON.parse(localStorage.getItem('met_data')) || []
}

export const setMetData = (data) => {
  return localStorage.setItem('met_data', data)
}