import { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  Box,
  Button,
  Popover,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import IconButton from '@mui/material/IconButton'
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined'
import { Circle } from '@uiw/react-color'
import { handleCreateLabelAPI } from '~/apis'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectCurrentActiveBoard,
  updateCurrentActiveBoard
} from '~/redux/activeBoard/activeBoardSlice'
import { cloneDeep } from 'lodash'

const colours = [
  '#f44336',
  '#e91e63',
  '#9c27b0',
  '#673ab7',
  '#3f51b5',
  '#2196f3',
  '#03a9f4',
  '#00bcd4',
  '#009688',
  '#4caf50',
  '#8bc34a',
  '#cddc39',
  '#ffeb3b',
  '#ffc107',
  '#ff9800',
  '#ff5722',
  '#795548',
  '#9e9e9e',
  '#607d8b'
]

export default function LabelAddNewModal({ boardId, cardId = null }) {
  const board = useSelector(selectCurrentActiveBoard)
  const dispatch = useDispatch()
  // Popover state
  const [anchorPopoverElement, setAnchorPopoverElement] = useState(null)
  const isOpenPopover = Boolean(anchorPopoverElement)
  const popoverId = isOpenPopover ? 'invite-board-user-popover' : undefined

  const handleTogglePopover = event => {
    setAnchorPopoverElement(prev => (prev ? null : event.currentTarget))
  }

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm()
  const [hex, setHex] = useState('#f44336')

  // Xử lý tạo label
  const addNewLabel = data => {
    const { labelTitle } = data
    handleCreateLabelAPI({ title: labelTitle, colour: hex, boardId }).then(
      res => {
        const newBoard = cloneDeep(board)
        newBoard.labels.push({
          _id: res._id,
          title: res.title,
          colour: res.colour
        })
        dispatch(updateCurrentActiveBoard(newBoard))
        reset() // Reset form sau khi submit thành công
        setAnchorPopoverElement(null)
      }
    )
  }

  return (
    <>
      <Tooltip title="Add new label">
        <IconButton
          sx={{ width: '35px', height: '35px' }}
          onClick={handleTogglePopover}
        >
          <AddCircleOutlinedIcon fontSize="large" sx={{ color: '#5CB338' }} />
        </IconButton>
      </Tooltip>

      <Popover
        id={popoverId}
        open={isOpenPopover}
        anchorEl={anchorPopoverElement}
        onClose={handleTogglePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: '300px',
            borderRadius: '5px',
            padding: '10px'
          }}
        >
          <Typography sx={{ fontWeight: 'bold', fontSize: '18px' }}>
            Create New Label
          </Typography>

          {/* Form */}
          <form onSubmit={handleSubmit(addNewLabel)}>
            <TextField
              autoFocus
              fullWidth
              label="Label Title..."
              variant="outlined"
              {...register('labelTitle', {
                required: 'Title is required',
                minLength: {
                  value: 3,
                  message: 'Title must be at least 3 characters'
                }
              })}
              error={!!errors.labelTitle}
              helperText={errors.labelTitle?.message}
            />

            <Circle
              color={hex}
              colors={colours}
              style={{ width: '100%', marginTop: '10px', marginBottom: '5px' }}
              onChange={color => setHex(color.hex)}
              pointProps={{ style: { padding: '4px', boxShadow: 'none' } }}
            />

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '10px',
                marginTop: '10px'
              }}
            >
              <Button variant="outlined" type="submit" sx={{ width: '100%' }}>
                Create Label
              </Button>
            </Box>
          </form>
        </Box>
      </Popover>
    </>
  )
}
