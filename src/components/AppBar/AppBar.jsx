import Box from '@mui/material/Box'
import ModeSelect from '~/components/ModeSelect/ModeSelect'
import AppsIcon from '@mui/icons-material/Apps'
import SvgIcon from '@mui/material/SvgIcon'
import { ReactComponent as LogoIcon } from '~/assets/logo.svg'
import { Typography } from '@mui/material'
// import Button from '@mui/material/Button'
import Badge from '@mui/material/Badge'
import Tooltip from '@mui/material/Tooltip'
// import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
// import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined'
// import Workspaces from './Menus/Workspaces'
// import Recent from './Menus/Recent'
// import Starred from './Menus/Starred'
// import Templates from './Menus/Templates'
import Profiles from './Menus/Profiles'
import { Link } from 'react-router-dom'
import Notifications from './Notifications/Notifications'
import AutoCompleteSearchBoard from './SearchBoards/AutoCompleteSearchBoard'
import SidebarCreateBoardModal from '~/pages/Boards/create'
function AppBar() {
  return (
    <Box
      sx={{
        width: '100%',
        height: theme => theme.trelloCustom.appBarHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 2,
        gap: 2,
        overflowX: 'auto',
        bgcolor: theme =>
          theme.palette.mode === 'dark' ? '#2c3e50' : '#493D9E',
        '&::-webkit-scrollbar-track': { margin: 2 }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Link to={'/boards'}>
          <Tooltip title="Board List">
            <AppsIcon
              sx={{ color: 'white', verticalAlign: 'middle' }}
            ></AppsIcon>
          </Tooltip>
        </Link>
        <Link to={'/'}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <SvgIcon
              component={LogoIcon}
              inheritViewBox
              fontSize="small"
              sx={{ color: 'white' }}
            />
            <Typography
              variant="span"
              sx={{
                fontSize: '1.2rem',
                fontWeight: 'bold',
                color: 'white'
              }}
            >
              Kb Workspace
            </Typography>
          </Box>
        </Link>

        {/* <Box
          sx={{
            display: {
              xs: 'none',
              md: 'flex'
            },
            gap: 1
          }}
        >
          <Workspaces />
          <Recent />
          <Starred />
          <Templates />
        </Box> */}
        {/* Create Board Button */}
        <SidebarCreateBoardModal appBarButton={true} />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <AutoCompleteSearchBoard />
        {/* dark light mode */}
        <ModeSelect />
        {/* xu li thong bao */}
        <Notifications />
        {/* <Tooltip title="Help">
          <Badge color="secondary" sx={{ cursor: 'pointer' }}>
            <HelpOutlineIcon sx={{ color: 'white' }} />
          </Badge>
        </Tooltip> */}
        <Tooltip title="Messages">
          <Badge color="secondary" sx={{ cursor: 'pointer' }}>
            <ChatBubbleOutlineOutlinedIcon sx={{ color: 'white' }} />
          </Badge>
        </Tooltip>
        <Profiles />
      </Box>
    </Box>
  )
}

export default AppBar
