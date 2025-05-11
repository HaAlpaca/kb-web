import { useEffect, useState } from 'react'
import { Box, Chip, Drawer, Typography, Tooltip, Divider } from '@mui/material'
import CancelIcon from '@mui/icons-material/Cancel'
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined'
import { handleGetBoardAnalystics } from '~/apis'
import { useSelector } from 'react-redux'
import { selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { BarChart } from '@mui/x-charts/BarChart'

function BoardAnalystic({ board, MENU_STYLE }) {
  const boardRedux = useSelector(selectCurrentActiveBoard)
  const [open, setOpen] = useState(false)
  const [barData, setBarData] = useState([]) // Dữ liệu cho Stacked Bar Chart
  const [inCompleteData, setinCompleteData] = useState([]) // Dữ liệu cho Stacked Bar Chart
  const [completeData, setCompleteData] = useState([]) // Dữ liệu cho Stacked Bar Chart
  // Gọi API khi Drawer mở
  useEffect(() => {
    if (open && boardRedux?._id) {
      handleGetBoardAnalystics(boardRedux._id).then(res => {
        // Tạo dữ liệu cho Stacked Bar Chart
        const chartData = res.map(member => member.displayName)
        setBarData(chartData)
        setCompleteData(res.map(member => member.totalCompletedCards))
        setinCompleteData(res.map(member => member.totalIncompleteCards))
      })
    }
  }, [open, boardRedux?._id])

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

  const DrawerList = (
    <Box sx={{ width: '70vw', padding: 2, paddingTop: 1 }} role="presentation">
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Typography sx={{ whiteSpace: 'nowrap', fontWeight: '500' }}>
            Task Analytics
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <BarChart
            height={300}
            series={[
              {
                data: completeData,
                label: 'Completed Cards', // Sửa label thành "Completed Cards"
                id: 'completedId',
                stack: 'total'
              },
              {
                data: inCompleteData,
                label: 'Incomplete Cards', // Sửa label thành "Incomplete Cards"
                id: 'incompleteId',
                stack: 'total'
              }
            ]}
            xAxis={[{ data: barData, label: 'Members' }]} // Sửa label trục X thành "Members"
            yAxis={[{ width: 50, label: 'Number of Cards' }]} // Sửa label trục Y thành "Number of Cards"
          />
        </Box>
      </Box>

      <Divider />
    </Box>
  )

  return (
    <Box>
      <Tooltip title={board?.description}>
        <Chip
          sx={MENU_STYLE}
          icon={<AnalyticsOutlinedIcon />}
          label="Analytics"
          onClick={toggleDrawer(true)}
        />
      </Tooltip>

      <Drawer
        open={open}
        onClose={toggleDrawer(false)}
        sx={{ position: 'relative' }}
      >
        <Box
          sx={{
            padding: 2,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: 0
          }}
        >
          <Typography sx={{ fontWeight: 'bold' }}>Analytics</Typography>
        </Box>
        <Box
          sx={{
            position: 'absolute',
            top: '12px',
            right: '10px',
            cursor: 'pointer'
          }}
        >
          <CancelIcon
            color="error"
            sx={{ '&:hover': { color: 'error.light' } }}
            onClick={toggleDrawer(false)}
          />
        </Box>
        {DrawerList}
      </Drawer>
    </Box>
  )
}

export default BoardAnalystic
