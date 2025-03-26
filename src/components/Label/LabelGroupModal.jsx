import { Box, Tooltip, Typography } from '@mui/material'
import { getTextColor } from '~/utils/formatters'

const LabelGroupModal = ({ labels }) => {
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
                height: 20, // Tăng chiều cao để chứa chữ
                backgroundColor: label.colour,
                borderRadius: 1,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                paddingX: '20px',
                paddingY: '16px'
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  color: getTextColor(label.colour),
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '150px',
                  display: 'block'
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

export default LabelGroupModal

// const LabelGroupModal1 = ({ labels }) => {
//   return (
//     <Grid container spacing={0.5}>
//       {labels.map(label => (
//         <Grid item xs={2.4} key={label._id}>
//           <Tooltip title={label.title}>
//             <Box
//               sx={{
//                 height: 32,
//                 backgroundColor: label.colour,
//                 borderRadius: '3px',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'flex-start',
//                 paddingLeft: '8px',
//                 cursor: 'pointer'
//               }}
//             >
//               <Typography
//                 variant="subtitle2"
//                 sx={{
//                   color: getTextColor(label.colour),
//                   whiteSpace: 'nowrap',
//                   overflow: 'hidden',
//                   textOverflow: 'ellipsis',
//                   maxWidth: '100px',
//                   display: 'block'
//                 }}
//               >
//                 {label.title}
//               </Typography>
//             </Box>
//           </Tooltip>
//         </Grid>
//       ))}
//     </Grid>
//   )
// }
