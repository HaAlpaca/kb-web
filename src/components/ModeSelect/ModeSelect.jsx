import { useColorScheme } from '@mui/material/styles'

import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness'
import Box from '@mui/material/Box'

function ModeSelect() {
  const { mode, setMode } = useColorScheme()
  const handleChange = event => {
    const selectedMode = event.target.value
    setMode(selectedMode)
  }

  return (
    <>
      <FormControl
        size="small"
        sx={{
          minWidth: 120,
          '@media (max-width: 992px)': {
            minWidth: 100 // Giảm chiều rộng trên màn hình nhỏ hơn 992px
          }
        }}
      >
        <InputLabel
          id="label-select-dark-light-mode"
          sx={{
            color: 'white',
            '&.Mui-focused': {
              color: 'white'
            },
            '@media (max-width: 992px)': {
              fontSize: '0.875rem' // Giảm kích thước font chữ trên màn hình nhỏ hơn 992px
            }
          }}
        >
          Mode
        </InputLabel>
        <Select
          labelId="label-select-dark-light-mode"
          id="demo-select-small"
          value={mode}
          label="Mode"
          sx={{
            color: 'white',
            '.MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
            '&:hover': {
              '.MuiOutlinedInput-notchedOutline': { borderColor: 'white' }
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white'
            },
            '.MuiSvgIcon-root': { color: 'white' },
            '@media (max-width: 992px)': {
              fontSize: '0.875rem' // Giảm kích thước font chữ trên màn hình nhỏ hơn 992px
            }
          }}
          onChange={handleChange}
        >
          <MenuItem value={'light'}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LightModeIcon fontSize="small" /> Light
            </Box>
          </MenuItem>
          <MenuItem value={'dark'}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DarkModeOutlinedIcon fontSize="small" /> Dark
            </Box>
          </MenuItem>

          <MenuItem value={'system'}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SettingsBrightnessIcon fontSize="small" /> System
            </Box>
          </MenuItem>
        </Select>
      </FormControl>
    </>
  )
}

export default ModeSelect
