// board details

import Container from '@mui/material/Container'
import { clone, cloneDeep } from 'lodash'
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
  fetchBoardDetailsAPI,
  selectCurrentActiveBoard,
  updateCurrentActiveBoard
} from '~/redux/activeBoard/activeBoardSlice'

import { useParams } from 'react-router-dom'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'

import ActiveCard from '~/components/Modal/ActiveCard/ActiveCard'
import { socketIoInstance } from '~/socket-client'
import { generatePlaceholderCard } from '~/utils/formatters'
function Board() {
  const dispatch = useDispatch()
  // const [board, setBoard] = useState(null)
  const board = useSelector(selectCurrentActiveBoard)
  const { boardId } = useParams()

  // FETCH BOARD
  useEffect(() => {
    // const boardId = '671210d38975d009e2a50179'
    //call api
    dispatch(fetchBoardDetailsAPI(boardId))
  }, [dispatch, boardId])
  // WEBSOCKET EVENT RECEIVE DELETE COLUMN
  useEffect(() => {
    // const boardId = '671210d38975d009e2a50179'
    //call api
    // dispatch(fetchBoardDetailsAPI(boardId))
    // socketIoInstance.on('BE_USER_MOVE_CARD_TO_DIFFERENT_COLUMN', move => {
    //   console.log('BE_USER_MOVE_CARD_TO_DIFFERENT_COLUMN on: ', move)
    // })
    socketIoInstance.on('BE_DELETE_COLUMN', deletedColumn => {
      const newBoard = { ...board }
      // console.log(newBoard)
      newBoard.columns = newBoard.columns?.filter(
        c => c._id !== deletedColumn.columnId
      )
      newBoard.columnOrderIds = newBoard.columnOrderIds?.filter(
        _id => _id !== deletedColumn.columnId
      )
      // setBoard(newBoard)
      // SET BOARD nhu SETSTATE TRONG REDUX
      dispatch(updateCurrentActiveBoard(newBoard))
      // console.log('BE_DELETE_COLUMN on: ', deletedColumn)
    })
  }, [dispatch, board])
  // WEBSOCKET EVENT RECEIVE CREATE COLUMN
  useEffect(() => {
    socketIoInstance.on('BE_CREATE_COLUMN', createdColumn => {
      // console.log('BE_CREATE_COLUMN on: ', createdColumn)
      createdColumn.cards = [generatePlaceholderCard(createdColumn)]
      createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id]
      // cap nhat state board
      // tu lam dung thay vi fetch lai api
      const newBoard = {
        ...board
      }
      newBoard.columns = newBoard.columns?.concat(createdColumn)
      newBoard.columnOrderIds = newBoard.columnOrderIds?.concat(
        createdColumn._id
      )
      // console.log('NewBoard: ', newBoard)
      // newBoard.columns.push(createdColumn)
      // newBoard.columnOrderIds.push(createdColumn._id)
      // setBoard(newBoard)
      // // // se co loi khi shallow copy => dung clonedeep hoac chuyen sang concat (concat tao mang moi va gan ngc lai) (push se bi loi vi no la merge 2 mang)
      // // // https://redux-toolkit.js.org/usage/immer-reducers
      dispatch(updateCurrentActiveBoard(newBoard))
    })
  }, [dispatch, board])

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
  }
  // cap nhat orderColumnIds
  const moveCardInTheSameColumn = (
    dndOrderedCards,
    dndOrderedCardIds,
    columnId
  ) => {
    // update state board
    const newBoard = clone(board)
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
    }).then(res => {
      socketIoInstance.emit('FE_USER_MOVE_CARD_TO_DIFFERENT_COLUMN', res)
      // console.log('FE_USER_MOVE_CARD_TO_DIFFERENT_COLUMN emit: ', res)
    })
  }

  if (!board) {
    return <PageLoadingSpinner caption="Loading Board..." />
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
