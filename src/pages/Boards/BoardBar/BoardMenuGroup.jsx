import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import { useState } from 'react'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import CancelIcon from '@mui/icons-material/Cancel'
import {
  Chip,
  Divider,
  Drawer,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
  Switch,
  FormGroup
} from '@mui/material'
import ToggleFocusInput from '~/components/Form/ToggleFocusInput'
import Grid from '@mui/material/Grid'
import { updateBoardDetailsAPI } from '~/apis'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectCurrentActiveBoard,
  updateCurrentActiveBoard
} from '~/redux/activeBoard/activeBoardSlice'
import { cloneDeep } from 'lodash'
import BoardUserGroup from './BoardUserGroup'
import CardUserGroup from '~/components/Modal/ActiveCard/CardUserGroup'
import { BOARD_TYPES, CARD_MEMBER_ACTION } from '~/utils/constants'
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard'
import { socketIoInstance } from '~/socket-client'
import BoardUserRole from './BoardUserRole'
const boardCoverImages = [
  'https://images.unsplash.com/photo-1741926376117-85ec2cef9714',
  'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5',
  'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1',
  'https://images.unsplash.com/photo-1703146893334-5bd85e47108e',
  'https://images.unsplash.com/photo-1673187446875-d3149449953b',
  'https://images.unsplash.com/photo-1669236712949-b58f9758898d',
  'https://images.unsplash.com/photo-1655955086611-47f6d063c763',
  'https://images.unsplash.com/photo-1712743586807-93f857693f3f'
]

function BoardMenuGroup({ board, MENU_STYLE }) {
  const boardRedux = useSelector(selectCurrentActiveBoard)
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const [boardType, setBoardType] = useState(board?.type || 'private')
  const [loadedImages, setLoadedImages] = useState(
    Array(boardCoverImages.length).fill(false)
  )

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
      socketIoInstance.emit('FE_UPDATE_BOARD', newBoard)
    })
  }

  const handleBoardUpdate = async (field, value) => {
    await updateBoardDetailsAPI(board?._id, { [field]: value }).then(res =>
      socketIoInstance.emit('FE_UPDATE_BOARD', res)
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

  const DrawerList = (
    <Box sx={{ width: 500, padding: 2, paddingTop: 1 }} role="presentation">
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Typography sx={{ whiteSpace: 'nowrap', fontWeight: '500' }}>
            Board Name:
          </Typography>
          <ToggleFocusInput
            value={board?.title}
            sx={{ fontSize: 12, fontWeight: 500 }}
            onChangedValue={newTitle => handleBoardUpdate('title', newTitle)}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Typography sx={{ whiteSpace: 'nowrap', fontWeight: '500' }}>
            Board Description:
          </Typography>
          <ToggleFocusInput
            value={board?.description}
            sx={{ fontSize: 12, fontWeight: 500 }}
            onChangedValue={newDesc =>
              handleBoardUpdate('description', newDesc)
            }
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography sx={{ whiteSpace: 'nowrap', fontWeight: 500 }}>
            Board Type:
          </Typography>
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
        </Box>
      </Box>

      <Divider />

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
                onClick={() => handleCoverChange(url)}
                sx={{
                  position: 'relative',
                  width: '100%',
                  paddingTop: '75%',
                  borderRadius: 1,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border:
                    board?.cover === url
                      ? '2px solid #60B5FF'
                      : '2px solid transparent',
                  boxShadow:
                    board?.cover === url ? '0 0 0 2px #60B5FF' : 'none',
                  transition: 'border 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    border: '2px solid #60B5FF',
                    boxShadow: '0 0 0 2px #60B5FF'
                  }
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
        <Typography sx={{ fontSize: '32px', fontWeight: 600 }}>
          Members:
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ whiteSpace: 'nowrap', fontWeight: '500' }}>
            Owners:
          </Typography>
          <CardUserGroup
            cardMemberIds={board?.ownerIds}
            onUpdateCardMembers={incomingMemberInfo => {
              onUpdateBoardMembers(incomingMemberInfo)
            }}
          />
        </Box>
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
            isShowAddMember={false}
          />
          {/* <BoardUserGroup boardUsers={board?.members} limit={8} /> */}
        </Box>
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
        <Typography sx={{ fontSize: '32px', fontWeight: 600 }}>
          User Role:
        </Typography>
        <BoardUserRole currentUserId={board?.ownerIds[0]} />

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
