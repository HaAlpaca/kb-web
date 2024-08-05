import Button from '@mui/material/Button'
import { AccessAlarm } from '@mui/icons-material'
import Typography from '@mui/material/Typography'
import {
  // Experimental_CssVarsProvider as CssVarsProvider,
  // experimental_extendTheme as extendTheme,
  useColorScheme
} from '@mui/material/styles'

function ModeToggle() {
  const { mode, setMode } = useColorScheme()
  return (
    <Button
      onClick={() => {
        setMode(mode === 'light' ? 'dark' : 'light')
      }}
    >
      {mode === 'light' ? 'Turn dark' : 'Turn light'}
    </Button>
  )
}


function App() {
  return (
    <>
      <ModeToggle />
      <hr />
      <Button variant="contained">Contained</Button>
      <div>HaAlpaca</div>
      <AccessAlarm />
      <Typography variant="body2" color={'text.secondary'} >
        body2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
        blanditiis tenetur unde suscipit, quam beatae rerum inventore consectetur,
        neque doloribus, cupiditate numquam dignissimos laborum fugiat deleniti? Eum
        quasi quidem quibusdam.
      </Typography>
    </>
  )

}

export default App
