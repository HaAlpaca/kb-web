import Box from '@mui/material/Box'
// import Typography from '@mui/material/Typography'
import AddCardIcon from '@mui/icons-material/AddCard'
// import Cloud from '@mui/icons-material/Cloud'
import ContentCopy from '@mui/icons-material/ContentCopy'
import ContentCut from '@mui/icons-material/ContentCut'
import ContentPaste from '@mui/icons-material/ContentPaste'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import CloseIcon from '@mui/icons-material/Close'
import TextField from '@mui/material/TextField'
import { useConfirm } from 'material-ui-confirm'
import { useState } from 'react'
import { toast } from 'react-toastify'
import ListCards from './ListCards/ListCards'

import { useDispatch, useSelector } from 'react-redux'
import {
  selectCurrentActiveBoard,
  updateCurrentActiveBoard
} from '~/redux/activeBoard/activeBoardSlice'

import {
  createNewCardAPI,
  deleteColumnDetailsAPI,
  updateColumnDetailsAPI
} from '~/apis'
import { cloneDeep } from 'lodash'
import ToggleFocusInput from '~/components/Form/ToggleFocusInput'
import { socketIoInstance } from '~/socket-client'
function Column({ column }) {
  const board = useSelector(selectCurrentActiveBoard)
  const dispatch = useDispatch()
  const confirmDeleteColumn = useConfirm()
  const [openNewCardForm, setOpenNewCardForm] = useState(false)
  const toggleOpenNewCardForm = () => {
    setOpenNewCardForm(!openNewCardForm)
  }

  const [newCardTitle, setNewCardTitle] = useState('')
  const addNewCard = async () => {
    if (!newCardTitle) {
      toast.error('Please enter Card Title!', {
        position: 'bottom-right'
      })
      return
    }
    const newCardData = {
      title: newCardTitle,
      columnId: column._id
    }
    // goi api
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    })

    createdCard.labels = []
    // cap nhat state board
    const newBoard = cloneDeep(board)
    const columnToUpdate = newBoard.columns.find(
      column => column._id === createdCard.columnId
    )
    // console.log('🚀 ~ createNewCard ~ columnToUpdate:', columnToUpdate)
    if (columnToUpdate) {
      if (columnToUpdate.cards.some(card => card.FE_PlaceholderCard === true)) {
        columnToUpdate.cards = [createdCard]
        columnToUpdate.cardOrderIds = [createdCard._id]
      } else {
        columnToUpdate.cards.push(createdCard)
        columnToUpdate.cardOrderIds.push(createdCard._id)
      }
    }
    // setBoard(newBoard)
    // SET BOARD nhu SETSTATE TRONG REDUX
    dispatch(updateCurrentActiveBoard(newBoard))
    // dong trang thai
    toggleOpenNewCardForm()
    setNewCardTitle('')
  }

  // xu li xoa 1 column va card trong no
  const handleDeleteColumn = () => {
    confirmDeleteColumn({
      title: 'Delete Column',
      description:
        'This action is permanently delete your Column and Its Cards! Are you sure?',
      confirmationText: 'Confirm',
      cancellationText: 'Cancel',
      buttonOrder: ['confirm', 'cancel']
    })
      .then(() => {
        // console.log(column._id)
        // console.log(column.title)
        // goi tu component cao nhat

        // console.log('🚀 ~ Board ~ columnId:', columnId)
        // update state board
        const newBoard = cloneDeep(board)
        newBoard.columns = newBoard.columns.filter(c => c._id !== column._id)
        newBoard.columnOrderIds = newBoard.columnOrderIds.filter(
          _id => _id !== column._id
        )
        // setBoard(newBoard)
        // SET BOARD nhu SETSTATE TRONG REDUX
        dispatch(updateCurrentActiveBoard(newBoard))
        // goi api xu li
        deleteColumnDetailsAPI(column._id).then(res => {
          toast.success(res?.deleteResult)
          // console.log('🚀 ~ deleteColumnDetails ~ columnId:', columnId)
          socketIoInstance.emit('FE_DELETE_COLUMN', res)
        })
      })
      .catch(() => {})
  }

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: column._id, data: { ...column } })

  // https://github.com/clauderic/dnd-kit/issues/117
  // The items are stretched because you're using CSS.Transform.toString(),
  // use CSS.Translate.toString() if you don't want to have the scale transformation applied.
  // tạm tắt transition vì lag
  const dndKitColumnStyle = {
    // touchAction: 'none',
    transform: CSS.Translate.toString(transform),
    transition,
    height: '100%',
    opacity: isDragging ? 0.5 : undefined
  }

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const onUpdateColumnTitle = newTitle => {
    updateColumnDetailsAPI(column._id, { title: newTitle }).then(() => {
      const newBoard = cloneDeep(board)
      const columnToUpdate = newBoard.columns.find(c => column._id === c._id)
      if (columnToUpdate) {
        columnToUpdate.title = newTitle
      }
      // setBoard(newBoard)
      // SET BOARD nhu SETSTATE TRONG REDUX
      dispatch(updateCurrentActiveBoard(newBoard))
    })
  }

  const orderedCard = column.cards
  return (
    <div ref={setNodeRef} style={dndKitColumnStyle} {...attributes}>
      <Box
        {...listeners}
        sx={{
          minWidth: '300px',
          maxWidth: '300px',
          bgcolor: theme =>
            theme.palette.mode === 'dark' ? '#333643' : '#ebecf0',
          ml: 2,
          borderRadius: '12px',
          height: 'fit-content',
          maxHeight: theme =>
            `calc(${theme.trelloCustom.boardContentHeight} - ${theme.spacing(
              5
            )})`
        }}
      >
        {/* Box Header */}
        <Box
          sx={{
            height: theme => theme.trelloCustom.columnHeaderHeight,
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          {/* <Typography
            variant="h6"
            sx={{
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            {column?.title}
          </Typography> */}
          <ToggleFocusInput
            data-no-dnd="true"
            value={column?.title}
            onChangedValue={onUpdateColumnTitle}
          />
          <Box>
            <Box>
              <Tooltip title="More options">
                <ExpandMoreIcon
                  sx={{ color: 'text.primary', cursor: 'pointer' }}
                  id="basic-column-dropdown"
                  aria-controls={
                    open ? 'basic-menu-column-dropdown' : undefined
                  }
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleClick}
                />
              </Tooltip>
              {/* dropdown */}
              <Menu
                id="basic-menu-column-dropdown"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-column-dropdown'
                }}
              >
                <MenuItem
                  sx={{
                    '&:hover': {
                      color: 'success.light',
                      '& .add-card-icon': {
                        color: 'success.light'
                      }
                    }
                  }}
                  onClick={toggleOpenNewCardForm}
                >
                  <ListItemIcon>
                    <AddCardIcon className="add-card-icon" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Add new card</ListItemText>
                </MenuItem>
                {/* <MenuItem>
                  <ListItemIcon>
                    <ContentCut fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Cut</ListItemText>
                </MenuItem>
                <MenuItem>
                  <ListItemIcon>
                    <ContentCopy fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Copy</ListItemText>
                </MenuItem>
                <MenuItem>
                  <ListItemIcon>
                    <ContentPaste fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Paste</ListItemText>
                </MenuItem> */}
                <Divider />
                <MenuItem
                  onClick={handleDeleteColumn}
                  sx={{
                    '&:hover': {
                      color: 'warning.dark',
                      '& .delete-forever-icon': {
                        color: 'warning.dark'
                      }
                    }
                  }}
                >
                  <ListItemIcon>
                    <DeleteForeverIcon
                      className="delete-forever-icon"
                      fontSize="small"
                    />
                  </ListItemIcon>
                  <ListItemText>Delete this column</ListItemText>
                </MenuItem>
                {/* <MenuItem>
                  <ListItemIcon>
                    <Cloud fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Archive this column</ListItemText>
                </MenuItem> */}
              </Menu>
            </Box>
          </Box>
        </Box>

        {/* Box card  List Card*/}
        <ListCards cards={orderedCard} />
        {/* Footer */}
        <Box
          sx={{
            height: theme => theme.trelloCustom.columnFooterHeight,
            p: 2
          }}
        >
          {!openNewCardForm ? (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Button
                startIcon={<AddCardIcon />}
                onClick={toggleOpenNewCardForm}
              >
                Add new Card
              </Button>
              <Tooltip title="Drag to move">
                <DragHandleIcon sx={{ cursor: 'pointer' }} />
              </Tooltip>
            </Box>
          ) : (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <TextField
                label="Enter Card title..."
                type="text"
                size="small"
                variant="outlined"
                data-no-dnd="true"
                autoFocus
                value={newCardTitle}
                onChange={e => {
                  setNewCardTitle(e.target.value)
                }}
                sx={{
                  '& label': { color: 'text.primary' },
                  '& input': {
                    color: theme => theme.palette.primary.main,
                    bgcolor: theme =>
                      theme.palette.mode === 'dark' ? '#333643' : 'white'
                  },
                  '& label.Mui-focused': {
                    color: theme => theme.palette.primary.main
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: theme => theme.palette.primary.main
                    },
                    '&:hover fieldset': {
                      borderColor: theme => theme.palette.primary.main
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme => theme.palette.primary.main
                    },
                    '&MuiOutlinedInput-input': {
                      borderRadius: 1
                    }
                  }
                }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  data-no-dnd="true"
                  className="interceptor-loading"
                  onClick={addNewCard}
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
                  Add
                </Button>
                <CloseIcon
                  data-no-dnd="true"
                  fontSize="small"
                  sx={{
                    color: theme => theme.palette.warning.light,
                    cursor: 'pointer'
                  }}
                  onClick={toggleOpenNewCardForm}
                />
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </div>
  )
}

export default Column
