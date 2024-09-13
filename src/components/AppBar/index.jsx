import Box from '@mui/material/Box'
import ModeSelect from '~/components/ModeSelect'
import AppsIcon from '@mui/icons-material/Apps'
import SvgIcon from '@mui/material/SvgIcon'
import { ReactComponent as trelloIcon } from '~/assets/trello.svg'
import { Typography } from '@mui/material'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'

import Badge from '@mui/material/Badge'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import Tooltip from '@mui/material/Tooltip'

import Workspaces from './Menus/Workspaces'
import Recent from './Menus/Recent'
import Starred from './Menus/Starred'
import Templates from './Menus/Templates'
import Profiles from './Menus/Profiles'

function AppBar() {
  return (
    <Box
      px={2}
      sx={{
        width: '100%',
        height: theme => theme.trelloCustom.appBarHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <AppsIcon sx={{ color: 'primary.main' }}></AppsIcon>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <SvgIcon
            component={trelloIcon}
            inheritViewBox
            fontSize="small"
            sx={{ color: 'primary.main' }}
          />
          <Typography
            variant="span"
            sx={{
              fontSize: '1.2rem',
              fontWeight: 'bold',
              color: 'primary.main'
            }}
          >
            Trello
          </Typography>
        </Box>
        <Workspaces />
        <Recent />
        <Starred />
        <Templates />

        <Button variant="outlined">Create</Button>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField
          required
          id="outlined-search"
          label="Search..."
          type="search"
          size="small"
        />

        <ModeSelect />
        <Tooltip title="Notification">
          <Badge color="secondary" variant="dot" sx={{ cursor: 'pointer' }}>
            <NotificationsNoneIcon sx={{ color: 'primary.main' }} />
          </Badge>
        </Tooltip>
        <Tooltip title="Help">
          <Badge color="secondary" sx={{ cursor: 'pointer' }}>
            <HelpOutlineIcon sx={{ color: 'primary.main' }} />
          </Badge>
        </Tooltip>
        <Profiles />
      </Box>
    </Box>
  )
}

export default AppBar
