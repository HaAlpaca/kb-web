import { Box, Tooltip, Typography } from '@mui/material'
import { getTextColor } from '~/utils/formatters'

const LabelGroup = ({ labels }) => {
  return (
    <Box sx={{ p: 0.5, mx: 1, my: 0.5 }}>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 0.5, // Khoảng cách giữa các label
          alignItems: 'center'
        }}
      >
        {labels.map(label => (
          <Tooltip key={label._id} title={label.title}>
            <Box
              sx={{
                minWidth: 40,
                height: 20,
                backgroundColor: label.colour,
                borderRadius: 1,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                paddingX: 1,
                paddingY: '12px'
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '150px',
                  color: getTextColor(label.colour)
                }}
              >
                {label.title}
              </Typography>
            </Box>
          </Tooltip>
        ))}
      </Box>
    </Box>
  )
}

export default LabelGroup
