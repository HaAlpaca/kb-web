import { useState } from 'react'
import { Box, IconButton, Popover, Typography, Button } from '@mui/material'
import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined'
import moment from 'moment'
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
const ChecklistSetDueDate = ({ checklist, progress, onChangeDate }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedDate, setSelectedDate] = useState(
    checklist.dueDate ? moment(checklist.dueDate) : null
  )
  const [tempDate, setTempDate] = useState(
    checklist.dueDate ? moment(checklist.dueDate) : null
  )

  const isOpenPopover = Boolean(anchorEl)
  const popoverId = isOpenPopover ? 'set-due-date-popover' : undefined

  const handleTogglePopover = event => {
    setAnchorEl(prev => (prev ? null : event.currentTarget))
  }

  const handleAcceptDate = newDate => {
    setSelectedDate(newDate)
    if (onChangeDate && newDate) {
      onChangeDate(checklist._id, newDate.valueOf()) // <-- timestamp
    }
    handleTogglePopover()
  }

  const handleClearDate = () => {
    setSelectedDate(null)
    setTempDate(moment())
    if (onChangeDate) {
      onChangeDate(checklist._id, null)
    }
    handleTogglePopover()
  }

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {selectedDate ? (
          <Box
            sx={{
              bgcolor:
                progress === 100
                  ? 'success.main'
                  : moment().isAfter(selectedDate)
                  ? 'error.main'
                  : 'info.main',
              color: 'white',
              borderRadius: '8px',
              padding: '4px 8px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
            aria-describedby={popoverId}
            onClick={handleTogglePopover}
          >
            {selectedDate.format('HH:mm  MMM D, YYYY')}
          </Box>
        ) : (
          <IconButton
            onClick={handleTogglePopover}
            size="small"
            aria-describedby={popoverId}
          >
            <WatchLaterOutlinedIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      <Popover
        id={popoverId}
        open={isOpenPopover}
        anchorEl={anchorEl}
        onClose={handleTogglePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5
          }}
        >
          <Typography sx={{ fontWeight: 600, fontSize: 16 }}>
            Set Due Date
          </Typography>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <StaticDateTimePicker
              value={tempDate}
              onChange={setTempDate}
              onAccept={handleAcceptDate}
              displayStaticWrapperAs="desktop"
              slotProps={{
                textField: { size: 'small' }
              }}
            />
          </LocalizationProvider>
          <Button
            fullWidth
            size="small"
            color="error"
            onClick={handleClearDate}
          >
            Clear Due Date
          </Button>
        </Box>
      </Popover>
    </>
  )
}

export default ChecklistSetDueDate
