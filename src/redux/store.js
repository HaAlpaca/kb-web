// redux: state management tool

// cau hinh redux persist
// https://edvins.io/how-to-use-redux-persist-with-redux-toolkit
// redux dung ram de luu state
// nen ta can redux persist de luu vao localstorage

import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { configureStore } from '@reduxjs/toolkit'
import { activeBoardReducer } from './activeBoard/activeBoardSlice'
import { activeCardReducer } from './activeCard/activeCardSlice'
import { userReducer } from './user/userSlice'
import { notificationsReducer } from './notifications/notificationsSlice'
import { notificationActionsReducer } from './notifications/notificationsActionSlice'
//
const rootPersistConfig = {
  key: 'root', // key chi dinh , de mac dinh la root
  storage: storage, // bien store o tren -> luu vao localStorage
  whitelist: ['user'] // dinh nghia cac slice du lieu duoc phep duy tri qua cac lan f5
  // blacklist: ['user'] // dinh nghia cac slice du lieu   qua cac lan f5
}

// combine cac reducer vs nhau

export const reducers = combineReducers({
  activeBoard: activeBoardReducer,
  user: userReducer,
  activeCard: activeCardReducer,
  notifications: notificationsReducer,
  notificationActions: notificationActionsReducer
})

const persistReducers = persistReducer(rootPersistConfig, reducers)

// fix redux persist ko tuong thich
// https://stackoverflow.com/questions/61704805/getting-an-error-a-non-serializable-value-was-detected-in-the-state-when-using/63244831#63244831
export const store = configureStore({
  reducer: persistReducers,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})
