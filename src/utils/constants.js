let apiRoot = ''
if (process.env.BUILD_MODE === 'dev') {
  apiRoot = 'http://localhost:8017'
}
if (process.env.BUILD_MODE === 'production') {
  apiRoot = 'https://kb-api-kfl3.onrender.com'
}
export const API_ROOT = apiRoot
// export const API_ROOT = 'https://trello-api-td8m.onrender.com'
//http://localhost:8017/

export const DEFAULT_PAGE = 1
export const DEFAULT_ITEM_PER_PAGE = 12

export const BOARD_INVITATION_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED'
}

export const CARD_MEMBER_ACTION = {
  ADD: 'ADD',
  REMOVE: 'REMOVE'
}

export const BOARD_TYPES = {
  PUBLIC: 'public',
  PRIVATE: 'private'
}

export const ACTION_TYPES = {
  ASSIGN_CHECKLIST: 'assign_checklist',
  ASSIGN_CARD: 'assign_card',
  UPDATE_DUEDATE: 'update_dueDate'
}

export const OWNER_ACTION_TARGET = {
  CARD: 'cards',
  COLUMN: 'columns',
  BOARD: 'boards'
}
