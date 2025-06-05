import EventIcon from '@mui/icons-material/Event'
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material'
import Box from '@mui/material/Box'
import Popover from '@mui/material/Popover'
import Typography from '@mui/material/Typography'
import { DateTimePicker } from '@mui/x-date-pickers'
import { cloneDeep } from 'lodash'
import moment from 'moment'
import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateCardDetailsAPI } from '~/apis'
import {
  selectCurrentActiveBoard,
  updateCurrentActiveBoard
} from '~/redux/activeBoard/activeBoardSlice'
import {
  selectCurrentActiveCard,
  updateCurrentActiveCard
} from '~/redux/activeCard/activeCardSlice'

import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'

function DateModal({ SidebarItem, card }) {
  const board = useSelector(selectCurrentActiveBoard)
  const dispatch = useDispatch()
  const activeCardModal = useSelector(selectCurrentActiveCard)

  const [anchorPopoverElement, setAnchorPopoverElement] = useState(null)
  const isOpenPopover = Boolean(anchorPopoverElement)
  const popoverId = isOpenPopover ? 'invite-board-user-popover' : undefined

  const [startDate, setStartDate] = useState(
    card.startDate ? moment(card.startDate) : moment(card.createdAt)
  )
  const [dueDate, setDueDate] = useState(
    card.dueDate
      ? moment(card.dueDate)
      : moment()
          .add(1, 'day')
          .set({ hour: 9, minute: 0, second: 0, millisecond: 0 })
  )

  const handleTogglePopover = event => {
    setAnchorPopoverElement(prev => (prev ? null : event.currentTarget))
  }

  const handleStartDateChange = newValue => {
    if (newValue) {
      const newStartDate = moment(newValue)
      setStartDate(newStartDate)

      if (dueDate.isBefore(newStartDate)) {
        setDueDate(newStartDate.clone().add(1, 'day'))
      }
    }
  }

  const handleDueDateChange = newValue => {
    if (newValue) {
      const newDueDate = moment(newValue)
      if (newDueDate.isAfter(startDate)) {
        setDueDate(newDueDate)
      }
    }
  }

  const handleSubmit = async () => {
    const startTimestamp = startDate.valueOf()
    const dueTimestamp = dueDate.valueOf()

    const data = {
      startDate: startTimestamp,
      dueDate: dueTimestamp,
      reminder: dueTimestamp
    }

    await updateCardDetailsAPI(card._id, { updateDueDate: data }).then(() => {
      const newBoard = cloneDeep(board)
      newBoard.columns.forEach(column => {
        column.cards.forEach(cardLoop => {
          if (cardLoop._id === card._id) {
            cardLoop.startDate = startTimestamp
            cardLoop.dueDate = dueTimestamp
          }
        })
      })
      dispatch(updateCurrentActiveBoard(newBoard))

      // Update card modal
      const newActiveCardModal = cloneDeep(activeCardModal)
      newActiveCardModal.startDate = startTimestamp
      newActiveCardModal.dueDate = dueTimestamp

      dispatch(updateCurrentActiveCard(newActiveCardModal))
      setAnchorPopoverElement(null)
    })
  }

  return (
    <>
      <SidebarItem aria-describedby={popoverId} onClick={handleTogglePopover}>
        <EventIcon fontSize="small" />
        Dates
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
            px: 1,
            py: 1.5,
            display: 'flex',
            flexDirection: 'column',
            gap: 1
          }}
        >
          <Typography sx={{ fontWeight: 'bold', fontSize: '24px' }}>
            Set up a Due Date
          </Typography>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              gap: 1.5
            }}
          >
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DateTimePicker
                label="Start Date"
                value={startDate}
                onChange={handleStartDateChange}
                renderInput={params => (
                  <TextField {...params} size="small" fullWidth />
                )}
              />
              <DateTimePicker
                label="Due Date"
                value={dueDate}
                minDate={startDate}
                onChange={handleDueDateChange}
                renderInput={params => (
                  <TextField {...params} size="small" fullWidth />
                )}
              />
            </LocalizationProvider>

            <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
              <Button
                type="button"
                variant="outlined"
                color="error"
                sx={{ flex: 1 }}
              >
                Remove
              </Button>
              <Button
                type="button"
                variant="outlined"
                onClick={handleSubmit}
                sx={{ flex: 2 }}
              >
                Save
              </Button>
            </Box>
          </Box>
        </Box>
      </Popover>
    </>
  )
}

export default DateModal
