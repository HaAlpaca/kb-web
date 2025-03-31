import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Popover from '@mui/material/Popover'
import TextField from '@mui/material/TextField'
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined'
import Chip from '@mui/material/Chip'
import LabelOutlinedIcon from '@mui/icons-material/LabelOutlined'
import { getTextColor } from '~/utils/formatters'
import { Tooltip } from '@mui/material'
import LabelEditModal from './LabelEditModal'
import Checkbox from '@mui/material/Checkbox'
import LabelAddNewModal from './LabelAddNewModal'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectCurrentActiveBoard,
  updateCurrentActiveBoard
} from '~/redux/activeBoard/activeBoardSlice'
import {
  handleChangeLabelAPI,
  handleCreateLabelAPI,
  handleDeleteLabelAPI,
  handleUpdateCardLabelAPI
} from '~/apis'
import { cloneDeep } from 'lodash'
import {
  selectCurrentActiveCard,
  updateCurrentActiveCard
} from '~/redux/activeCard/activeCardSlice'
import { useConfirm } from 'material-ui-confirm'

function LabelModal({ BOARD_BAR_MENU_STYLE, cardModal = null, SidebarItem }) {
  // board query
  const board = useSelector(selectCurrentActiveBoard)
  const boardLabels = board?.labels || []
  const boardId = board?._id
  const dispatch = useDispatch()
  const activeCardModal = useSelector(selectCurrentActiveCard)
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
      const newBoard = cloneDeep(board)
      newBoard.labels.push({
        _id: res._id,
        title: res.title,
        colour: res.colour
      })
      dispatch(updateCurrentActiveBoard(newBoard))
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
    }).then(() => {
      const newBoard = cloneDeep(board)
      const labelToUpdate = newBoard.labels
        .filter(label => updatedLabels.includes(label._id))
        .sort(
          (a, b) => updatedLabels.indexOf(a._id) - updatedLabels.indexOf(b._id)
        )

      // Cập nhật danh sách label trong modal card
      newBoard.columns.forEach(column => {
        column.cards.forEach(card => {
          if (Array.isArray(card.labels) && card._id === cardModal._id) {
            card.labels = labelToUpdate
            card.cardLabelIds = updatedLabels
          }
        })
      })

      dispatch(updateCurrentActiveBoard(newBoard))

      const newActiveCardModal = cloneDeep(activeCardModal)
      newActiveCardModal.labels = labelToUpdate
      dispatch(updateCurrentActiveCard(newActiveCardModal))
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
        await handleDeleteLabelAPI(labelId).then(() => {
          // update board label
          const newBoard = cloneDeep(board)
          newBoard.labels = newBoard.labels.filter(
            label => label._id !== labelId
          )
          newBoard.columns.forEach(column => {
            column.cards.forEach(card => {
              card.labels = card.labels.filter(label => label._id !== labelId)
              card.cardLabelIds = card.cardLabelIds.filter(id => id !== labelId)
            })
          })
          dispatch(updateCurrentActiveBoard(newBoard))

          // update card modal label
          if (cardModal) {
            const newActiveCardModal = cloneDeep(activeCardModal)
            newActiveCardModal.labels = newActiveCardModal.labels.filter(
              label => label._id !== labelId
            )
            dispatch(updateCurrentActiveCard(newActiveCardModal))
          }
        })
    )
  }

  const handleChangeLabel = async (labelTitle, labelId, hex) => {
    await handleChangeLabelAPI(labelId, {
      title: labelTitle,
      colour: hex
    }).then(() => {
      const newBoard = cloneDeep(board)
      const labelToUpdate = newBoard.labels.find(label => label._id === labelId)
      if (labelToUpdate) {
        labelToUpdate.title = labelTitle
        labelToUpdate.colour = hex
        newBoard.columns.forEach(column => {
          column.cards.forEach(card => {
            if (Array.isArray(card.labels)) {
              card.labels.forEach(label => {
                if (label._id === labelId) {
                  label.title = labelTitle
                  label.colour = hex
                }
              })
            }
          })
        })
        dispatch(updateCurrentActiveBoard(newBoard))
      }
    })
  }

  return (
    <>
      {!cardModal ? (
        <Chip
          sx={BOARD_BAR_MENU_STYLE}
          icon={<LabelOutlinedIcon />}
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
