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
  const [analytics, setAnalytics] = useState(null)

  // Gọi API khi Drawer mở
  useEffect(() => {
    if (open && boardRedux?._id) {
      handleGetBoardAnalystics(boardRedux._id).then(res => {
        setAnalytics(res)
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

        {/* Tổng số card */}
        <Typography sx={{ mb: 2 }}>
          Total Cards: {analytics?.totalCards || 0}
        </Typography>
        <Typography sx={{ mb: 2 }}>
          Completed Cards: {analytics?.totalCompletedCards || 0}
        </Typography>
        <Typography sx={{ mb: 2 }}>
          Incomplete Cards: {analytics?.totalIncompleteCards || 0}
        </Typography>

        {/* Biểu đồ Stacked Bar Chart */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <BarChart
            height={300}
            series={[
              {
                data:
                  analytics?.memberAnalytics?.map(
                    member => member.totalCompletedCards
                  ) || [],
                label: 'Completed Cards',
                id: 'completedId',
                stack: 'total'
              },
              {
                data:
                  analytics?.memberAnalytics?.map(
                    member => member.totalIncompleteCards
                  ) || [],
                label: 'Incomplete Cards',
                id: 'incompleteId',
                stack: 'total'
              }
            ]}
            xAxis={[
              {
                data:
                  analytics?.memberAnalytics?.map(
                    member => member.displayName
                  ) || [],
                label: 'Members'
              }
            ]}
            yAxis={[{ width: 50, label: 'Number of Cards' }]}
          />
        </Box>

        {/* Thống kê theo thành viên */}
        <Divider sx={{ my: 2 }} />
        <Typography sx={{ fontWeight: '500', mb: 2 }}>
          Member Analytics:
        </Typography>
        {analytics?.memberAnalytics?.map(member => (
          <Box key={member.displayName} sx={{ mb: 2 }}>
            <Typography>
              {member.displayName}: {member.totalCards} cards (
              {member.totalCompletedCards} completed,{' '}
              {member.totalIncompleteCards} incomplete)
            </Typography>
          </Box>
        ))}
      </Box>
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
