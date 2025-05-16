import {
  Box,
  Avatar,
  Typography,
  Tooltip,
  Button,
  Menu,
  MenuItem
} from '@mui/material'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { handleUpdateUserRole } from '~/apis'

function BoardUserRole({ currentUserId }) {
  const board = useSelector(selectCurrentActiveBoard)
  const allBoardUsers = board.allMembers || []
  const currentUser = allBoardUsers.find(user => user._id === currentUserId)
  const isAdmin = currentUser?.boardRole === 'admin'

  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)

  const handleClick = (event, user) => {
    if (!isAdmin) return // chỉ admin mới được click
    setAnchorEl(event.currentTarget)
    setSelectedUser(user)
  }

  const handleClose = () => {
    setAnchorEl(null)
    setSelectedUser(null)
  }

  const handleChangeRole = async newRole => {
    if (!selectedUser) return
    try {
      const res = await handleUpdateUserRole(board._id, {
        userId: selectedUser._id,
        role: newRole
      })
      console.log('Updated role:', res)
    } catch (error) {
      console.error('Failed to update role:', error)
    } finally {
      handleClose()
    }
  }

  const roles = ['user', 'moderator', 'admin']

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}
    >
      {allBoardUsers.map((user, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 1,
            borderRadius: 1,
            bgcolor: theme =>
              theme.palette.mode === 'dark' ? '#2f3542' : '#f4f5f7'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar
              src={user.avatar}
              alt={user.displayName}
              sx={{ width: 36, height: 36 }}
            />
            <Tooltip title={`Role: ${user.boardRole}`}>
              <Typography variant="body2">{user.displayName}</Typography>
            </Tooltip>
          </Box>

          <Tooltip
            title={isAdmin ? 'Change user role' : 'Only admin can change role'}
          >
            <span>
              <Button
                size="small"
                variant="outlined"
                onClick={e => handleClick(e, user)}
                disabled={!isAdmin}
              >
                {user.boardRole.toUpperCase()}
              </Button>
            </span>
          </Tooltip>
        </Box>
      ))}

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {roles.map(role => (
          <MenuItem
            key={role}
            onClick={() => handleChangeRole(role)}
            selected={selectedUser?.boardRole === role}
          >
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )
}

export default BoardUserRole
