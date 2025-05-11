import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import { useState } from 'react'
import {
  Chip,
  Divider,
  Drawer,
  Typography,
  Switch,
  FormGroup,
  FormControlLabel
} from '@mui/material'
import CancelIcon from '@mui/icons-material/Cancel'
import BoltIcon from '@mui/icons-material/Bolt'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'

function BoardAutomation({ board, MENU_STYLE }) {
  const boardRedux = useSelector(selectCurrentActiveBoard)
  const dispatch = useDispatch()

  const [open, setOpen] = useState(false)

  // Automation 1: when card is completed
  const [automationEnabled, setAutomationEnabled] = useState(false)
  const [selectedColumnId, setSelectedColumnId] = useState('')

  // Automation 2: when dueDate expired
  const [automationDueDateEnabled, setAutomationDueDateEnabled] =
    useState(false)
  const [selectedDueDateColumnId, setSelectedDueDateColumnId] = useState('')

  const toggleDrawer = newOpen => event => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return
    }
    setOpen(newOpen)
  }

  const getColumnTitleById = id =>
    boardRedux?.columns?.find(c => c._id === id)?.title || '(Not selected)'

  const DrawerList = (
    <Box sx={{ width: 400, padding: 2, paddingTop: 1 }} role="presentation">
      <Typography sx={{ fontSize: '32px', fontWeight: 600, mb: 2 }}>
        Automations:
      </Typography>

      {/* Automation 1: isComplete */}
      <Box sx={{ mb: 2 }}>
        <Typography sx={{ fontWeight: 500 }}>
          When a card is completed:
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={automationEnabled}
              onChange={e => setAutomationEnabled(e.target.checked)}
            />
          }
          label="Enable Completion Automation"
        />
      </Box>

      {automationEnabled && (
        <Box sx={{ mb: 2 }}>
          <Typography sx={{ mb: 1 }}>Move completed card to column:</Typography>
          <select
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '6px',
              border: '1px solid #ccc'
            }}
            value={selectedColumnId}
            onChange={e => setSelectedColumnId(e.target.value)}
          >
            <option value="">-- Select column --</option>
            {boardRedux?.columns?.map(column => (
              <option key={column._id} value={column._id}>
                {column.title}
              </option>
            ))}
          </select>
        </Box>
      )}

      <Divider sx={{ my: 2 }} />

      {/* Automation 2: dueDate expired */}
      <Box sx={{ mb: 2 }}>
        <Typography sx={{ fontWeight: 500 }}>
          When a card is overdue (dueDate expired):
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={automationDueDateEnabled}
              onChange={e => setAutomationDueDateEnabled(e.target.checked)}
            />
          }
          label="Enable Overdue Automation"
        />
      </Box>

      {automationDueDateEnabled && (
        <Box sx={{ mb: 2 }}>
          <Typography sx={{ mb: 1 }}>Move overdue card to column:</Typography>
          <select
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '6px',
              border: '1px solid #ccc'
            }}
            value={selectedDueDateColumnId}
            onChange={e => setSelectedDueDateColumnId(e.target.value)}
          >
            <option value="">-- Select column --</option>
            {boardRedux?.columns?.map(column => (
              <option key={column._id} value={column._id}>
                {column.title}
              </option>
            ))}
          </select>
        </Box>
      )}

      <Divider sx={{ my: 2 }} />

      {/* Danh sách automation đang bật */}
      <Box>
        <Typography sx={{ fontWeight: 500 }}>Current Automations:</Typography>
        <ul style={{ marginTop: '8px' }}>
          {automationEnabled && (
            <li>
              If <b>card is complete</b> → move to column:{' '}
              <i>{getColumnTitleById(selectedColumnId)}</i>
            </li>
          )}
          {automationDueDateEnabled && (
            <li>
              If <b>card is overdue</b> → move to column:{' '}
              <i>{getColumnTitleById(selectedDueDateColumnId)}</i>
            </li>
          )}
          {!automationEnabled && !automationDueDateEnabled && (
            <li>No automations enabled</li>
          )}
        </ul>
      </Box>
    </Box>
  )

  return (
    <Box>
      <Tooltip title="Add Card Automation">
        <Chip
          sx={MENU_STYLE}
          icon={<BoltIcon />}
          label="Automations"
          onClick={toggleDrawer(true)}
        />
      </Tooltip>

      <Drawer open={open} onClose={toggleDrawer(false)}>
        <Box
          sx={{
            padding: 2,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: 0
          }}
        >
          <Typography sx={{ fontWeight: 'bold' }}>Board Automation</Typography>
        </Box>
        <Box
          sx={{
            position: 'absolute',
            top: '12px',
            right: '10px',
            cursor: 'pointer'
          }}
        >
          <CancelIcon
            color="error"
            sx={{ '&:hover': { color: 'error.light' } }}
            onClick={toggleDrawer(false)}
          />
        </Box>
        {DrawerList}
      </Drawer>
    </Box>
  )
}

export default BoardAutomation
