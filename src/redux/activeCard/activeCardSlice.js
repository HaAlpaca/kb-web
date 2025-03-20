import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import authorizeAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

const initialState = {
  currentActiveCard: null,
  isShowModalActiceCard: false
}

// goi hanh dong bat dong bo =>
// middleware createAsyncThunk di kem voi extraReducer
export const fetchCardDetailsAPI = createAsyncThunk(
  'activeCard/fetchCardDetailsAPI',
  async cardId => {
    const respond = await authorizeAxiosInstance.get(
      `${API_ROOT}/v1/cards/${cardId}`
    )
    return respond.data
  }
)

export const activeCardSlice = createSlice({
  name: 'activeCard',
  initialState,
  reducers: {
    showModalActiveCard: state => {
      state.isShowModalActiceCard = true
    },
    clearAndHideCurrentActiveCard: state => {
      state.currentActiveCard = null
      state.isShowModalActiceCard = false
    },
    updateCurrentActiveCard: (state, action) => {
      const fullcard = action.payload
      state.currentActiveCard = fullcard
    }
  },
  // eslint-disable-next-line no-unused-vars
  // extraReducers: builder => {}

  extraReducers: builder => {
    builder.addCase(fetchCardDetailsAPI.fulfilled, (state, action) => {
      // update du lieu currentActiveBoard
      state.currentActiveCard = action.payload
      state.isShowModalActiceCard = true
    })
  }
})

export const {
  clearAndHideCurrentActiveCard,
  updateCurrentActiveCard,
  showModalActiveCard
} = activeCardSlice.actions
export const selectCurrentActiveCard = state => {
  return state.activeCard.currentActiveCard
}
export const selectIsShowModalActiceCard = state => {
  return state.activeCard.isShowModalActiceCard
}
export const activeCardReducer = activeCardSlice.reducer
