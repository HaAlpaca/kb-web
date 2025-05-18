import Board from '~/pages/Boards/_id'
import NotFound from '~/pages/404/NotFound'
import {
  Route,
  Routes,
  Navigate,
  Outlet,
  useSearchParams
} from 'react-router-dom'
import Auth from '~/pages/Auth/Auth'
import AccountVerification from '~/pages/Auth/AccountVerification'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import Settings from '~/pages/Settings/Settings'
import Boards from './pages/Boards'
import { useEffect } from 'react'
import {
  clearAndHideCurrentActiveCard,
  fetchCardDetailsAPI
} from './redux/activeCard/activeCardSlice'
import Home from './pages/Home/home'

// https://www.robinwieruch.de/react-router-private-routes/
const ProtectedRoute = ({ user }) => {
  if (!user) return <Navigate to="/home" replace={true} />
  return <Outlet />
}
function App() {
  const currentUser = useSelector(selectCurrentUser)
  return (
    <Routes>
      {/* Redirect route */}
      <Route
        path="/"
        element={
          // replace= true de thay cho / neu dung nut go home se khong bi nho lich su minh da sd route / va no se navigate lan nua vao /board/boardId
          <Navigate to="/boards" replace="true" />
        }
      />
      {/* neu co user se da sang trang board */}
      <Route element={<ProtectedRoute user={currentUser} />}>
        <Route path="/boards/:boardId" element={<BoardWithModal />} />
        <Route path="/boards" element={<Boards />} />
        {/* <Route path="/cards/:cardId" element={<ActiveCard />} /> */}
        {/* User Settings */}
        <Route path="/settings/account" element={<Settings />} />
        <Route path="/settings/security" element={<Settings />} />
      </Route>
      {/* AUTH */}
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/register" element={<Auth />} />
      <Route path="/account/verification" element={<AccountVerification />} />
      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

const BoardWithModal = () => {
  const [searchParams] = useSearchParams()
  const cardId = searchParams.get('cardModal')
  const dispatch = useDispatch()

  useEffect(() => {
    if (cardId) {
      dispatch(fetchCardDetailsAPI(cardId))
    } else {
      dispatch(clearAndHideCurrentActiveCard())
    }
  }, [cardId, dispatch])

  return (
    <>
      <Board />
    </>
  )
}

export default App
