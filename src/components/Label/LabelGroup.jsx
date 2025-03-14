import { Box, Grid, Tooltip, Typography } from '@mui/material'
import { getTextColor } from '~/utils/formatters'
import LabelModal from '../Modal/Label/LabelModal'

const LabelGroup = ({ labels, cardModal = false }) => {
  if (!cardModal) {
    return (
      <Box sx={{ p: 0.5, mx: 1, my: 0.5 }}>
        <Grid container spacing={0.5}>
          {labels.map((label, index) => (
            <Grid item xs={2.4} key={index}>
              {' '}
              {/* 5 màu mỗi hàng */}
              <Tooltip title={`${label.title}`}>
                <Box
                  sx={{
                    width: 40,
                    height: 8,
                    backgroundColor: label.colour,
                    borderRadius: 4
                  }}
                  key={label._id}
                />
              </Tooltip>
            </Grid>
          ))}
        </Grid>
      </Box>
    )
  }
  return (
    <>
      <Grid container spacing={0.5}>
        {labels.map((label, index) => (
          <Grid item xs={2.4} key={index}>
            {' '}
            {/* 5 màu mỗi hàng */}
            <Tooltip title={`${label.title}`}>
              <Box
                sx={{
                  height: 32,
                  backgroundColor: label.colour,
                  borderRadius: '3px',
                  display: 'flex', // Sử dụng flexbox để căn chỉnh nội dung
                  alignItems: 'center', // Căn giữa theo chiều dọc
                  justifyContent: 'flex-start', // Dịch trái nội dung
                  paddingLeft: '8px' // Dịch nội dung sang trái một chút
                }}
                key={label._id}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: getTextColor(label.colour),
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '100px',
                    display: 'block'
                  }}
                >
                  {label.title}
                </Typography>
              </Box>
            </Tooltip>
          </Grid>
        ))}
      </Grid>
    </>
  )
}

export default LabelGroup
