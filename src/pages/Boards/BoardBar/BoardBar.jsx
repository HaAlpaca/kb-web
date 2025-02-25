import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
// import MenuIcon from '@mui/icons-material/Menu'
// import Button from '@mui/material/Button'
// import Avatar from '@mui/material/Avatar'
// import AvatarGroup from '@mui/material/AvatarGroup'
// import { Tooltip } from '@mui/material'

import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined'
// import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
// import AddToDriveIcon from '@mui/icons-material/AddToDrive'
// import BoltIcon from '@mui/icons-material/Bolt'
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined'
// import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { capitalizeFirstLetter } from '~/utils/formatters'
import BoardUserGroup from './BoardUserGroup'
import InviteBoardUser from './InviteBoardUser'
import BoardMenuGroup from './BoardMenuGroup'
import LabelModal from '~/components/Modal/Label/LabelModal'
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
        '&::-webkit-scrollbar-track': { margin: 2 },
        bgcolor: theme =>
          theme.palette.mode === 'dark' ? '#34495e' : '#493D9EE6'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* <Tooltip title={board?.description}>
          <Chip
            sx={MENU_STYLE}
            icon={<DashboardIcon />}
            label={board?.title}
            onClick={() => {}}
          />
        </Tooltip> */}
        {/* Menu in Board */}
        <BoardMenuGroup
          board={board}
          boardId={board?._id}
          MENU_STYLE={MENU_STYLE}
        />

        <Chip
          sx={MENU_STYLE}
          icon={<VpnLockIcon />}
          label={capitalizeFirstLetter(board?.type)}
          onClick={() => {}}
        />
        {/* <Chip
          sx={MENU_STYLE}
          icon={<AddToDriveIcon />}
          label="Add to Google Drive"
          onClick={() => {}}
        /> */}
        {/* <Chip
          sx={MENU_STYLE}
          icon={<BoltIcon />}
          label="Automation"
          onClick={() => {}}
        /> */}
        <Chip
          sx={MENU_STYLE}
          icon={<TuneOutlinedIcon />}
          label="Filters"
          onClick={() => {}}
        />

        <LabelModal
          MENU_STYLE={MENU_STYLE}
          labels={board?.labels}
          boardId={board?._id}
        />

        <Chip
          sx={MENU_STYLE}
          icon={<ChatBubbleOutlineOutlinedIcon />}
          label="Teams"
          onClick={() => {}}
        />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <InviteBoardUser boardId={board?._id} />
        <BoardUserGroup boardUsers={board?.FE_allUsers} />
      </Box>
    </Box>
  )
}

export default BoardBar
