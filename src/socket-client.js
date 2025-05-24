import { io } from 'socket.io-client'
import { API_ROOT } from './utils/constants.js'
export const socketIoInstance = io(API_ROOT)

// Join a specific board room
export const joinBoardRoom = (boardId) => {
  socketIoInstance.emit('JOIN_BOARD', boardId)
}

// Leave a specific board room
export const leaveBoardRoom = (boardId) => {
  socketIoInstance.emit('LEAVE_BOARD', boardId)
}