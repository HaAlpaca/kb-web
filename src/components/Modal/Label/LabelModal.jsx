import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined'
import { Tooltip } from '@mui/material'
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import Popover from '@mui/material/Popover'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { cloneDeep } from 'lodash'
import { useConfirm } from 'material-ui-confirm'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import {
  handleChangeLabelAPI,
  handleCreateLabelAPI,
  handleDeleteLabelAPI,
  handleUpdateCardLabelAPI
} from '~/apis'
import {
  fetchBoardDetailsAPI,
  selectCurrentActiveBoard
} from '~/redux/activeBoard/activeBoardSlice'
import { fetchCardDetailsAPI } from '~/redux/activeCard/activeCardSlice'
import { socketIoInstance } from '~/socket-client'
import { getTextColor } from '~/utils/formatters'
import LabelAddNewModal from './LabelAddNewModal'
import LabelEditModal from './LabelEditModal'

function LabelModal({ BOARD_BAR_MENU_STYLE, cardModal = null, SidebarItem }) {
  // board query
  const board = useSelector(selectCurrentActiveBoard)
  const boardLabels = board?.labels || []
  const boardId = board?._id
  const dispatch = useDispatch()
  // const activeCardModal = useSelector(selectCurrentActiveCard)
  const confirmDeleteLabel = useConfirm()

  // react-hook-form
  const { control, setValue, watch } = useForm({
    defaultValues: {
      selectedLabels: cardModal ? cardModal.labels.map(label => label._id) : []
    }
  })

  // popover
  const [anchorPopoverElement, setAnchorPopoverElement] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const isOpenPopover = Boolean(anchorPopoverElement)
  const popoverId = isOpenPopover ? 'invite-board-user-popover' : undefined

  const handleTogglePopover = event => {
    setAnchorPopoverElement(prev => (prev ? null : event.currentTarget))
  }

  // Lọc labels theo title hoặc color
  const filteredLabels = boardLabels.filter(label => {
    const query = searchQuery.toLowerCase().trim()
    return (
      label.title.toLowerCase().includes(query) ||
      label.colour.toLowerCase().includes(query)
    )
  })

  const handleCreateLabel = async (labelTitle, hex, boardId) => {
    await handleCreateLabelAPI({
      title: labelTitle,
      colour: hex,
      boardId
    }).then(res => {
      dispatch(fetchBoardDetailsAPI(boardId))
      socketIoInstance.emit('FE_CREATE_LABEL', {
        ...res,
        cardId: cardModal._id,
        boardId: cardModal.boardId
      })
    })
  }

  // Xử lý khi checkbox thay đổi
  const handleCheckboxChange = (labelId, checked) => {
    if (!cardModal) return

    const currentLabels = watch('selectedLabels') || []

    let updatedLabels = cloneDeep(currentLabels)
    if (checked) {
      // Nếu checkbox được check, thêm label vào cuối danh sách
      updatedLabels.push(labelId)
    } else {
      // Nếu checkbox bị bỏ check, loại bỏ label khỏi danh sách
      updatedLabels = currentLabels.filter(id => id !== labelId)
    }

    setValue('selectedLabels', updatedLabels)

    handleUpdateCardLabelAPI(cardModal._id, {
      updateLabels: updatedLabels
    }).then(res => {
      dispatch(fetchBoardDetailsAPI(boardId))
      if (cardModal) {
        dispatch(fetchCardDetailsAPI(cardModal._id))
      }
      socketIoInstance.emit('FE_UPDATE_LABEL', {
        ...res,
        cardId: cardModal._id,
        boardId: cardModal.boardId
      })
    })
  }

  const handleDeleteLabel = async labelId => {
    await confirmDeleteLabel({
      title: 'Delete Label',
      description: 'Are you sure?',
      confirmationText: 'Confirm',
      cancellationText: 'Cancel'
    }).then(
      async () =>
        await handleDeleteLabelAPI(labelId)
          .then(() => {
            dispatch(fetchBoardDetailsAPI(boardId))

            if (cardModal) {
              dispatch(fetchCardDetailsAPI(cardModal._id))
            }
          })
          .finally(res => {
            socketIoInstance.emit('FE_CREATE_LABEL', {
              ...res,
              cardId: cardModal._id,
              boardId: cardModal.boardId
            })
          })
    )
  }

  const handleChangeLabel = async (labelTitle, labelId, hex) => {
    await handleChangeLabelAPI(labelId, {
      title: labelTitle,
      colour: hex
    })
      .then(() => {
        dispatch(fetchBoardDetailsAPI(boardId))
        if (cardModal) {
          dispatch(fetchCardDetailsAPI(cardModal._id))
        }
      })
      .finally(res => {
        socketIoInstance.emit('FE_UPDATE_LABEL', {
          ...res,
          cardId: cardModal._id,
          boardId: cardModal.boardId
        })
      })
  }

  return (
    <>
      {!cardModal ? (
        <Chip
          sx={BOARD_BAR_MENU_STYLE}
          icon={<LocalOfferOutlinedIcon />}
          label="Labels"
          aria-describedby={popoverId}
          onClick={handleTogglePopover}
        />
      ) : (
        <SidebarItem aria-describedby={popoverId} onClick={handleTogglePopover}>
          <LocalOfferOutlinedIcon fontSize="small" />
          Labels
        </SidebarItem>
      )}

      <Popover
        id={popoverId}
        open={isOpenPopover}
        anchorEl={anchorPopoverElement}
        onClose={handleTogglePopover}
        anchorOrigin={{
          vertical: cardModal ? 'top' : 'bottom',
          horizontal: cardModal ? 'left' : 'right'
        }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ height: '600px' }}
      >
        <Box
          sx={{
            width: '350px',
            px: 1,
            py: 1.5,
            display: 'flex',
            flexDirection: 'column',
            gap: 1
          }}
        >
          <Typography sx={{ fontWeight: 'bold', fontSize: '24px' }}>
            {cardModal ? 'Card Labels' : 'Board Labels'}
          </Typography>

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
            <LabelAddNewModal
              boardId={boardId}
              handleCreateLabel={handleCreateLabel}
            />
          </Box>

          {!cardModal ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {filteredLabels.map(label => (
                <Box key={label._id} sx={{ display: 'flex', gap: 1 }}>
                  <Box
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
                    handleChangeLabel={handleChangeLabel}
                    handleDeleteLabel={handleDeleteLabel}
                  />
                </Box>
              ))}
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {filteredLabels.map(label => (
                <Box key={label._id} sx={{ display: 'flex', gap: 1 }}>
                  <Controller
                    name="selectedLabels"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        checked={field.value.includes(label._id)}
                        onChange={e =>
                          handleCheckboxChange(label._id, e.target.checked)
                        }
                        sx={{ height: '35px', width: '35px' }}
                      />
                    )}
                  />

                  <Box
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
                    handleChangeLabel={handleChangeLabel}
                    handleDeleteLabel={handleDeleteLabel}
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
