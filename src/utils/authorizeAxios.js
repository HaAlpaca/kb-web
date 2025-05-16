import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from '~/utils/formatters'
import { refreshTokenAPI } from '~/apis'
import { logoutUserApi } from '~/redux/user/userSlice'

// khong the import store redux nhu thong thuong, vi dispatch ho tro ở các component react thôi (tức file jsx)
// https://redux.js.org/faq/code-structure#how-can-i-use-the-redux-store-in-non-component-files

let axiosReduxStore

export const injectStore = mainStore => {
  axiosReduxStore = mainStore
}

const authorizeAxiosInstance = axios.create()

authorizeAxiosInstance.defaults.timeout = 1000 * 60 * 10
// dinh kem cookie
authorizeAxiosInstance.defaults.withCredentials = true

// Add a request interceptor
authorizeAxiosInstance.interceptors.request.use(
  config => {
    // Do something before request is sent
    // lấy boardId từ localStorage
    if (window.location.pathname.match(/\/boards\/([a-f0-9]{24})/)) {
      const match = window.location.pathname.match(/\/boards\/([a-f0-9]{24})/)
      config.headers['x-board-id'] = match[1]
    }
    // danh chan spam click
    interceptorLoadingElements(true)
    return config
  },
  error => {
    // Do something with request error
    return Promise.reject(error)
  }
)
let refreshTokenPromise = null
// Add a response interceptor
authorizeAxiosInstance.interceptors.response.use(
  response => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data

    // danh chan spam click
    interceptorLoadingElements(false)
    return response
  },
  error => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // danh chan spam click
    interceptorLoadingElements(false)

    // loi 401  => logout
    if (error.response?.status === 401) {
      // logout
      axiosReduxStore.dispatch(logoutUserApi(false))
    }

    // GONE
    const originalRequest = error.config
    if (error.response?.status === 410 && !originalRequest._retry) {
      // refresh token
      originalRequest._retry = true
      if (!refreshTokenPromise) {
        refreshTokenPromise = refreshTokenAPI()
          .then(data => {
            return data?.accessToken
          })
          .catch(_error => {
            // logout
            axiosReduxStore.dispatch(logoutUserApi(false))
            return Promise.reject(_error)
          })
          .finally(() => {
            refreshTokenPromise = null
          })
      }
      // eslint-disable-next-line no-unused-vars
      return refreshTokenPromise.then(accessToken => {
        // update axios instance
        // lƯU access token lại vào axios nhưng ko cần vì đã lưu trong cookie BE rồi
        // authorizeAxiosInstance.defaults.headers.common['Authorization'] =
        //   `Bearer ${accessToken}`
        return authorizeAxiosInstance(originalRequest)
      })
    }

    // Do something with response error
    // console.log(error)
    let errMessage = error?.message
    if (error.response?.data?.message) {
      errMessage = error.response?.data?.message
    }
    // toast.error(errMessage)
    if (error.response?.status !== 410) {
      toast.error(errMessage)
    }
    return Promise.reject(error)
  }
)

export default authorizeAxiosInstance
