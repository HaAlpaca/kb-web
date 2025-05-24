import Box from '@mui/material/Box'

import { Card as MuiCard } from '@mui/material'
import Zoom from '@mui/material/Zoom'
import Button from '@mui/material/Button'
import { Typography } from '@mui/material'
import SvgIcon from '@mui/material/SvgIcon'
import { ReactComponent as LogoIcon } from '~/assets/logo.svg'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
function Home() {
  const currentUser = useSelector(selectCurrentUser)
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'url("/kb-home.jpg")',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        boxShadow: 'inset 0 0 0 2000px rgba(0, 0, 0, 0.2)'
      }}
    >
      <Zoom in={true} style={{ transitionDelay: '200ms' }}>
        <MuiCard
          sx={{
            minWidth: 380,
            maxWidth: 380,
            marginLeft: '14em',
            marginTop: '6em',
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Box>
            {/* Logo */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.5
              }}
            >
              <SvgIcon
                component={LogoIcon}
                inheritViewBox
                fontSize="small"
                sx={{ color: 'primary.main' }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold'
                }}
              >
                KB Workspace
              </Typography>
            </Box>

            {/* Slogan */}
            <Typography
              variant="subtitle1"
              sx={{ color: 'text.secondary', fontStyle: 'italic' }}
            >
              Turn ideas into action!
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              width: '100%',
              gap: 0.5
            }}
          >
            {!currentUser ? (
              <Box sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Link to="/login" style={{ textDecoration: 'none' }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      sx={{ borderRadius: 2, textTransform: 'capitalize' }}
                    >
                      Login
                    </Button>
                  </Link>
                  <Link to="/register" style={{ textDecoration: 'none' }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      sx={{ borderRadius: 2, textTransform: 'capitalize' }}
                    >
                      Register
                    </Button>
                  </Link>
                </Box>
              </Box>
            ) : (
              <Box sx={{ width: '100%' }}>
                <Link to="/boards" style={{ textDecoration: 'none' }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{ borderRadius: 2, textTransform: 'capitalize' }}
                  >
                    Go to Boards
                  </Button>
                </Link>
              </Box>
            )}
          </Box>
        </MuiCard>
      </Zoom>
    </Box>
  )
}

export default Home
