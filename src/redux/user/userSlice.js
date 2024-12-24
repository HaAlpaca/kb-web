import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import authorizeAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'
// https://redux-toolkit.js.org/tutorials/quick-start
// khoi tao gia tri 1 slice trong redux
const initialState = {
  currentUser: null
}
// goi hanh dong bat dong bo =>
// middleware createAsyncThunk di kem voi extraReducer
export const loginUserApi = createAsyncThunk(
  'user/loginUserApi',
  async data => {
    const response = await authorizeAxiosInstance.post(
      `${API_ROOT}/v1/users/login`,
      data
    )
    return response.data
  }
)

export const logoutUserApi = createAsyncThunk(
  'user/logoutUserApi',
  async (showSuccessMessage = true) => {
    const response = await authorizeAxiosInstance.delete(
      `${API_ROOT}/v1/users/logout`
    )
    if (showSuccessMessage) {
      toast.success('Logged out successfully!')
    }
    return response.data
  }
)

// khoi tao Slice trong store Redux
export const userSlice = createSlice({
  name: 'user',
  initialState,
  // khong co du lieu dong bo nen khong can reducers
  // extraReducers: noi xu li du lieu bat dong bo
  extraReducers: builder => {
    builder.addCase(loginUserApi.fulfilled, (state, action) => {
      // action.payload chinh la cai response.data tra ve o tren
      const user = action.payload

      // update du lieu
      state.currentUser = user
    })
    builder.addCase(logoutUserApi.fulfilled, state => {
      // logout thanh cong, clear cookie tu be, clear current user trong redux

      // update du lieu
      state.currentUser = null
    })
  }
})

// Action creators are generated for each case reducer function

// Actions: la noi dung cho components ben duoi goi bang dispatch() toi de cap nhat lai du lieu thong qua reducer (chay dong bo)
// de y o tren thi khong co props actions dau ca, actions duoc redux tao tu dong
// export const {} = userSlice.actions
// selectors: la noi cho cac component goi bang hook useSelector de lay du lieu ra ngoai tu trong kho redux store ra su dung
export const selectCurrentUser = state => {
  return state.user.currentUser
}

export const userReducer = userSlice.reducer
