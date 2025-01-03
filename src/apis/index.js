import { toast } from 'react-toastify'
import authorizeAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'
// khong can thiet la phai trycatch voi moi request
// dung intercepter de xu li loi tap trung trong axios

// REDUX
// export const fetchBoardDetailsAPI = async boardId => {
//   const respond = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
//   return respond.data
// }
export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const respond = await authorizeAxiosInstance.put(
    `${API_ROOT}/v1/boards/${boardId}`,
    updateData
  )
  return respond.data
}

export const moveCardToDifferentColumnAPI = async updateData => {
  const respond = await authorizeAxiosInstance.put(
    `${API_ROOT}/v1/boards/supports/moving_card`,
    updateData
  )
  return respond.data
}
export const createNewColumnAPI = async newColumnData => {
  const response = await authorizeAxiosInstance.post(
    `${API_ROOT}/v1/columns`,
    newColumnData
  )
  return response.data
}
export const updateColumnDetailsAPI = async (columnId, updateData) => {
  const respond = await authorizeAxiosInstance.put(
    `${API_ROOT}/v1/columns/${columnId}`,
    updateData
  )
  return respond.data
}
export const deleteColumnDetailsAPI = async columnId => {
  const respond = await authorizeAxiosInstance.delete(
    `${API_ROOT}/v1/columns/${columnId}`
  )
  return respond.data
}
export const createNewCardAPI = async newCardData => {
  const response = await authorizeAxiosInstance.post(
    `${API_ROOT}/v1/cards`,
    newCardData
  )
  return response.data
}

// user api
export const registerUserAPI = async data => {
  const response = await authorizeAxiosInstance.post(
    `${API_ROOT}/v1/users/register`,
    data
  )
  toast.success(
    'Account create successfully! Please check and verify your account before logging in!',
    { theme: 'colored' }
  )
  return response.data
}
export const verifyUserAPI = async data => {
  const response = await authorizeAxiosInstance.put(
    `${API_ROOT}/v1/users/verify`,
    data
  )
  toast.success(
    'Account verified successfully! Now you can login to enjoy our services! Have a good day!',
    { theme: 'colored' }
  )
  return response.data
}
export const refreshTokenAPI = async () => {
  const response = await authorizeAxiosInstance.get(
    `${API_ROOT}/v1/users/refresh_token`
  )
  return response.data
}

export const fetchBoardAPI = async searchPath => {
  const response = await authorizeAxiosInstance.get(
    `${API_ROOT}/v1/boards${searchPath}`
  )
  return response.data
}

export const createNewBoardAPI = async data => {
  const response = await authorizeAxiosInstance.post(
    `${API_ROOT}/v1/boards`,
    data
  )
  toast.success('Board created successfully!')
  return response.data
}

export const updateCardDetailsAPI = async (cardId, updateData) => {
  const respond = await authorizeAxiosInstance.put(
    `${API_ROOT}/v1/cards/${cardId}`,
    updateData
  )
  return respond.data
}
