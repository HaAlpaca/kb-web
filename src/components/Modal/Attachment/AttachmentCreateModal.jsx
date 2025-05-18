import { useRef, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Popover from '@mui/material/Popover'
import AttachmentIcon from '@mui/icons-material/Attachment'
import { Button, TextField } from '@mui/material'
import { toast } from 'react-toastify'
import { handleCreateAttachmentAPI } from '~/apis'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchBoardDetailsAPI,
  selectCurrentActiveBoard,
  updateCurrentActiveBoard
} from '~/redux/activeBoard/activeBoardSlice'
import {
  fetchCardDetailsAPI,
  selectCurrentActiveCard,
  updateCurrentActiveCard
} from '~/redux/activeCard/activeCardSlice'
import { cloneDeep } from 'lodash'
import { useParams } from 'react-router-dom'
import { socketIoInstance } from '~/socket-client'
function AttachmentCreateModal({ cardModal, SidebarItem }) {
  // board query
  const board = useSelector(selectCurrentActiveBoard)
  const { boardId } = useParams()
  const dispatch = useDispatch()
  const activeCardModal = useSelector(selectCurrentActiveCard)

  // popover
  const fileInput = useRef()
  const [anchorPopoverElement, setAnchorPopoverElement] = useState(null)
  const isOpenPopover = Boolean(anchorPopoverElement)
  const popoverId = isOpenPopover ? 'invite-board-user-popover' : undefined

  const handleTogglePopover = event => {
    setAnchorPopoverElement(prev => (prev ? null : event.currentTarget))
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm()

  const onSubmitLinkAttachment = data => {
    const reqData = {
      link: data.link,
      name: data.displayName,
      cardId: cardModal?._id
    }
    handleCreateAttachmentAPI(reqData)
      .then(res => {
        // const updatedAttachment = {
        //   _id: res._id,
        //   name: res.name,
        //   link: res.link,
        //   size: res.size,
        //   type: res.type
        // }
        // const newBoard = cloneDeep(board)
        // // update board attachment
        // newBoard.columns.forEach(column => {
        //   column.cards.forEach(card => {
        //     if (cardModal?._id === card._id) {
        //       card.cardAttachmentIds.push(res._id)
        //     }
        //   })
        // })
        // dispatch(updateCurrentActiveBoard(newBoard))
        // // update card modal
        // const newActiveCardModal = cloneDeep(activeCardModal)
        // newActiveCardModal.attachments.push(updatedAttachment)
        // newActiveCardModal.cardAttachmentIds.push(res._id)
        // dispatch(updateCurrentActiveCard(newActiveCardModal))
        dispatch(fetchBoardDetailsAPI(boardId))
        dispatch(fetchCardDetailsAPI(activeCardModal._id))
        setAnchorPopoverElement(null)
        reset() // Reset form sau khi submit thành công
      })
      .finally(res => {
        socketIoInstance.emit('FE_CREATE_ATTACHMENT', {
          ...res,
          cardId: activeCardModal._id
        })
      })
  }

  const onUploadAttachment = event => {
    // const error = singleFileValidator(event.target?.files[0])
    // if (error) {
    //   toast.error(error)
    //   return
    // }

    let reqData = new FormData()
    reqData.append('attachment', event.target?.files[0])
    reqData.append('cardId', cardModal?._id)
    // Gọi API...
    toast.promise(
      handleCreateAttachmentAPI(reqData)
        .then(() => {
          // const updatedAttachment = {
          //   _id: res._id,
          //   name: res.name,
          //   link: res.link,
          //   size: res.size,
          //   type: res.type
          // }
          // const newBoard = cloneDeep(board)
          // // update board attachment
          // newBoard.columns.forEach(column => {
          //   column.cards.forEach(card => {
          //     if (cardModal?._id === card._id) {
          //       card.cardAttachmentIds.push(res._id)
          //     }
          //   })
          // })
          // dispatch(updateCurrentActiveBoard(newBoard))
          // // update card modal
          // const newActiveCardModal = cloneDeep(activeCardModal)
          // newActiveCardModal.attachments.push(updatedAttachment)
          // newActiveCardModal.cardAttachmentIds.push(res._id)
          // dispatch(updateCurrentActiveCard(newActiveCardModal))

          dispatch(fetchBoardDetailsAPI(boardId))
          dispatch(fetchCardDetailsAPI(activeCardModal._id))
        })
        .finally(res => {
          socketIoInstance.emit('FE_CREATE_ATTACHMENT', {
            ...res,
            cardId: activeCardModal._id
          })
          setAnchorPopoverElement(null)
          event.target.value = ''
        }),
      {
        pending: 'uploading attachment from your computer...'
      }
    )
  }

  return (
    <>
      <SidebarItem aria-describedby={popoverId} onClick={handleTogglePopover}>
        <AttachmentIcon fontSize="small" />
        Attachment
      </SidebarItem>

      <Popover
        id={popoverId}
        open={isOpenPopover}
        anchorEl={anchorPopoverElement}
        onClose={handleTogglePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'center', horizontal: 'right' }}
        sx={{ height: '600px' }}
      >
        <Box
          sx={{
            width: '350px',
            px: 1,
            py: 1.5,
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            Attach a file from your computer
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              paddingY: '10px',
              backgroundColor: theme =>
                theme.palette.mode === 'dark' ? '#33485D' : '#dfe6e9',
              borderRadius: '5px',
              '&:hover': {
                backgroundColor: theme =>
                  theme.palette.mode === 'dark' ? '#636e72' : '#b2bec3'
              }
            }}
            onClick={() => fileInput.current.click()}
          >
            {/* <Button
              variant="contained"
              color="primary"
              onClick={() => fileInput.current.click()}
              >
              upload file
              </Button> */}
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              Open file in local
            </Typography>
            <input
              ref={fileInput}
              type="file"
              style={{ display: 'none' }}
              onChange={onUploadAttachment}
            />
          </Box>

          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            Or add new link attachment
          </Typography>
          <form onSubmit={handleSubmit(onSubmitLinkAttachment)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <TextField
                autoFocus
                fullWidth
                label="Link Attachment"
                type="text"
                variant="outlined"
                size="small"
                {...register('link', {
                  required: 'Link is required',
                  pattern: {
                    value: /^(https?:\/\/.*\..*)$/i,
                    message: 'Enter a valid URL'
                  }
                })}
                error={!!errors.link}
                helperText={errors.link?.message}
              />
              <TextField
                fullWidth
                label="Display name"
                type="text"
                size="small"
                {...register('displayName', {
                  required: 'Display name is required'
                })}
                error={!!errors.displayName}
                helperText={errors.displayName?.message}
              />

              <Button variant="contained" type="submit">
                Add Link
              </Button>
            </Box>
          </form>
        </Box>
      </Popover>
    </>
  )
}

export default AttachmentCreateModal
