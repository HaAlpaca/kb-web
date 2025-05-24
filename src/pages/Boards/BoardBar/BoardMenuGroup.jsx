import CancelIcon from '@mui/icons-material/Cancel'
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard'
import {
  Chip,
  CircularProgress,
  Divider,
  Drawer,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography
} from '@mui/material'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Tooltip from '@mui/material/Tooltip'
import { cloneDeep } from 'lodash'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateBoardDetailsAPI, archiveBoardAPI, leaveBoardAPI } from '~/apis' // Import API leave board
import ToggleFocusInput from '~/components/Form/ToggleFocusInput'
import {
  selectCurrentActiveBoard,
  updateCurrentActiveBoard
} from '~/redux/activeBoard/activeBoardSlice'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { socketIoInstance } from '~/socket-client'
import { BOARD_TYPES, CARD_MEMBER_ACTION } from '~/utils/constants'
import BoardUserRole from './BoardUserRole'
import { useNavigate } from 'react-router-dom'
import { useConfirm } from 'material-ui-confirm' // Import useConfirm
import CardUserGroup from '~/components/Modal/ActiveCard/CardUserGroup'
import useRoleInfo from '~/CustomHooks/useRoleInfo'

const boardCoverImages = [
  'https://images.unsplash.com/photo-1741926376117-85ec2cef9714',
  'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5',
  'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1',
  'https://images.unsplash.com/photo-1703146893334-5bd85e47108e',
  'https://images.unsplash.com/photo-1673187446875-d3149449953b',
  'https://images.unsplash.com/photo-1669236712949-b58f9758898d',
  'https://images.unsplash.com/photo-1712743586807-93f857693f3f'
]

