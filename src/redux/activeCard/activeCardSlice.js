import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentActiveCard: null,
  isShowModalActiceCard: false
}
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
  extraReducers: builder => {}
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
