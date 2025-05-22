import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import authorizeAxiosInstance from '~/utils/authorizeAxios'
import { isEmpty } from 'lodash'
import { API_ROOT } from '~/utils/constants'
import { generatePlaceholderCard } from '~/utils/formatters'
import { mapOrder } from '~/utils/sorts'

const initialState = {
  currentActiveBoard: null,
  error: null // Thêm trạng thái lỗi
}

export const fetchBoardDetailsAPI = createAsyncThunk(
  'activeBoard/fetchBoardDetailsAPI',
  async (boardId, { rejectWithValue }) => {
    try {
      const respond = await authorizeAxiosInstance.get(
        `${API_ROOT}/v1/boards/${boardId}`
      )
      return respond.data
    } catch (error) {
      if (error.response?.status === 404) {
        // Chỉ trả lỗi khi board không tồn tại
        return rejectWithValue('Board not found!')
      }
      if (!error.response) {
        // Đây là lỗi network (không có phản hồi từ server)
        return rejectWithValue('Network error! Please check your connection.')
      }
    }
  }
)

export const fetchFilteredBoardDetailsAPI = createAsyncThunk(
  'activeBoard/fetchFilteredBoardDetailsAPI',
  async ({ boardId, queryParams }, { rejectWithValue }) => {
    try {
      const response = await authorizeAxiosInstance.get(
        `${API_ROOT}/v1/boards/${boardId}`,
        {
          params: queryParams // Axios sẽ tự động chuyển đổi queryParams thành chuỗi query string
        }
      )

      // Trả về dữ liệu
      return response.data
    } catch (error) {
      if (error.response?.status === 404) {
        // Chỉ trả lỗi khi board không tồn tại
        return rejectWithValue('Board not found!')
      }
      if (!error.response) {
        // Đây là lỗi network (không có phản hồi từ server)
        return rejectWithValue('Network error! Please check your connection.')
      }
    }
  }
)

export const activeBoardSlice = createSlice({
  name: 'activeBoard',
  initialState,
  reducers: {
    updateCurrentActiveBoard: (state, action) => {
      state.currentActiveBoard = action.payload
    },
    updateCardInBoard: (state, action) => {
      const incomingCard = action.payload
      const column = state.currentActiveBoard.columns.find(
        i => i._id === incomingCard.columnId
      )
      if (column) {
        const card = column.cards.find(i => i._id === incomingCard._id)
        if (card) {
          Object.keys(incomingCard).forEach(key => {
            card[key] = incomingCard[key]
          })
        }
      }
    }
  },
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
        state.error = null
      })
      .addCase(fetchBoardDetailsAPI.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(fetchFilteredBoardDetailsAPI.fulfilled, (state, action) => {
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
        state.error = null
      })
      .addCase(fetchFilteredBoardDetailsAPI.rejected, (state, action) => {
        state.error = action.payload
      })
  }
})

export const { updateCurrentActiveBoard, updateCardInBoard } =
  activeBoardSlice.actions
export const selectCurrentActiveBoard = state =>
  state.activeBoard.currentActiveBoard
export const selectBoardError = state => state.activeBoard.error
export const activeBoardReducer = activeBoardSlice.reducer
