import { useState } from 'react'
import {
  Box,
  Tooltip,
  Chip,
  Drawer,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
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
import { useParams, useSearchParams } from 'react-router-dom'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import useFetchBoardFn from '~/CustomHooks/useFetchBoardFn'

function BoardFilter({ MENU_STYLE }) {
  const boardRedux = useSelector(selectCurrentActiveBoard)
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const { boardId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  // const fetchBoardDetails = useFetchBoardFn()
  // Lấy giá trị mặc định từ searchParams
  const defaultValues = {
    members: searchParams.get('members')?.split(',') || [],
    startDate: searchParams.get('startDate')
      ? new Date(searchParams.get('startDate'))
      : null,
    endDate: searchParams.get('endDate')
      ? new Date(searchParams.get('endDate'))
      : null,
    isComplete: searchParams.get('isComplete') || '',
    label: searchParams.get('label')?.split(',') || [],
    title: searchParams.get('title') || ''
  }

  const { control, handleSubmit, reset } = useForm({
    defaultValues
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
      ...(data.isComplete !== '' && { isComplete: data.isComplete }),
      ...(data.title && { title: data.title }), // Thêm bộ lọc theo title
      ...(data.label.length > 0 && { label: data.label.join(',') }) // Thêm bộ lọc theo label
    }

    setSearchParams(queryParams)
    // fetchBoardDetails()
    dispatch(fetchFilteredBoardDetailsAPI({ boardId, queryParams }))
    setOpen(false)
  }

  const DrawerList = (
    <Box sx={{ width: 400, padding: 2, paddingTop: 1 }} role="presentation">
      <Typography
        sx={{ whiteSpace: 'nowrap', fontWeight: 500, marginBottom: 0.5 }}
      >
        Title
      </Typography>
      <Controller
        name="title"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            size="small"
            placeholder="Search by title"
            sx={{ mb: 2 }}
          />
        )}
      />
      <Typography
        sx={{ whiteSpace: 'nowrap', fontWeight: 500, marginBottom: 1 }}
      >
        Labels
      </Typography>
      <Controller
        name="label"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            multiple
            fullWidth
            size="small"
            displayEmpty
            value={field.value || []} // Đảm bảo giá trị là mảng
            sx={{ mb: 2 }}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 200, // Giới hạn chiều cao của danh sách
                  overflowY: 'auto' // Thêm thanh cuộn dọc nếu danh sách vượt quá chiều cao
                }
              }
            }}
            renderValue={selected => {
              return (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map(value => {
                    const label = boardRedux?.labels?.find(l => l._id === value)
                    return (
                      <Chip
                        key={value}
                        label={label?.title || value}
                        size="small"
                        sx={{
                          backgroundColor: label?.colour || 'default',
                          color: 'white'
                        }}
                      />
                    )
                  })}
                </Box>
              )
            }}
          >
            {boardRedux?.labels?.map(label => (
              <MenuItem key={label._id} value={label._id}>
                <Box
                  sx={{
                    display: 'flex', // Căn chỉnh theo chiều ngang
                    alignItems: 'center', // Căn giữa theo chiều dọc
                    gap: 1 // Khoảng cách giữa màu và tiêu đề
                  }}
                >
                  {/* Vòng tròn màu */}
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      backgroundColor: label.colour, // Màu của nhãn
                      borderRadius: '50%' // Tạo hình tròn
                    }}
                  />
                  <Typography variant="body2">{label.title}</Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
        )}
      />

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
          variant="outlined"
          color="secondary"
          fullWidth
          onClick={() => {
            reset({
              members: [],
              startDate: null,
              endDate: null,
              isComplete: '',
              label: [], // Đặt lại label về mảng rỗng
              title: '' // Đặt lại title về chuỗi rỗng
            })
            setSearchParams({}) // Xóa tất cả các tham số trên URL
            dispatch(
              fetchFilteredBoardDetailsAPI({
                boardId: boardRedux._id,
                queryParams: {} // Gửi yêu cầu với bộ lọc trống
              })
            )
            setOpen(false) // Đóng Drawer
          }}
        >
          Clear Filters
        </Button>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit(onSubmit)}
        >
          Apply Filters
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
