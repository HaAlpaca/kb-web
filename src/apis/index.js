import axios from 'axios'
import { API_ROOT } from '~/utils/constants'
// khong can thiet la phai trycatch voi moi request
// dung intercepter de xu li loi tap trung trong axios
export const fetchBoardDetailsAPI = async boardId => {
  const respond = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
  return respond.data
}
export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const respond = await axios.put(
    `${API_ROOT}/v1/boards/${boardId}`,
    updateData
  )
  return respond.data
}
export const createNewColumnAPI = async newColumnData => {
  const response = await axios.post(`${API_ROOT}/v1/columns`, newColumnData)
  return response.data
}
export const createNewCardAPI = async newCardData => {
  const response = await axios.post(`${API_ROOT}/v1/cards`, newCardData)
  return response.data
}
