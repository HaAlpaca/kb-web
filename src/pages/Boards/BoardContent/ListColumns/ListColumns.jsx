import {
  SortableContext,
  horizontalListSortingStrategy
} from '@dnd-kit/sortable'
import CloseIcon from '@mui/icons-material/Close'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { cloneDeep } from 'lodash'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { createNewColumnAPI } from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatters'
import Column from './Column/Column'

import { useDispatch, useSelector } from 'react-redux'
import {
  selectCurrentActiveBoard,
  updateCurrentActiveBoard
} from '~/redux/activeBoard/activeBoardSlice'
function ListColumns({ columns }) {
  const board = useSelector(selectCurrentActiveBoard)
  const dispatch = useDispatch()
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
  const toggleOpenNewColumnForm = () => {
    setOpenNewColumnForm(!openNewColumnForm)
  }

  const [newColumnTitle, setNewColumnTitle] = useState('')
  const addNewColumn = async () => {
    if (!newColumnTitle) {
      toast.error('Please enter Column Title!')
      return
    }
    // tao du lieu truoc khi goi
    const newColumnData = {
      title: newColumnTitle
    }
    // goi api tao board moi
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })
    createdColumn.cards = [generatePlaceholderCard(createdColumn)]
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id]
    // console.log(createdColumn)
    // cap nhat state board
    // tu lam dung thay vi fetch lai api
    const newBoard = cloneDeep(board)
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)
    // setBoard(newBoard)
    // se co loi khi shallow copy => dung clonedeep hoac chuyen sang concat (concat tao mang moi va gan ngc lai) (push se bi loi vi no la merge 2 mang)
    // https://redux-toolkit.js.org/usage/immer-reducers
    dispatch(updateCurrentActiveBoard(newBoard))
    // dong trang thai
    toggleOpenNewColumnForm()
    setNewColumnTitle('')
  }

  // The <SortableContext> component requires that you pass
  //  it the sorted array of the unique identifiers associated to each sortable item via the items prop.
  // This array should look like ["1", "2", "3"], not [{id: "1"}, {id: "2}, {id: "3}].
  //https://github.com/clauderic/dnd-kit/issues/183
  return (
    <SortableContext
      items={columns?.map(c => c._id)}
      strategy={horizontalListSortingStrategy}
    >
      <Box
        sx={{
          bgcolor: 'inherit',
          width: '100%',
          height: '100%',
          display: 'flex',
          overflowX: 'auto',
          overflowY: 'hidden',
          '&::-webkit-scrollbar-track': { margin: 2 }
        }}
      >
        {columns?.map(column => {
          return <Column key={column._id} column={column} />
        })}

        {/* add Column */}
        {!openNewColumnForm ? (
          <Box
            onClick={toggleOpenNewColumnForm}
            sx={{
              minWidth: '250px',
              maxWidth: '250px',
              mx: 2,
              borderRadius: '6px',
              height: 'fit-content',
              bgcolor: '#ffffff3d'
            }}
          >
            <Button
              startIcon={<NoteAddIcon />}
              sx={{
                color: 'white',
                width: '100%',
                justifyContent: 'flex-start',
                pl: 2.5,
                py: 1
              }}
            >
              Add New Column
            </Button>
          </Box>
        ) : (
          <Box
            sx={{
              minWidth: '250px',
              maxWidth: '250px',
              mx: 2,
              p: 1,
              borderRadius: '6px',
              height: 'fit-content',
              bgcolor: '#ffffff3d',
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}
          >
            <TextField
              data-no-dnd="true"
              label="Enter column title..."
              type="text"
              size="small"
              variant="outlined"
              autoFocus
              value={newColumnTitle}
              onChange={e => {
                setNewColumnTitle(e.target.value)
              }}
              sx={{
                '& label': { color: 'white' },
                '& input': { color: 'white' },
                '& label.Mui-focused': { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'white' },
                  '&:hover fieldset': { borderColor: 'white' },
                  '&.Mui-focused fieldset': { borderColor: 'white' }
                }
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                className="interceptor-loading"
                data-no-dnd="true"
                onClick={addNewColumn}
                variant="contained"
                color="success"
                size="small"
                sx={{
                  boxShadow: 'none',
                  border: '0.5px solid',
                  borderColor: theme => theme.palette.success.main,
                  '&:hover': {
                    bgcolor: theme => theme.palette.success.main
                    // boxShadow: 'none'
                  }
                }}
              >
                Add Column
              </Button>
              <CloseIcon
                data-no-dnd="true"
                fontSize="small"
                sx={{
                  color: 'white',
                  cursor: 'pointer'
                  // '&:hover': {
                  //   bgcolor: theme => theme.palette.warning.light
                  //   // boxShadow: 'none'
                  // }
                }}
                onClick={toggleOpenNewColumnForm}
              />
            </Box>
          </Box>
        )}
      </Box>
    </SortableContext>
  )
}

export default ListColumns
