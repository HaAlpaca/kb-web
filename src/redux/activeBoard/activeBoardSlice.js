import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import authorizeAxiosInstance from '~/utils/authorizeAxios'
import { isEmpty } from 'lodash'
import { API_ROOT } from '~/utils/constants'
import { generatePlaceholderCard } from '~/utils/formatters'
// https://redux-toolkit.js.org/tutorials/quick-start
// khoi tao gia tri 1 slice trong redux
import { mapOrder } from '~/utils/sorts'
const initialState = {
  currentActiveBoard: null
}
// goi hanh dong bat dong bo =>
// middleware createAsyncThunk di kem voi extraReducer
export const fetchBoardDetailsAPI = createAsyncThunk(
  'activeBoard/fetchBoardDetailsAPI',
  async boardId => {
    const respond = await authorizeAxiosInstance.get(
      `${API_ROOT}/v1/boards/${boardId}`
    )
    // return data
    return respond.data
  }
)

export const fetchFilteredBoardDetailsAPI = createAsyncThunk(
  'activeBoard/fetchFilteredBoardDetailsAPI',
  async ({ boardId, queryParams }) => {
    // Gọi API với params
    const response = await authorizeAxiosInstance.get(
      `${API_ROOT}/v1/boards/${boardId}`,
      {
        params: queryParams // Axios sẽ tự động chuyển đổi queryParams thành chuỗi query string
      }
    )

    // Trả về dữ liệu
    return response.data
  }
)

// khoi tao Slice trong store Redux
export const activeBoardSlice = createSlice({
  name: 'activeBoard',
  initialState,
  // xu li du lieu dong bo
  reducers: {
    // cap nhat activeBoard
    // https://redux-toolkit.js.org/usage/immer-reducers
    updateCurrentActiveBoard: (state, action) => {
      // action.payload la chuan nhan du lieu dau vao cua reducer, o day chung ta gan no ra 1 bien co nghia hon
      const fullBoard = action.payload

      // xu li du lieu....
      // update du lieu cho current active board
      state.currentActiveBoard = fullBoard
    },
    updateCardInBoard: (state, action) => {
      // update nested data https://redux-toolkit.js.org/usage/immer-reducers#updating-nested-data
      const incomingCard = action.payload
      const column = state.currentActiveBoard.columns.find(
        i => i._id === incomingCard.columnId
      )
      if (column) {
        const card = column.cards.find(i => i._id === incomingCard._id)
        if (card) {
          // column.cards[card] = incomingCard
          Object.keys(incomingCard).forEach(key => {
            card[key] = incomingCard[key]
          })
        }
      }
    }
  },
  // extraReducers: noi xu li du lieu bat dong bo
  extraReducers: builder => {
    builder
      .addCase(fetchBoardDetailsAPI.fulfilled, (state, action) => {
        let board = action.payload
        board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')
        board.columns.forEach(column => {
          if (isEmpty(column.cards)) {
            column.cards = [generatePlaceholderCard(column)]
            column.cardOrderIds = [generatePlaceholderCard(column)._id]
          } else {
            column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
          }
        })
        state.currentActiveBoard = board
      })
      .addCase(fetchFilteredBoardDetailsAPI.fulfilled, (state, action) => {
        // Xử lý dữ liệu trả về từ API khi có bộ lọc
        let board = action.payload
        board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')
        board.columns.forEach(column => {
          if (isEmpty(column.cards)) {
            column.cards = [generatePlaceholderCard(column)]
            column.cardOrderIds = [generatePlaceholderCard(column)._id]
          } else {
            column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
          }
        })
        state.currentActiveBoard = board
      })
  }
})

// Action creators are generated for each case reducer function

// Actions: la noi dung cho components ben duoi goi bang dispatch() toi de cap nhat lai du lieu thong qua reducer (chay dong bo)
// de y o tren thi khong co props actions dau ca, actions duoc redux tao tu dong
export const { updateCurrentActiveBoard, updateCardInBoard } =
  activeBoardSlice.actions
// selectors: la noi cho cac component goi bang hook useSelector de lay du lieu ra ngoai tu trong kho redux store ra su dung
export const selectCurrentActiveBoard = state => {
  return state.activeBoard.currentActiveBoard
}
// file nay ten la activeBoardSlice nhung chung ta se export ra 1 reducer
// export default activeBoardSlice.reducer
export const activeBoardReducer = activeBoardSlice.reducer
