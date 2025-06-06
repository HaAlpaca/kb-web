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
export const getBoardDetailsAPI = async boardId => {
  const respond = await authorizeAxiosInstance.put(
    `${API_ROOT}/v1/boards/${boardId}`
  )
  return respond.data
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
export const fetchPublicBoardAPI = async searchPath => {
  const response = await authorizeAxiosInstance.get(
    `${API_ROOT}/v1/boards/public${searchPath}`
  )
  return response.data
}
export const fetchPrivateBoardAPI = async searchPath => {
  const response = await authorizeAxiosInstance.get(
    `${API_ROOT}/v1/boards/private${searchPath}`
  )
  return response.data
}
export const fetchArchivedBoardAPI = async searchPath => {
  const response = await authorizeAxiosInstance.get(
    `${API_ROOT}/v1/boards/archived${searchPath}`
  )
  return response.data
}
export const joinPublicBoardAPI = async boardId => {
  const response = await authorizeAxiosInstance.put(
    `${API_ROOT}/v1/boards/join_public_board/${boardId}`
  )
  return response.data
}
export const unArchiveBoardAPI = async boardId => {
  const response = await authorizeAxiosInstance.put(
    `${API_ROOT}/v1/boards/unarchive/${boardId}`
  )
  toast.success('Board unarchived successfully!')
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
export const archiveBoardAPI = async boardId => {
  const response = await authorizeAxiosInstance.delete(
    `${API_ROOT}/v1/boards/${boardId}`
  )
  toast.success('Board archived successfully!')
  return response.data
}

export const leaveBoardAPI = async (boardId, updateData) => {
  const response = await authorizeAxiosInstance.put(
    `${API_ROOT}/v1/boards/leave_board/${boardId}`,
    updateData
  )
  toast.success('You have left this board successfully!')
  return response.data
}

export const updateCardDetailsAPI = async (cardId, updateData) => {
  const respond = await authorizeAxiosInstance.put(
    `${API_ROOT}/v1/cards/${cardId}`,
    updateData
  )
  return respond.data
}

export const inviteUserToBoardAPI = async data => {
  const response = await authorizeAxiosInstance.post(
    `${API_ROOT}/v1/invitations/board`,
    data
  )
  toast.success('User invited to this board successfully!')
  return response.data
}

export const handleCreateLabelAPI = async data => {
  const response = await authorizeAxiosInstance.post(
    `${API_ROOT}/v1/labels`,
    data
  )
  return response.data
}
export const handleChangeLabelAPI = async (labelId, data) => {
  const response = await authorizeAxiosInstance.put(
    `${API_ROOT}/v1/labels/${labelId}`,
    data
  )
  return response.data
}
export const handleDeleteLabelAPI = async labelId => {
  const response = await authorizeAxiosInstance.delete(
    `${API_ROOT}/v1/labels/${labelId}`
  )
  toast.success('Label deleted successfully!')
  return response.data
}

export const handleUpdateCardLabelAPI = async (cardId, data) => {
  const response = await authorizeAxiosInstance.put(
    `${API_ROOT}/v1/cards/${cardId}`,
    data
  )
  return response.data
}

export const handleCreateAttachmentAPI = async data => {
  const response = await authorizeAxiosInstance.post(
    `${API_ROOT}/v1/attachments`,
    data
  )
  return response.data
}
export const handleDeleteAttachmentAPI = async attachmentId => {
  const response = await authorizeAxiosInstance.delete(
    `${API_ROOT}/v1/attachments/${attachmentId}`
  )
  toast.success('Attachment deleted successfully!')
  return response.data
}
export const handleChangeAttachmentAPI = async (attachmentId, data) => {
  const response = await authorizeAxiosInstance.put(
    `${API_ROOT}/v1/attachments/${attachmentId}`,
    data
  )
  return response.data
}
export const handleToggleCompleteCardAPI = async cardId => {
  const response = await authorizeAxiosInstance.put(
    `${API_ROOT}/v1/cards/complete/${cardId}`
  )
  return response.data
}
export const handleCreateChecklistAPI = async data => {
  const response = await authorizeAxiosInstance.post(
    `${API_ROOT}/v1/checklists`,
    data
  )
  return response.data
}
export const handleUpdateChecklistAPI = async (checklistId, data) => {
  const response = await authorizeAxiosInstance.put(
    `${API_ROOT}/v1/checklists/${checklistId}`,
    data
  )
  return response.data
}
export const handleDeleteChecklistAPI = async checklistId => {
  const response = await authorizeAxiosInstance.delete(
    `${API_ROOT}/v1/checklists/${checklistId}`
  )
  return response.data
}

export const handleGetBoardAnalystics = async boardId => {
  const response = await authorizeAxiosInstance.get(
    `${API_ROOT}/v1/boards/analytics/${boardId}`
  )
  return response.data
}

export const handleUpdateUserRole = async (boardId, data) => {
  const response = await authorizeAxiosInstance.put(
    `${API_ROOT}/v1/boards/roles/${boardId}`,
    data
  )
  return response.data
}
export const handleUpdateBoardAutomationAPI = async (boardId, data) => {
  const response = await authorizeAxiosInstance.put(
    `${API_ROOT}/v1/boards/automations/${boardId}`,
    data
  )
  return response.data
}
