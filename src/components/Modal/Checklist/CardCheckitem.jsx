import { useState } from 'react'
import { useForm } from 'react-hook-form'

import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'

import ToggleFocusInput from '~/components/Form/ToggleFocusInput'

function CardCheckitem({
  checklist,
  onUpdateCheckitemTitle,
  onToggleCheckitemStatus,
  onCreateNewCheckItem,

  onDeleteCheckitem
}) {
  const [openNewCheckItemForm, setOpenNewCheckItemForm] = useState(false)

  const toggleOpenNewCheckItemForm = () => {
    setOpenNewCheckItemForm(!openNewCheckItemForm)
    reset()
  }

  const { register, handleSubmit, reset } = useForm()

  const handleAddCheckItem = data => {
    const title = data?.title?.trim()
    if (title) {
      onCreateNewCheckItem(checklist._id, title)
      reset()
      toggleOpenNewCheckItemForm()
    }
  }

  return (
    <Grid container direction="column" alignItems="center" spacing={1}>
      {checklist.items.map((checkitem, idx) => (
        <Grid item key={idx} sx={{ width: '100%' }}>
          <Box
            sx={{
              borderRadius: '4px',
              paddingY: '4px',
              paddingLeft: '2px',
              paddingRight: '6px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              '&:hover': {
                backgroundColor: theme =>
                  theme.palette.mode === 'dark' ? '#333643' : '#ebecf0'
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Checkbox
                color="success"
                size="small"
                checked={checkitem.isCompleted || false}
                onChange={() =>
                  onToggleCheckitemStatus(
                    checklist._id,
                    checkitem._id,
                    !checkitem.isCompleted
                  )
                }
              />

              <ToggleFocusInput
                inputFontSize="16px"
                value={checkitem.content}
                onChangedValue={newTitle =>
                  onUpdateCheckitemTitle(
                    checklist._id,
                    checkitem._id,
                    newTitle.trim()
                  )
                }
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                onClick={() => onDeleteCheckitem(checklist._id, checkitem._id)}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
        </Grid>
      ))}

      {!openNewCheckItemForm ? (
        <Button
          sx={{ width: '100%' }}
          startIcon={<CheckBoxOutlinedIcon />}
          onClick={toggleOpenNewCheckItemForm}
        >
          Add new Checklist
        </Button>
      ) : (
        <Grid item xs={12}>
          <Box
            component="form"
            onSubmit={handleSubmit(handleAddCheckItem)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <TextField
              label="Enter checkitem title..."
              type="text"
              size="small"
              variant="outlined"
              data-no-dnd="true"
              autoFocus
              {...register('title', { required: true })}
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
                  }
                }
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                type="submit"
                variant="contained"
                color="success"
                size="small"
                data-no-dnd="true"
                sx={{
                  boxShadow: 'none',
                  border: '0.5px solid',
                  borderColor: theme => theme.palette.success.main,
                  '&:hover': {
                    bgcolor: theme => theme.palette.success.main
                  }
                }}
              >
                Add
              </Button>

              <CloseIcon
                fontSize="small"
                data-no-dnd="true"
                sx={{
                  color: theme => theme.palette.warning.light,
                  cursor: 'pointer'
                }}
                onClick={toggleOpenNewCheckItemForm}
              />
            </Box>
          </Box>
        </Grid>
      )}
    </Grid>
  )
}

export default CardCheckitem
