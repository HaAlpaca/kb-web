import { Box, Grid } from '@mui/material'
// const labels = [
//   { id: 1, color: '#C2F0D0', title: 'Label 1' },
//   { id: 2, color: '#4BC99F', title: 'Label 2' },
//   { id: 3, color: '#10754C', title: 'Label 3' },
//   { id: 4, color: '#FBE9A0', title: 'Label 4' },
//   { id: 5, color: '#FFD74B', title: 'Label 5' },
//   { id: 6, color: '#8C6B00', title: 'Label 6' },
//   { id: 7, color: '#FFE2CF', title: 'Label 7' },
//   { id: 8, color: '#FFA160', title: 'Label 8' },
//   { id: 9, color: '#F66A66', title: 'Label 9' },
//   { id: 10, color: '#A085E6', title: 'Label 10' },
//   { id: 11, color: '#A18AFF', title: 'Label 11' },
//   { id: 12, color: '#4E97FF', title: 'Label 12' },
//   { id: 13, color: '#7ECDE6', title: 'Label 13' },
//   { id: 14, color: '#94C950', title: 'Label 14' },
//   { id: 15, color: '#E678B6', title: 'Label 15' }
// ]

const LabelGroup = ({ labels }) => {
  return (
    <Box sx={{ p: 0.5, mx: 1, my: 0.5 }}>
      <Grid container spacing={0.5}>
        {labels.map((label, index) => (
          <Grid item xs={2.4} key={index}>
            {' '}
            {/* 5 màu mỗi hàng */}
            <Box
              sx={{
                width: 40,
                height: 8,
                backgroundColor: label.color,
                borderRadius: 4
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default LabelGroup
