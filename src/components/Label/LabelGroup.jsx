import { Box, Grid, Tooltip, Typography } from '@mui/material'

const getTextColor = hexColor => {
  // https://gist.github.com/jfsiii/5641126
  // Chuyển từ HEX sang RGB
  let r = parseInt(hexColor.slice(1, 3), 16) / 255
  let g = parseInt(hexColor.slice(3, 5), 16) / 255
  let b = parseInt(hexColor.slice(5, 7), 16) / 255

  // Chuyển đổi giá trị RGB theo chuẩn gamma correction
  r = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4)
  g = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4)
  b = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4)

  // Tính độ sáng theo công thức W3C
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b

  // Nếu màu quá sáng, đổi chữ sang đen, ngược lại là trắng
  return luminance > 0.5 ? 'black' : 'white'
}

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
