import Box from '@mui/material/Box'
import LabelModal from '~/components/Modal/Label/LabelModal'
import BoardAnalystic from './BoardAnalystic'
import BoardAutomation from './BoardAutomation'
import BoardMenuGroup from './BoardMenuGroup'
import BoardUserGroup from './BoardUserGroup'
import InviteBoardUser from './InviteBoardUser'
import BoardFilter from './BoardFilter'
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
        // overflowX: 'scroll',
        '&::-webkit-scrollbar-track': { margin: 2 },
        bgcolor: theme =>
          theme.palette.mode === 'dark' ? '#34495e' : '#493D9EE6'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {/* <Tooltip title={board?.description}>
          <Chip
            sx={MENU_STYLE}
            icon={<DashboardIcon />}
            label={board?.title}
            onClick={() => {}}
          />
        </Tooltip> */}
        {/* Menu in Board */}
        <BoardMenuGroup board={board} MENU_STYLE={MENU_STYLE} />

        <BoardAnalystic board={board} MENU_STYLE={MENU_STYLE} />
        <BoardAutomation board={board} MENU_STYLE={MENU_STYLE} />

        {/* <Chip
          sx={MENU_STYLE}
          icon={<AddToDriveIcon />}
          label="Add to Google Drive"
          onClick={() => {}}
        /> */}
        <BoardFilter board={board} MENU_STYLE={MENU_STYLE} />

        <LabelModal BOARD_BAR_MENU_STYLE={MENU_STYLE} />

        {/* <Chip
          sx={MENU_STYLE}
          icon={<ChatBubbleOutlineOutlinedIcon />}
          label="Teams"
          onClick={() => {}}
        /> */}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* <Button
          variant="outlined"
          // startIcon={<PersonAddIcon />}
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': { borderColor: 'white' }
          }}
        >
          Ask admin to change role
        </Button> */}
        <InviteBoardUser boardId={board?._id} />
        <BoardUserGroup boardUsers={board?.allMembers} limit={5} />
        {/* <VoiceRTC boardId={board._id} userId="" /> */}
      </Box>
    </Box>
  )
}

export default BoardBar
