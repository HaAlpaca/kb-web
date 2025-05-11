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
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined'

function BoardFilter({ board, MENU_STYLE }) {
  const boardRedux = useSelector(selectCurrentActiveBoard)
  const dispatch = useDispatch()

  const [open, setOpen] = useState(false)

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

  const DrawerList = (
    <Box sx={{ width: 400, padding: 2, paddingTop: 1 }} role="presentation">
      <Typography sx={{ fontSize: '32px', fontWeight: 600, mb: 2 }}>
        Filters:
      </Typography>
    </Box>
  )

  return (
    <Box>
      <Tooltip title="Add Card Automation">
        <Chip
          sx={MENU_STYLE}
          icon={<TuneOutlinedIcon />}
          label="Filters"
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

export default BoardFilter
