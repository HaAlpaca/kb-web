import Box from '@mui/material/Box'
import Popover from '@mui/material/Popover'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { Button, TextField } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchFilteredBoardDetailsAPI,
  selectCurrentActiveBoard
} from '~/redux/activeBoard/activeBoardSlice'
import {
  fetchCardDetailsAPI,
  selectCurrentActiveCard
} from '~/redux/activeCard/activeCardSlice'
import { useForm, Controller } from 'react-hook-form'
import { handleCreateChecklistAPI } from '~/apis'
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined'
import { useParams, useSearchParams } from 'react-router-dom'
import { socketIoInstance } from '~/socket-client'
function CreateChecklistModal({ SidebarItem, card }) {
  const board = useSelector(selectCurrentActiveBoard)
  const dispatch = useDispatch()
  const activeCardModal = useSelector(selectCurrentActiveCard)
  const { boardId } = useParams()
  const [searchParams] = useSearchParams()

  const handleRefreshBoard = () => {
    dispatch(
      fetchFilteredBoardDetailsAPI({
        boardId,
        queryParams: searchParams
      })
    )
  }

  const [anchorPopoverElement, setAnchorPopoverElement] = useState(null)
  const isOpenPopover = Boolean(anchorPopoverElement)
  const popoverId = isOpenPopover ? 'invite-board-user-popover' : undefined

  const handleTogglePopover = event => {
    setAnchorPopoverElement(prev => (prev ? null : event.currentTarget))
  }

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      checklistTitle: ''
    }
  })

  const onSubmit = async data => {
    const title = data.checklistTitle
    await handleCreateChecklistAPI({ title, cardId: card._id }).then(res => {
      // const newActiveCardModal = cloneDeep(activeCardModal)
      // newActiveCardModal.cardChecklistIds.push(res._id)
      // newActiveCardModal.checklists.push(res)
      // dispatch(updateCurrentActiveCard(newActiveCardModal))
      // // update board checklist
      // const newBoard = cloneDeep(board)
      // newBoard.columns.forEach(column => {
      //   column.cards.forEach(card => {
      //     if (card._id === card._id) {
      //       card.cardChecklistIds?.push(res._id)
      //       card.checklists?.push(res)
      //     }
      //   })
      // })
      // dispatch(updateCurrentActiveBoard(newBoard))
      handleRefreshBoard()
      dispatch(fetchCardDetailsAPI(card._id))
      socketIoInstance.emit('FE_CREATE_CHECKLIST', {
        ...res,
        boardId: board._id,
        cardId: activeCardModal._id
      })
    })

    // TODO: Dispatch redux or call API to create checklist here
    // Close popover and reset form
    handleTogglePopover()
    reset()
  }

  return (
    <>
      <SidebarItem aria-describedby={popoverId} onClick={handleTogglePopover}>
        <CheckBoxOutlinedIcon fontSize="small" />
        Checklist
      </SidebarItem>

      <Popover
        id={popoverId}
        open={isOpenPopover}
        anchorEl={anchorPopoverElement}
        onClose={handleTogglePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ height: '600px' }}
      >
        <Box
          sx={{
            width: '250px',
            px: 1,
            py: 1.5,
            display: 'flex',
            flexDirection: 'column',
            gap: 1
          }}
        >
          <Typography sx={{ fontWeight: 'bold', fontSize: '24px' }}>
            Create a new checklist
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                gap: 1.5
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  width: '100%',
                  flexDirection: 'column'
                }}
              >
                <Controller
                  name="checklistTitle"
                  control={control}
                  rules={{ required: 'Checklist title is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Checklist Title"
                      type="text"
                      size="small"
                      error={!!errors.checklistTitle}
                      helperText={errors.checklistTitle?.message}
                    />
                  )}
                />
                <Button type="submit" variant="outlined" sx={{ flex: 2 }}>
                  Create
                </Button>
              </Box>
            </Box>
          </form>
        </Box>
      </Popover>
    </>
  )
}

export default CreateChecklistModal
