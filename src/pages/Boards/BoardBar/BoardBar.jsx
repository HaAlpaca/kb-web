import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import { useSelector } from 'react-redux'
import LabelModal from '~/components/Modal/Label/LabelModal'
import useRoleInfo from '~/CustomHooks/useRoleInfo'
import { selectCurrentUser } from '~/redux/user/userSlice'
import BoardAnalystic from './BoardAnalystic'
import BoardAutomation from './BoardAutomation'
import BoardFilter from './BoardFilter'
import BoardMenuGroup from './BoardMenuGroup'
import BoardUserGroup from './BoardUserGroup'
import InviteBoardUser from './InviteBoardUser'

const MENU_STYLE = {
  color: 'white',
  bgcolor: 'transparent',
  border: 'none',
  padding: '5px',
  borderRadius: '4px',
  '.MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}

function BoardBar({ board }) {
  const currentUser = useSelector(selectCurrentUser) // Lấy thông tin user hiện tại
  const currentUserRole =
    board?.usersRole?.find(userRole => userRole.userId === currentUser?._id)
      ?.role || 'user' // Mặc định là 'user' nếu không tìm thấy

  const { isAdmin, isModerator } = useRoleInfo(board, currentUser?._id)
  return (
    <Box
      sx={{
        width: '100%',
        height: theme => theme.trelloCustom.boardBarHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        px: 2,
        overflowX: 'auto',
        bgcolor: theme =>
          theme.palette.mode === 'dark' ? '#34495e' : '#493D9EE6'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <BoardMenuGroup board={board} MENU_STYLE={MENU_STYLE} />
        {(isAdmin || isModerator) && (
          <BoardAnalystic board={board} MENU_STYLE={MENU_STYLE} />
        )}
        <BoardAutomation board={board} MENU_STYLE={MENU_STYLE} />
        <BoardFilter board={board} MENU_STYLE={MENU_STYLE} />
        <LabelModal BOARD_BAR_MENU_STYLE={MENU_STYLE} />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Tooltip title={`Role: ${currentUserRole}`}>
          <Button
            variant="outlined"
            startIcon={<AdminPanelSettingsIcon />}
            sx={{
              color: 'white',
              borderColor: 'white',
              '&:hover': { borderColor: 'white' }
            }}
          >
            {currentUserRole.charAt(0).toUpperCase() + currentUserRole.slice(1)}
          </Button>
        </Tooltip>
        <InviteBoardUser boardId={board?._id} />
        <BoardUserGroup boardUsers={board?.allMembers} limit={5} />
      </Box>
    </Box>
  )
}

export default BoardBar
