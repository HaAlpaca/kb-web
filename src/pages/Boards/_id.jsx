/* eslint-disable react-hooks/exhaustive-deps */
// board details

import Container from '@mui/material/Container'
import { cloneDeep } from 'lodash'
import AppBar from '~/components/AppBar/AppBar'

import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
// import { mockData } from '~/apis/mock-data'
import { useEffect } from 'react'
import {
  moveCardToDifferentColumnAPI,
  updateBoardDetailsAPI,
  updateColumnDetailsAPI
} from '~/apis'

import { useDispatch, useSelector } from 'react-redux'
import {
  fetchFilteredBoardDetailsAPI,
  selectCurrentActiveBoard,
  updateCurrentActiveBoard,
  selectBoardError
} from '~/redux/activeBoard/activeBoardSlice'

import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'

import ActiveCard from '~/components/Modal/ActiveCard/ActiveCard'
import {
  socketIoInstance,
  joinBoardRoom,
  leaveBoardRoom
} from '~/socket-client'
import useWebSocketEvents from '~/CustomHooks/useWebSocketEvents'
function Board() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const board = useSelector(selectCurrentActiveBoard)
  const error = useSelector(selectBoardError)
  const { boardId } = useParams()
  const [searchParams] = useSearchParams()
  // FETCH BOARD
  useEffect(() => {
    // const boardId = '671210d38975d009e2a50179'
    //call api
    dispatch(
      fetchFilteredBoardDetailsAPI({ boardId, queryParams: searchParams })
    )
  }, [dispatch, boardId, searchParams])

  useEffect(() => {
    if (error === 'Board not found!') {
      navigate('/not-found')
    }
  }, [error, navigate])

  // Join the board room
  useEffect(() => {
    joinBoardRoom(boardId)

    return () => {
      leaveBoardRoom(boardId)
    }
  }, [boardId])

  useWebSocketEvents()

  // goi api khi xu ly xong keo tha
  const moveColumns = async dndOrderedColumns => {
    // thuc ra doan nay ko phai clone deep va dung spreedoperator duoc, vi khong push lam 2 mang merge vs nhau
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
    const newBoard = cloneDeep(board)
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    // setBoard(newBoard)
    // SET BOARD nhu SETSTATE TRONG REDUX
    dispatch(updateCurrentActiveBoard(newBoard))
    // console.log(newBoard)
    // goi api update board
    await updateBoardDetailsAPI(newBoard._id, {
      columnOrderIds: newBoard.columnOrderIds
    })
      .then(res => {
        socketIoInstance.emit('FE_MOVE_COLUMN', {
          boardId: newBoard._id,
          ...res
        })
      })
      .catch(() =>
        dispatch(
          fetchFilteredBoardDetailsAPI({ boardId, queryParams: searchParams })
        )
      )
  }
  // cap nhat orderColumnIds
  const moveCardInTheSameColumn = (
    dndOrderedCards,
    dndOrderedCardIds,
    columnId
  ) => {
    // update state board
    const newBoard = cloneDeep(board)
    const columnToUpdate = newBoard.columns.find(
      column => column._id === columnId
    )
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardIds
    }
    // setBoard(newBoard)
    // SET BOARD nhu SETSTATE TRONG REDUX
    dispatch(updateCurrentActiveBoard(newBoard))
    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardIds })
      .then(res =>
        socketIoInstance.emit('FE_MOVE_CARD', {
          boardId: board._id,
          ...res
        })
      )
      .catch(() => {
        dispatch(
          fetchFilteredBoardDetailsAPI({ boardId, queryParams: searchParams })
        )
      })
  }
  const moveCardToDifferentColumn = (
    currentCardId,
    prevColumnId,
    nextColumnId,
    dndOrderedColumns
  ) => {
    // console.log('moveCardToDifferentColumn ~ currentCardId:', currentCardId)
    // console.log('moveCardToDifferentColumn ~ prevColumnId:', prevColumnId)
    // console.log('moveCardToDifferentColumn ~ nextColumnId:', nextColumnId)
    // console.log(
    //   'moveCardToDifferentColumn ~ dndOrderedColumns:',
    //   dndOrderedColumns
    // )
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
    const newBoard = cloneDeep(board)
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    // setBoard(newBoard)
    // SET BOARD nhu SETSTATE TRONG REDUX
    // o day se bi loi khi shallow copy ()
    // https://redux-toolkit.js.org/usage/immer-reducers
    dispatch(updateCurrentActiveBoard(newBoard))

    // goi api
    let prevCardOrderIds = dndOrderedColumns.find(
      c => c._id === prevColumnId
    )?.cardOrderIds
    if (prevCardOrderIds[0].includes('placeholder-card')) {
      prevCardOrderIds = []
    }
    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find(c => c._id === nextColumnId)
        ?.cardOrderIds
    })
      .then(res =>
        socketIoInstance.emit('FE_MOVE_CARD', {
          boardId: board._id,
          ...res
        })
      )
      .catch(() =>
        dispatch(
          fetchFilteredBoardDetailsAPI({ boardId, queryParams: searchParams })
        )
      )
  }

  if (!board) {
    return <PageLoadingSpinner caption="Loading Board..." />
  }
  if (error === 'Network error! Please check your connection.') {
    // Hiển thị spinner với thông báo lỗi mạng
    return <PageLoadingSpinner caption="Network error! Retrying..." />
  }
  return (
    <>
      <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
        {/* ActiveCard: tồn tại dựa trên đk có tồn tại data trong ActiveCard lưu trong redux không có thì mới render , mỗi thời điểm chỉ có 1 modal */}
        <ActiveCard />
        <AppBar />
        <BoardBar board={board} />
        <BoardContent
          board={board}
          // da dung redux
          // createNewColumn={createNewColumn}
          // createNewCard={createNewCard}
          // deleteColumnDetails={deleteColumnDetails}

          // 3 th nay di xuong 1 cap thoi nen khong can thiet dung redux
          moveColumns={moveColumns}
          moveCardInTheSameColumn={moveCardInTheSameColumn}
          moveCardToDifferentColumn={moveCardToDifferentColumn}
        />
      </Container>
    </>
  )
}

export default Board
