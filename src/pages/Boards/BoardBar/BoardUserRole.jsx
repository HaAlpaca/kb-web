import {
  Box,
  Avatar,
  Typography,
  Tooltip,
  Button,
  Menu,
  MenuItem,
  Collapse,
  IconButton
} from '@mui/material'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import {
  fetchFilteredBoardDetailsAPI,
  selectCurrentActiveBoard
} from '~/redux/activeBoard/activeBoardSlice'
import { handleUpdateUserRole } from '~/apis'
import useRoleInfo from '~/CustomHooks/useRoleInfo'
import { socketIoInstance } from '~/socket-client'
import { useParams, useSearchParams } from 'react-router-dom'

const roleDisplayNameMap = {
  admin: 'Manager',
  moderator: 'Member',
  user: 'Guest'
}

function BoardUserRole({ currentUserId }) {
  const board = useSelector(selectCurrentActiveBoard)
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

  const dispatch = useDispatch()
  const allBoardUsers = board.allMembers || []
  const { isOwner, isAdmin, ownerIndex } = useRoleInfo(board, currentUserId)

  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [open, setOpen] = useState(true) // trạng thái mở/đóng collapse

  const handleClick = (event, user) => {
    if (!isAdmin || (isOwner && user._id === currentUserId)) return // Không cho phép owner chỉnh sửa vai trò của chính mình
    setAnchorEl(event.currentTarget)
    setSelectedUser(user)
  }

  const handleClose = () => {
    setAnchorEl(null)
    setSelectedUser(null)
  }

  const handleChangeRole = async newRole => {
    if (!selectedUser) return
    await handleUpdateUserRole(board._id, {
      userId: selectedUser._id,
      role: newRole
    }).then(() => {
      handleRefreshBoard()
      socketIoInstance.emit('FE_UPDATE_BOARD', { boardId: board._id })
      handleClose()
    })
  }

  const roles = ['user', 'moderator']

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 1
        }}
      >
        <Typography variant="h6">Board Role</Typography>
        <IconButton onClick={() => setOpen(prev => !prev)}>
          {open ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>

      <Collapse in={open}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
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
                <Tooltip
                  title={`Role: ${
                    roleDisplayNameMap[user.boardRole] || 'Guest'
                  }`}
                >
                  <Typography variant="body2">{user.displayName}</Typography>
                </Tooltip>
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip
                  title={
                    isAdmin
                      ? isOwner && user._id === currentUserId
                        ? 'You cannot change your own role as the owner'
                        : 'Change user role'
                      : 'Only admin can change role'
                  }
                >
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={e => handleClick(e, user)}
                    disabled={
                      !isAdmin || (isOwner && user._id === currentUserId) // Vô hiệu hóa nút nếu là owner và đang chỉnh sửa chính mình
                    }
                  >
                    {roleDisplayNameMap[user.boardRole]?.toUpperCase() ||
                      'GUEST'}
                  </Button>
                </Tooltip>
              </Box>
            </Box>
          ))}
        </Box>
      </Collapse>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {roles.map(role => (
          <MenuItem
            key={role}
            onClick={() => handleChangeRole(role)}
            selected={selectedUser?.boardRole === role}
          >
            {roleDisplayNameMap[role] || 'Guest'}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )
}

export default BoardUserRole
