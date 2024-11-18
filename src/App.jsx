import Board from '~/pages/Boards/_id'
import NotFound from '~/pages/404/NotFound'
import { Route, Routes, Navigate } from 'react-router-dom'
import Auth from '~/pages/Auth/Auth'
function App() {
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
      <Route path="/boards/:boardId" element={<Board />} />
      {/* AUTH */}
      <Route path="login" element={<Auth />} />
      <Route path="register" element={<Auth />} />
      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
