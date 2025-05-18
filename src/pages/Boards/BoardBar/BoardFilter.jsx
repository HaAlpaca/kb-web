import { useState } from 'react'
import {
  Box,
  Tooltip,
  Chip,
  Drawer,
  Typography,
  Divider,
  TextField,
  Button,
  MenuItem,
  Select,
  Paper,
  Stack
} from '@mui/material'
import CancelIcon from '@mui/icons-material/Cancel'
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined'
import { useSelector, useDispatch } from 'react-redux'
import {
  selectCurrentActiveBoard,
  fetchFilteredBoardDetailsAPI
} from '~/redux/activeBoard/activeBoardSlice'
import { useForm, Controller } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import useFetchBoardFn from '~/CustomHooks/useFetchBoardFn'

function BoardFilter({ MENU_STYLE }) {
  const boardRedux = useSelector(selectCurrentActiveBoard)
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const fetchBoardDetails = useFetchBoardFn()
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      members: [],
      startDate: null, // Sử dụng null cho DatePicker
      endDate: null,
      isComplete: ''
    }
  })

  const toggleDrawer = newOpen => event => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return
    }
    setOpen(newOpen)
  }

  const onSubmit = data => {
    const queryParams = {
      ...(data.members.length > 0 && { members: data.members.join(',') }),
      ...(data.startDate && {
        startDate: new Date(data.startDate).toISOString()
      }),
      ...(data.endDate && { endDate: new Date(data.endDate).toISOString() }),
      ...(data.isComplete !== '' && { isComplete: data.isComplete })
    }

    setSearchParams(queryParams)
    fetchBoardDetails()
    setOpen(false)
  }

  const DrawerList = (
    <Box sx={{ width: 400, padding: 2, paddingTop: 1 }} role="presentation">
      {/* Filter by Members */}

      <Typography
        sx={{ whiteSpace: 'nowrap', fontWeight: 500, marginBottom: 1 }}
      >
        Members
      </Typography>
      <Controller
        name="members"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            multiple
            fullWidth
            size="small"
            displayEmpty
            sx={{ mb: 2 }}
          >
            {boardRedux?.allMembers?.map(member => (
              <MenuItem key={member._id} value={member._id}>
                {member.displayName}
              </MenuItem>
            ))}
          </Select>
        )}
      />
      {/* Filter by Start Date */}
      <Typography
        sx={{ whiteSpace: 'nowrap', fontWeight: 500, marginBottom: 0.5 }}
      >
        Due Date (From)
      </Typography>
      <Controller
        name="startDate"
        control={control}
        render={({ field }) => (
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
              {...field}
              label="Start Date"
              renderInput={params => (
                <TextField {...params} fullWidth size="small" sx={{ mb: 2 }} />
              )}
            />
          </LocalizationProvider>
        )}
      />
      {/* Filter by End Date */}
      <Typography
        sx={{ whiteSpace: 'nowrap', fontWeight: 500, marginBottom: 0.5 }}
      >
        Due Date (To)
      </Typography>
      <Controller
        name="endDate"
        control={control}
        render={({ field }) => (
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
              {...field}
              label="End Date"
              renderInput={params => (
                <TextField {...params} fullWidth size="small" sx={{ mb: 2 }} />
              )}
            />
          </LocalizationProvider>
        )}
      />
      {/* Filter by Completion Status */}
      <Typography
        sx={{ whiteSpace: 'nowrap', fontWeight: 500, marginBottom: 0.5 }}
      >
        Card Completion Status
      </Typography>
      <Controller
        name="isComplete"
        control={control}
        render={({ field }) => (
          <Select {...field} fullWidth size="small" displayEmpty sx={{ mb: 2 }}>
            <MenuItem value="">Both</MenuItem>
            <MenuItem value="true">Completed</MenuItem>
            <MenuItem value="false">Not Completed</MenuItem>
          </Select>
        )}
      />

      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit(onSubmit)}
        >
          Apply Filters
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          onClick={() => {
            reset()
            setSearchParams({})
            dispatch(
              fetchFilteredBoardDetailsAPI({
                boardId: boardRedux._id,
                queryParams: {}
              })
            )
            setOpen(false)
          }}
        >
          Clear Filters
        </Button>
      </Stack>
    </Box>
  )

  return (
    <Box>
      <Tooltip title="Filter Cards">
        <Chip
          sx={MENU_STYLE}
          icon={<TuneOutlinedIcon />}
          label="Filters"
          onClick={toggleDrawer(true)}
        />
      </Tooltip>

      <Drawer open={open} onClose={toggleDrawer(false)}>
        <Box
          sx={{
            padding: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Filters
          </Typography>
          <CancelIcon
            color="error"
            sx={{ cursor: 'pointer' }}
            onClick={toggleDrawer(false)}
          />
        </Box>
        {DrawerList}
      </Drawer>
    </Box>
  )
}

export default BoardFilter
