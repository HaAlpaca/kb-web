import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import { useState } from 'react'
// import PersonAddIcon from '@mui/icons-material/PersonAdd'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import {
  Chip,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from '@mui/material'

function BoardMenuGroup({ board, boardId, MENU_STYLE }) {
  /**
   * Xử lý Popover để ẩn hoặc hiện một popup nhỏ, tương tự docs để tham khảo ở đây:
   * https://mui.com/material-ui/react-popover/
   */

  const [anchorPopoverElement, setAnchorPopoverElement] = useState(null)
  const isOpenPopover = Boolean(anchorPopoverElement)
  const popoverId = isOpenPopover ? 'invite-board-user-popover' : undefined
  const handleTogglePopover = event => {
    if (!anchorPopoverElement) setAnchorPopoverElement(event.currentTarget)
    else setAnchorPopoverElement(null)
  }

  const [open, setOpen] = useState(false)

  const toggleDrawer = newOpen => () => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return
    }

    setOpen(newOpen)
  }

  const DrawerList = (
    <Box sx={{ width: 350 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? (
                  <DashboardOutlinedIcon />
                ) : (
                  <DashboardOutlinedIcon />
                )}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? (
                  <DashboardOutlinedIcon />
                ) : (
                  <DashboardOutlinedIcon />
                )}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <Box aria-describedby={popoverId} onClick={toggleDrawer(true)}>
      <Tooltip title={board?.description}>
        <Chip
          sx={MENU_STYLE}
          icon={<DashboardOutlinedIcon />}
          label={board?.title}
          onClick={() => {}}
        />
      </Tooltip>

      <Drawer open={open} onClose={() => setOpen(false)}>
        {DrawerList}
      </Drawer>
    </Box>
  )
}

export default BoardMenuGroup
