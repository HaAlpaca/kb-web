import axios from 'axios'
import { API_ROOT } from '~/utils/constants'
// khong can thiet la phai trycatch voi moi request
// dung intercepter de xu li loi tap trung trong axios
export const fetchBoardDetailsAPI = async boardId => {
  const respond = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
  return respond.data
}
