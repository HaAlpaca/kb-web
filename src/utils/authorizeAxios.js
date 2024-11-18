import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from '~/utils/formatters'
const authorizeAxiosInstance = axios.create()

authorizeAxiosInstance.defaults.timeout = 1000 * 60 * 10
// dinh kem cookie
authorizeAxiosInstance.defaults.withCredentials = true

// Add a request interceptor
authorizeAxiosInstance.interceptors.request.use(
  config => {
    // Do something before request is sent
    // danh chan spam click
    interceptorLoadingElements(true)
    return config
  },
  error => {
    // Do something with request error
    return Promise.reject(error)
  }
)

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
    // Do something with response error
    // console.log(error)
    let errMessage = error?.message
    if (error.response?.data?.message) {
      errMessage = error.response?.data?.message
    }
    if (error.response?.status !== 410) {
      toast.error(errMessage)
    }
    return Promise.reject(error)
  }
)

export default authorizeAxiosInstance
