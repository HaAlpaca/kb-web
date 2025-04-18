import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import IconButton from '@mui/material/IconButton'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp'
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown'
import { updateCardDetailsAPI } from '~/apis'
import {
  selectCurrentActiveCard,
  updateCurrentActiveCard
} from '~/redux/activeCard/activeCardSlice'
import { cloneDeep } from 'lodash'

function ChecklistSettingModal({
  cardChecklistIds,
  checklist,
  onDeleteChecklist
}) {
  const dispatch = useDispatch()
  const activeCard = useSelector(selectCurrentActiveCard)

  const [anchorEl, setAnchorEl] = React.useState(null)
  const openMenu = Boolean(anchorEl)

  const handleMenuClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }
  return (
    <Box>
      <IconButton size="small" onClick={handleMenuClick}>
        <MoreVertIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'center', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem
          onClick={() => {
            onDeleteChecklist(checklist._id)
            handleMenuClose()
          }}
        >
          <ListItemIcon>
            <DeleteOutlineOutlinedIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default ChecklistSettingModal
