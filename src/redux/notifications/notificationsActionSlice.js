import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import authorizeAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

const initialState = {
  currentNotifications: null
}

export const fetchActionsAPI = createAsyncThunk(
  'actionNotifications/fetchActionsAPI',
  async () => {
    const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/actions`)
    return response.data
  }
)

export const notificationActionsSlice = createSlice({
  name: 'notificationActions',
  initialState,
  reducers: {
    clearCurrentNotifications: state => {
      state.currentNotifications = null
    },
    updateCurrentNotifications: (state, action) => {
      state.currentNotifications = action.payload
    },
    addNotification: (state, action) => {
      const incomingAction = action.payload
      state.currentNotifications.unshift(incomingAction)
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchActionsAPI.fulfilled, (state, action) => {
      let incomingAction = action.payload
      state.currentNotifications = Array.isArray(incomingAction)
        ? incomingAction.reverse()
        : []
    })
  }
})

export const {
  clearCurrentNotifications,
  updateCurrentNotifications,
  addNotification
} = notificationActionsSlice.actions

export const selectCurrentActionNotifications = state => {
  return state.notificationActions.currentNotifications
}

export const notificationActionsReducer = notificationActionsSlice.reducer
