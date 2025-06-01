import Box from '@mui/material/Box'
import ModeSelect from '~/components/ModeSelect/ModeSelect'
import AppsIcon from '@mui/icons-material/Apps'
import SvgIcon from '@mui/material/SvgIcon'
import { ReactComponent as LogoIcon } from '~/assets/logo.svg'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
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
        position: 'sticky', // Đặt AppBar dính trên đầu
        top: 0,
        overflowX: 'auto',
        bgcolor: theme =>
          theme.palette.mode === 'dark' ? '#2c3e50' : '#493D9E',
        '&::-webkit-scrollbar-track': { margin: 2 },
        '@media (max-width: 992px)': {
          px: 1, // Giảm padding ngang trên màn hình nhỏ
          gap: 1 // Giảm khoảng cách giữa các thành phần
        }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          '@media (max-width: 992px)': {
            gap: 1 // Giảm khoảng cách giữa các thành phần
          }
        }}
      >
        <Link to={'/boards'}>
          <Tooltip title="Board List">
            <AppsIcon
              sx={{
                color: 'white',
                verticalAlign: 'middle',
                fontSize: '1.5rem', // Giảm kích thước icon
                '@media (max-width: 992px)': {
                  fontSize: '1.2rem' // Kích thước nhỏ hơn trên màn hình nhỏ
                }
              }}
            ></AppsIcon>
          </Tooltip>
        </Link>
        <Link to={'/'}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              '@media (max-width: 992px)': {
                gap: 0.3 // Giảm khoảng cách giữa logo và text
              }
            }}
          >
            <SvgIcon
              component={LogoIcon}
              inheritViewBox
              fontSize="small"
              sx={{
                color: 'white',
                fontSize: '1.5rem',
                '@media (max-width: 992px)': {
                  fontSize: '1.2rem' // Giảm kích thước logo
                }
              }}
            />
            <Typography
              variant="span"
              sx={{
                fontSize: '1.2rem',
                fontWeight: 'bold',
                color: 'white',
                '@media (max-width: 992px)': {
                  fontSize: '1rem' // Giảm kích thước chữ
                }
              }}
            >
              Kb Workspace
            </Typography>
          </Box>
        </Link>

        {/* Create Board Button */}
        <SidebarCreateBoardModal appBarButton={true} />
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          '@media (max-width: 992px)': {
            gap: 1 // Giảm khoảng cách giữa các thành phần
          }
        }}
      >
        <AutoCompleteSearchBoard />
        {/* dark light mode */}
        <ModeSelect />
        {/* xu li thong bao */}
        <Notifications />
        <Profiles />
      </Box>
    </Box>
  )
}

export default AppBar
