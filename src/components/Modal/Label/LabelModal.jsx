import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Popover from '@mui/material/Popover'
import TextField from '@mui/material/TextField'

import Chip from '@mui/material/Chip'
import LabelOutlinedIcon from '@mui/icons-material/LabelOutlined'
import { getTextColor } from '~/utils/formatters'
import { Tooltip } from '@mui/material'
import LabelEditModal from './LabelEditModal'
import Checkbox from '@mui/material/Checkbox'
import LabelAddNewModal from './LabelAddNewModal'
function LabelModal({ MENU_STYLE, labels, card = null, boardId }) {
  // popover
  const [anchorPopoverElement, setAnchorPopoverElement] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const isOpenPopover = Boolean(anchorPopoverElement)
  const popoverId = isOpenPopover ? 'invite-board-user-popover' : undefined

  const handleTogglePopover = event => {
    setAnchorPopoverElement(prev => (prev ? null : event.currentTarget))
  }

  // Hàm lọc labels theo title hoặc color
  const filteredLabels = labels.filter(label => {
    const query = searchQuery.toLowerCase().trim()
    return (
      label.title.toLowerCase().includes(query) ||
      label.colour.toLowerCase().includes(query)
    )
  })

  return (
    <>
      <Chip
        sx={MENU_STYLE}
        icon={<LabelOutlinedIcon />}
        label="Labels"
        aria-describedby={popoverId}
        onClick={handleTogglePopover}
      />

      <Popover
        id={popoverId}
        open={isOpenPopover}
        anchorEl={anchorPopoverElement}
        onClose={handleTogglePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{
          height: '600px'
        }}
      >
        <Box
          sx={{
            width: '400px',
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}
        >
          <Typography sx={{ fontWeight: 'bold', fontSize: '24px' }}>
            {card ? 'Card Labels' : 'Board Labels'}
          </Typography>

          {/* Trường nhập tìm kiếm */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TextField
              autoFocus
              fullWidth
              label="Search Labels by title or color..."
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />

            <LabelAddNewModal boardId={boardId} />
          </Box>

          {/* Danh sách Labels đã lọc */}
          {!card ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {filteredLabels.map(label => (
                <Box key={label._id} sx={{ display: 'flex', gap: 1 }}>
                  <Box
                    key={label._id}
                    sx={{
                      height: '35px',
                      width: '100%',
                      backgroundColor: label.colour,
                      borderRadius: '3px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingLeft: '8px'
                    }}
                  >
                    <Tooltip
                      title={`${label.title} - ${label.colour}`}
                      placement="right-start"
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: getTextColor(label.colour),
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: '200px',
                          display: 'block'
                        }}
                      >
                        {label.title}
                      </Typography>
                    </Tooltip>
                  </Box>

                  <LabelEditModal
                    labelId={label._id}
                    title={label.title}
                    colour={label.colour}
                  />
                </Box>
              ))}
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {filteredLabels.map(label => (
                <Box key={label._id} sx={{ display: 'flex', gap: 1 }}>
                  <Checkbox {...label} sx={{ height: '35px', width: '35px' }} />
                  <Box
                    key={label._id}
                    sx={{
                      height: '35px',
                      width: '100%',
                      backgroundColor: label.colour,
                      borderRadius: '3px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingLeft: '8px'
                    }}
                  >
                    <Tooltip
                      title={`${label.title} - ${label.colour}`}
                      placement="right-start"
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: getTextColor(label.colour),
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: '200px',
                          display: 'block'
                        }}
                      >
                        {label.title}
                      </Typography>
                    </Tooltip>
                  </Box>

                  <LabelEditModal
                    labelId={label._id}
                    title={label.title}
                    colour={label.colour}
                  />
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Popover>
    </>
  )
}

export default LabelModal
