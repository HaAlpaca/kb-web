import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Box, Button, Popover, TextField, Typography } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import Circle from '@uiw/react-color-circle'
import { socketIoInstance } from '~/socket-client'

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

export default function LabelEditModal({
  labelId,
  title,
  colour,
  handleDeleteLabel,
  handleChangeLabel
}) {
  const [anchorPopoverElement, setAnchorPopoverElement] = useState(null)
  const [hex, setHex] = useState(colour)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({ defaultValues: { labelTitle: title } })

  const isOpenPopover = Boolean(anchorPopoverElement)
  const popoverId = isOpenPopover ? 'invite-board-user-popover' : undefined

  const handleTogglePopover = event => {
    if (isOpenPopover) {
      reset() // Reset form về mặc định
      setHex(colour)
      setAnchorPopoverElement(null)
    } else {
      setAnchorPopoverElement(event.currentTarget)
    }
  }

  const changeLabel = async data => {
    const { labelTitle } = data
    await handleChangeLabel(labelTitle, labelId, hex).then(() => {
      setAnchorPopoverElement(null)
    })
  }

  const deleteLabel = async () => {
    await handleDeleteLabel(labelId).then(() => {
      setAnchorPopoverElement(null)
    })
  }

  return (
    <>
      <IconButton
        sx={{ width: '35px', height: '35px' }}
        onClick={handleTogglePopover}
      >
        <EditIcon />
      </IconButton>
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
            Edit Label
          </Typography>
          <form onSubmit={handleSubmit(changeLabel)}>
            <TextField
              fullWidth
              label="Change Label Title..."
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
                gap: '10px'
              }}
            >
              <Button variant="outlined" color="error" onClick={deleteLabel}>
                <DeleteIcon />
              </Button>
              <Button variant="outlined" type="submit" sx={{ width: '100%' }}>
                Save Changes
              </Button>
            </Box>
          </form>
        </Box>
      </Popover>
    </>
  )
}
