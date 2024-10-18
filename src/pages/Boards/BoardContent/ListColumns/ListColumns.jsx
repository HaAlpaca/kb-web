import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Column from './Column/Column'
import {
  SortableContext,
  horizontalListSortingStrategy
} from '@dnd-kit/sortable'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import { useState } from 'react'

import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'

function ListColumns({ columns }) {
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
  const toggleOpenNewColumnForm = () => {
    setOpenNewColumnForm(!openNewColumnForm)
  }

  const [newColumnTitle, setNewColumnTitle] = useState('')
  const addNewColumn = () => {
    if (!newColumnTitle) {
      // console.error('Please enter column title')
      return
    }

    // goi api
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