function BoardMenuGroup({ board, MENU_STYLE }) {
  const confirm = useConfirm() // Khởi tạo useConfirm
  const boardRedux = useSelector(selectCurrentActiveBoard)
  const user = useSelector(selectCurrentUser)
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const [boardType, setBoardType] = useState(board?.type || 'private')
  const [loadedImages, setLoadedImages] = useState(
    Array(boardCoverImages.length).fill(false)
  )
  const navigate = useNavigate() // Hook để điều hướng sau khi archive
  const { isAdmin, isOwner, ownerIndex } = useRoleInfo(board, user?._id) // Sử dụng hook để lấy thông tin vai trò

  const isShowAddMember = isAdmin && isOwner && ownerIndex === 0 // Kiểm tra xem có hiển thị nút thêm thành viên hay không

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

  const handleImageLoad = index => {
    setLoadedImages(prev => {
      const updated = [...prev]
      updated[index] = true
      return updated
    })
  }

  const handleCoverChange = async url => {
    await updateBoardDetailsAPI(board?._id, {
      cover: url
    }).then(() => {
      const newBoard = cloneDeep(boardRedux)
      newBoard.cover = url
      dispatch(updateCurrentActiveBoard(newBoard))
      socketIoInstance.emit('FE_UPDATE_BOARD', {
        boardId: board._id,
        newBoard
      })
    })
  }

  const handleBoardUpdate = async (field, value) => {
    await updateBoardDetailsAPI(board?._id, { [field]: value }).then(res =>
      socketIoInstance.emit('FE_UPDATE_BOARD', {
        boardId: board._id,
        ...res
      })
    )
    const newBoard = cloneDeep(boardRedux)
    newBoard[field] = value
    dispatch(updateCurrentActiveBoard(newBoard))
  }

  const onUpdateBoardMembers = async incomingMemberInfo => {
    await updateBoardDetailsAPI(board?._id, {
      incomingMemberInfo
    }).then(res => {
      const newBoard = cloneDeep(boardRedux)
      newBoard.memberIds = res.memberIds
      newBoard.ownerIds = res.ownerIds
      dispatch(updateCurrentActiveBoard(newBoard))
      socketIoInstance.emit('FE_UPDATE_BOARD', newBoard)
    })
  }

  const handleArchiveBoard = async () => {
    await confirm({
      title: 'Confirm Archive',
      description: 'Are you sure you want to archive this board?',
      confirmationText: 'Yes',
      cancellationText: 'No'
    })
    await archiveBoardAPI(board?._id) // Gọi API archive
    navigate('/boards')
  }

  const handleLeaveBoard = async boardId => {
    if (isAdmin && ownerIndex === 0) {
      // Nếu là admin hiện tại, yêu cầu chọn admin mới
      const options = board.memberIds.map(memberId => {
        const member = board.allMembers.find(user => user._id === memberId)
        return {
          label: member?.displayName || 'Unknown',
          value: memberId
        }
      })

      const confirmed = await confirm({
        title: 'Confirm Leave',
        description:
          'You are the current admin. Please select a new admin before leaving the board.',
        // Hiển thị danh sách thành viên để chọn admin mới
        options: options,
        confirmationText: 'Leave',
        cancellationText: 'Cancel'
      })

      if (!confirmed || !confirmed.value) return // Không làm gì nếu không chọn admin mới

      const newAdminId = confirmed.value

      // Cập nhật admin mới
      await updateBoardDetailsAPI(boardId, { newAdminId }).then(res => {
        const newBoard = cloneDeep(boardRedux)
        newBoard.ownerIds = [newAdminId]
        newBoard.allMembers = newBoard.allMembers.map(member => {
          if (member._id === newAdminId) {
            return { ...member, boardRole: 'admin' }
          }
          return member
        })
        dispatch(updateCurrentActiveBoard(newBoard))
        socketIoInstance.emit('FE_UPDATE_BOARD', {
          boardId: board._id,
          ...res
        })
      })
    } else {
      // Nếu không phải admin, chỉ cần xác nhận rời board
      const confirmed = await confirm({
        title: 'Confirm Leave',
        description: 'Are you sure you want to leave this board?',
        confirmationText: 'Leave',
        cancellationText: 'Cancel'
      })

      if (!confirmed) return
    }

    // Gọi API để rời board
    await leaveBoardAPI(boardId)
    navigate('/boards') // Điều hướng về danh sách board
  }

  const DrawerList = (
    <Box sx={{ width: 500, padding: 2, paddingTop: 1 }} role="presentation">
      <Box>
        {/* Board Name */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Typography sx={{ whiteSpace: 'nowrap', fontWeight: '500' }}>
            Board Name:
          </Typography>
          {isAdmin ? (
            <ToggleFocusInput
              value={board?.title}
              sx={{ fontSize: 12, fontWeight: 500 }}
              onChangedValue={newTitle => handleBoardUpdate('title', newTitle)}
            />
          ) : (
            <Typography sx={{ fontSize: 12, fontWeight: 600 }}>
              {board?.title}
            </Typography>
          )}
        </Box>

        {/* Board Description */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Typography sx={{ whiteSpace: 'nowrap', fontWeight: '500' }}>
            Board Description:
          </Typography>
          {isAdmin ? (
            <ToggleFocusInput
              value={board?.description}
              sx={{ fontSize: 12, fontWeight: 500 }}
              onChangedValue={newDesc =>
                handleBoardUpdate('description', newDesc)
              }
            />
          ) : (
            <Typography sx={{ fontSize: 12, fontWeight: 600 }}>
              {board?.description || 'No description'}
            </Typography>
          )}
        </Box>

        {/* Board Type */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography sx={{ whiteSpace: 'nowrap', fontWeight: 500 }}>
            Board Type:
          </Typography>
          {isAdmin ? (
            <RadioGroup
              row
              value={boardType}
              onChange={e => {
                const newType = e.target.value
                setBoardType(newType)
                handleBoardUpdate('type', newType)
              }}
            >
              <FormControlLabel
                value={BOARD_TYPES.PRIVATE}
                control={<Radio />}
                label={BOARD_TYPES.PRIVATE}
              />
              <FormControlLabel
                value={BOARD_TYPES.PUBLIC}
                control={<Radio />}
                label={BOARD_TYPES.PUBLIC}
              />
            </RadioGroup>
          ) : (
            <Typography sx={{ fontSize: 12, fontWeight: 600 }}>
              {boardType}
            </Typography>
          )}
        </Box>
      </Box>

      <Divider />

      {/* Board Cover */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'start',
          flexDirection: 'column',
          gap: 1,
          py: 2
        }}
      >
        <Typography sx={{ fontSize: '32px', fontWeight: 600 }}>
          Cover:
        </Typography>
        <Grid container spacing={2}>
          {boardCoverImages.map((url, index) => (
            <Grid item xs={3} key={index}>
              <Box
                onClick={() => isAdmin && handleCoverChange(url)}
                sx={{
                  position: 'relative',
                  width: '100%',
                  paddingTop: '75%',
                  borderRadius: 1,
                  overflow: 'hidden',
                  cursor: isAdmin ? 'pointer' : 'not-allowed',
                  border:
                    board?.cover === url
                      ? '2px solid #E55050'
                      : '2px solid transparent',
                  boxShadow:
                    board?.cover === url ? '0 0 0 2px #E55050' : 'none',
                  transition: 'border 0.3s, box-shadow 0.3s',
                  '&:hover': isAdmin
                    ? {
                        border: '2px solid #E55050',
                        boxShadow: '0 0 0 2px #E55050'
                      }
                    : {}
                }}
              >
                {!loadedImages[index] && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <CircularProgress size={24} />
                  </Box>
                )}
                <img
                  src={`${url}?w=200`}
                  alt={`Cover ${index}`}
                  onLoad={() => handleImageLoad(index)}
                  style={{
                    display: loadedImages[index] ? 'block' : 'none',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Divider />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'start',
          flexDirection: 'column',
          gap: 0.5,
          py: 1
        }}
      >
        <BoardUserRole currentUserId={user?._id} />
      </Box>

      <Divider />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'start',
          flexDirection: 'column',
          gap: 0.5,
          py: 1
        }}
      >
        <Typography variant="h6">Board Member</Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ whiteSpace: 'nowrap', fontWeight: '500' }}>
            Owners:
          </Typography>
          <CardUserGroup
            cardMemberIds={board?.ownerIds}
            onUpdateCardMembers={incomingMemberInfo => {
              onUpdateBoardMembers(incomingMemberInfo)
            }}
            isShowAddMember={isShowAddMember} // Truyền giá trị isShowAddMember
          />
        </Box>
        {board?.memberIds?.length > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ whiteSpace: 'nowrap', fontWeight: '500' }}>
              Members:
            </Typography>
            <CardUserGroup
              cardMemberIds={board?.memberIds}
              onUpdateCardMembers={incomingMemberInfo =>
                onUpdateBoardMembers({
                  userId: incomingMemberInfo._id,
                  action: CARD_MEMBER_ACTION.ADD
                })
              }
              isShowAddMember={isShowAddMember} // Truyền giá trị isShowAddMember
            />
          </Box>
        )}
      </Box>

      <Divider />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mt: 2
        }}
      >
        <Typography sx={{ fontWeight: 'bold', color: 'error.main' }}>
          Danger Zone
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Chip
            label="Leave Board"
            color="warning"
            onClick={() => handleLeaveBoard(board?._id)} // Gọi hàm xử lý leave board
            sx={{
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'warning.dark',
                color: 'white'
              }
            }}
          />
          {board.ownerIds[0] === user?._id && (
            <Chip
              label="Archive Board"
              color="error"
              onClick={handleArchiveBoard} // Gọi hàm xử lý archive
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'error.dark',
                  color: 'white'
                }
              }}
            />
          )}
        </Box>
      </Box>
    </Box>
  )

  return (
    <Box>
      <Tooltip title={board?.description}>
        <Chip
          sx={MENU_STYLE}
          icon={<SpaceDashboardIcon />}
          label={board?.title}
          onClick={toggleDrawer(true)}
        />
      </Tooltip>

      <Drawer
        open={open}
        onClose={toggleDrawer(false)}
        sx={{ position: 'relative' }}
      >
        <Box
          sx={{
            padding: 2,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: 0
          }}
        >
          <Typography sx={{ fontWeight: 'bold' }}>Board Settings</Typography>
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

export default BoardMenuGroup
