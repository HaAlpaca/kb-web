import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

import Divider from '@mui/material/Divider'
import Menu from '@mui/material/Menu'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ContentCopy from '@mui/icons-material/ContentCopy'
import ContentCut from '@mui/icons-material/ContentCut'
import ContentPaste from '@mui/icons-material/ContentPaste'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import Cloud from '@mui/icons-material/Cloud'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AddCardIcon from '@mui/icons-material/AddCard'
import Button from '@mui/material/Button'
import DragHandleIcon from '@mui/icons-material/DragHandle'

import { useState } from 'react'
import ListCards from './ListCards/ListCards'
import { mapOrder } from '~/utils/sorts'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import CloseIcon from '@mui/icons-material/Close'
import TextField from '@mui/material/TextField'
import { toast } from 'react-toastify'

function Column({ column, createNewCard }) {
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
    await createNewCard(newCardData)
    // dong trang thai
    toggleOpenNewCardForm()
    setNewCardTitle('')
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

  const orderedCard = mapOrder(column?.cards, column?.cardOrderIds, '_id')
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
          borderRadius: '6px',
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
          <Typography
            variant="h6"
            sx={{
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            {column?.title}
          </Typography>
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
                MenuListProps={{
                  'aria-labelledby': 'basic-column-dropdown'
                }}
              >
                <MenuItem>
                  <ListItemIcon>
                    <AddCardIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Add new card</ListItemText>
                </MenuItem>
                <MenuItem>
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
                </MenuItem>

                <Divider />
                <MenuItem>
                  <ListItemIcon>
                    <DeleteForeverIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Remove this column</ListItemText>
                </MenuItem>
                <MenuItem>
                  <ListItemIcon>
                    <Cloud fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Archive this column</ListItemText>
                </MenuItem>
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
