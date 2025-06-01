import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchFilteredBoardDetailsAPI } from '~/redux/activeBoard/activeBoardSlice'
import { socketIoInstance } from '~/socket-client'
import { useParams, useSearchParams } from 'react-router-dom'
import { fetchCardDetailsAPI } from '~/redux/activeCard/activeCardSlice'

function useWebSocketEvents() {
  const dispatch = useDispatch()
  const { boardId } = useParams()
  const [searchParams] = useSearchParams()
  const cardId = searchParams.get('cardModal')
  useEffect(() => {
    if (!boardId) return
    // Hàm xử lý sự kiện WebSocket
    const handleWebSocketEvent = action => {
      console.log(action)
      if (cardId === action?.cardId) {
        dispatch(fetchCardDetailsAPI(cardId))
      }
      dispatch(
        fetchFilteredBoardDetailsAPI({ boardId, queryParams: searchParams })
      )
    }

    // Danh sách các sự kiện WebSocket
    const events = [
      'BE_DELETE_COLUMN',
      'BE_CREATE_COLUMN',
      'BE_MOVE_COLUMN',
      'BE_MOVE_CARD',
      'BE_UPDATE_CARD',
      'BE_UPDATE_BOARD',
      'BE_CREATE_LABEL',
      'BE_DELETE_LABEL',
      'BE_UPDATE_LABEL',
      'BE_CREATE_ATTACHMENT',
      'BE_DELETE_ATTACHMENT',
      'BE_UPDATE_ATTACHMENT',
      'BE_TOGGLE_CARD_COMPLETE',
      'BE_CREATE_CHECKLIST',
      'BE_DELETE_CHECKLIST',
      'BE_UPDATE_CHECKLIST'
    ]

    // Đăng ký tất cả các sự kiện
    events.forEach(event => {
      socketIoInstance.on(event, handleWebSocketEvent)
    })

    // Hủy đăng ký tất cả các sự kiện khi component unmount
    return () => {
      events.forEach(event => {
        socketIoInstance.off(event, handleWebSocketEvent)
      })
    }
  }, [dispatch, boardId, searchParams, cardId])
}

export default useWebSocketEvents
