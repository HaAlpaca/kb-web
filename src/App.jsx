import Board from '~/pages/Boards/_id'
import NotFound from '~/pages/404/NotFound'
import { Route, Routes, Navigate, Outlet } from 'react-router-dom'
import Auth from '~/pages/Auth/Auth'
import AccountVerification from '~/pages/Auth/AccountVerification'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import Settings from '~/pages/Settings/Settings'

// https://www.robinwieruch.de/react-router-private-routes/
const ProtectedRoute = ({ user }) => {
  if (!user) return <Navigate to="/login" replace={true} />
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
          <Navigate to="/boards/671210d38975d009e2a50179" replace="true" />
        }
      />
      {/* neu co user se da sang trang board */}
      <Route element={<ProtectedRoute user={currentUser} />}>
        <Route path="/boards/:boardId" element={<Board />} />
        {/* User Settings */}
        <Route path="/settings/account" element={<Settings />} />
        <Route path="/settings/security" element={<Settings />} />
      </Route>
      {/* AUTH */}
      <Route path="login" element={<Auth />} />
      <Route path="register" element={<Auth />} />
      <Route path="account/verification" element={<AccountVerification />} />
      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
