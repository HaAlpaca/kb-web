import Box from '@mui/material/Box'
import { Card as MuiCard } from '@mui/material'
import Zoom from '@mui/material/Zoom'
import { Typography } from '@mui/material'
import SvgIcon from '@mui/material/SvgIcon'
import { ReactComponent as LogoIcon } from '~/assets/logo.svg'

function LowResolutionWarning() {
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

            {/* Warning Message */}
            <Typography
              variant="subtitle1"
              sx={{
                color: 'text.secondary',
                fontStyle: 'italic',
                textAlign: 'center'
              }}
            >
              Your screen resolution is too small. Please use a device with a
              resolution of at least 700x400.
            </Typography>
          </Box>
        </MuiCard>
      </Zoom>
    </Box>
  )
}

export default LowResolutionWarning
