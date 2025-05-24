import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import CancelIcon from '@mui/icons-material/Cancel'
import Grid from '@mui/material/Unstable_Grid2'
import Stack from '@mui/material/Stack'
// import Divider from '@mui/material/Divider'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'

import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
// import AutoFixHighOutlinedIcon from '@mui/icons-material/AutoFixHighOutlined'
// import AspectRatioOutlinedIcon from '@mui/icons-material/AspectRatioOutlined'
// import AddToDriveOutlinedIcon from '@mui/icons-material/AddToDriveOutlined'
// import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
// import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined'
// import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'
// import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined'
// import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined'
// import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined'
import SubjectRoundedIcon from '@mui/icons-material/SubjectRounded'

import DvrOutlinedIcon from '@mui/icons-material/DvrOutlined'

import ToggleFocusInput from '~/components/Form/ToggleFocusInput'
import VisuallyHiddenInput from '~/components/Form/VisuallyHiddenInput'
import { singleFileValidator } from '~/utils/validators'
import { toast } from 'react-toastify'
import CardUserGroup from './CardUserGroup'
import CardDescriptionMdEditor from './CardDescriptionMdEditor'
import CardActivitySection from './CardActivitySection'

import { styled } from '@mui/material/styles'
import { useDispatch, useSelector } from 'react-redux'
import {
  clearAndHideCurrentActiveCard,
  selectIsShowModalActiceCard,
  selectCurrentActiveCard,
  updateCurrentActiveCard,
  fetchCardDetailsAPI
} from '~/redux/activeCard/activeCardSlice'
import { updateCardDetailsAPI } from '~/apis'
import {
  fetchBoardDetailsAPI,
  updateCardInBoard
} from '~/redux/activeBoard/activeBoardSlice'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { CARD_MEMBER_ACTION } from '~/utils/constants'
import LabelModal from '../Label/LabelModal'
import { useLocation, useNavigate } from 'react-router-dom'
import LabelGroupModal from '~/components/Label/LabelGroupModal'
import AttachmentCreateModal from '../Attachment/AttachmentCreateModal'

import CardAttachment from '../Attachment/CardAttachment'
import DateModal from '../Date/DateModal'
import { useState } from 'react'
import moment from 'moment'
import CardCheckList from '../Checklist/CardChecklist'
import CreateChecklistModal from '../Checklist/CreateChecklistModal'
import { socketIoInstance } from '~/socket-client'
import Checkbox from '@mui/material/Checkbox'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { handleToggleCompleteCardAPI } from '~/apis'

const SidebarItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '600',
  color: theme.palette.mode === 'dark' ? '#90caf9' : '#172b4d',
  backgroundColor: theme.palette.mode === 'dark' ? '#2f3542' : '#091e420f',
  padding: '10px',
  borderRadius: '4px',
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'dark' ? '#33485D' : theme.palette.grey[300],
    '&.active': {
      color: theme.palette.mode === 'dark' ? '#000000de' : '#0c66e4',
      backgroundColor: theme.palette.mode === 'dark' ? '#90caf9' : '#e9f2ff'
    }
  }
}))

/**
 * Note: Modal là một low-component mà bọn MUI sử dụng bên trong những thứ như Dialog, Drawer, Menu, Popover. Ở đây dĩ nhiên chúng ta có thể sử dụng Dialog cũng không thành vấn đề gì, nhưng sẽ sử dụng Modal để dễ linh hoạt tùy biến giao diện từ con số 0 cho phù hợp với mọi nhu cầu nhé.
 */
function ActiveCard() {
  const dispatch = useDispatch()
  const activeCard = useSelector(selectCurrentActiveCard)
  const currentUser = useSelector(selectCurrentUser)
  const isShowModalActiveCard = useSelector(selectIsShowModalActiceCard)
  const navigate = useNavigate()
  const location = useLocation()
  // khong dung state de check modal vi state board  _id.jsx la lam roi
  // const [isOpen, setIsOpen] = useState(true)
  // const handleOpenModal = () => setIsOpen(true)

  const [isPortrait, setIsPortrait] = useState(false)
  const handleImageLoad = event => {
    const img = event.currentTarget
    setIsPortrait(img.naturalHeight > img.naturalWidth)
  }

  const handleCloseModal = () => {
    dispatch(clearAndHideCurrentActiveCard())
    handleDeleteParams()
  }

  const handleDeleteParams = () => {
    const params = new URLSearchParams(location.search)
    params.delete('cardModal')
    navigate(`${location.pathname}?${params.toString()}`, { replace: true })
  }
  // function dung chung cho update card ,description, cover, comment
  const callApiUpdateCard = async updateData => {
    const updatedCard = await updateCardDetailsAPI(activeCard._id, updateData)
    // const updatedCardWithLabel = cloneDeep(updatedCard)
    // updatedCardWithLabel.labels = activeCard.labels
    // cap nhat nho phai luu vao redux
    dispatch(updateCurrentActiveCard(updatedCard))
    // nho cap nhat ca board ns vi card co trong board
    dispatch(updateCardInBoard(updatedCard))
    return updatedCard
  }

  const onUpdateCardTitle = newTitle => {
    callApiUpdateCard({ title: newTitle.trim() })
    socketIoInstance.emit('FE_UPDATE_CARD', {
      cardId: activeCard._id
    })
  }
  const onUpdateCardDescription = newDescription => {
    callApiUpdateCard({ description: newDescription })
    socketIoInstance.emit('FE_UPDATE_CARD', {
      cardId: activeCard._id
    })
  }

  const onUploadCardCover = event => {
    // console.log(event.target?.files[0])
    const error = singleFileValidator(event.target?.files[0])
    if (error) {
      toast.error(error)
      return
    }
    let reqData = new FormData()
    reqData.append('cardCover', event.target?.files[0])

    // Gọi API...
    toast
      .promise(
        callApiUpdateCard(reqData).finally(() => (event.target.value = '')),
        {
          pending: 'uploading...'
        }
      )
      .finally(() => {
        socketIoInstance.emit('FE_UPDATE_CARD', {
          cardId: activeCard._id
        })
      })
  }

  const onAddCardComment = async commentToAdd => {
    await callApiUpdateCard({ commentToAdd })
    socketIoInstance.emit('FE_UPDATE_CARD', {
      cardId: activeCard._id
    })
  }

  const onUpdateCardMembers = incomingMemberInfo => {
    // console.log(incomingMemberInfo)
    callApiUpdateCard({ incomingMemberInfo })
    socketIoInstance.emit('FE_UPDATE_CARD', {
      cardId: activeCard._id
    })
  }

  const { control } = useForm({
    defaultValues: {
      isComplete: activeCard?.isComplete ?? false
    }
  })

  const watchIsComplete = useWatch({ control, name: 'isComplete' })

  const handleToggleComplete = async checked => {
    await handleToggleCompleteCardAPI(activeCard._id).then(() => {
      dispatch(fetchBoardDetailsAPI(activeCard.boardId))
      dispatch(fetchCardDetailsAPI(activeCard._id))
      socketIoInstance.emit('FE_UPDATE_CARD', { cardId: activeCard._id })
    })
  }

  return (
    <Modal
      disableScrollLock
      open={isShowModalActiveCard}
      onClose={handleCloseModal} // Sử dụng onClose trong trường hợp muốn đóng Modal bằng nút ESC hoặc click ra ngoài Modal
      sx={{ overflowY: 'auto' }}
    >
      <Box
        sx={{
          position: 'relative',
          width: 900,
          maxWidth: 900,
          bgcolor: 'white',
          boxShadow: 24,
          borderRadius: '8px',
          border: 'none',
          outline: 0,
          padding: '40px 20px 10px',
          margin: '20px auto',
          backgroundColor: theme =>
            theme.palette.mode === 'dark' ? '#1A2027' : '#fff'
        }}
      >
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
            onClick={handleCloseModal}
          />
        </Box>
        {/* {activeCard?.cover && (
          <Box sx={{ mb: 4 }}>
            <img
              style={{
                width: '100%',
                height: '320px',
                borderRadius: '6px',
                objectFit: 'cover'
              }}
              src={activeCard.cover}
              alt="card-cover"
            />
          </Box>
        )} */}

        {activeCard?.cover && (
          <Box
            sx={{
              mb: 4,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <img
              style={{
                width: isPortrait ? 'auto' : '100%',
                height: isPortrait ? '320px' : 'auto',
                maxHeight: '320px',
                borderRadius: '6px',
                objectFit: 'cover'
              }}
              src={activeCard.cover}
              alt="card-cover"
              onLoad={handleImageLoad}
            />
          </Box>
        )}

        <Box
          sx={{
            mb: 1,
            mt: -3,
            pr: 2.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Controller
            name="isComplete"
            control={control}
            render={({ field }) => (
              <Checkbox
                color="success"
                size="small"
                checked={watchIsComplete}
                onChange={async event => {
                  field.onChange(event.target.checked)
                  await handleToggleComplete(event.target.checked)
                }}
              />
            )}
          />

          {/* Feature 01: Xử lý tiêu đề của Card */}
          <ToggleFocusInput
            inputFontSize="22px"
            value={activeCard?.title}
            onChangedValue={onUpdateCardTitle}
          />
        </Box>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          {/* Left side */}
          <Grid xs={12} sm={9}>
            {activeCard?.labels?.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography
                  sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}
                >
                  Labels
                </Typography>

                <LabelGroupModal labels={activeCard?.labels} />
              </Box>
            )}

            <Box sx={{ mb: 3 }}>
              <Typography
                sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}
              >
                Members
              </Typography>

              {/* Feature 02: Xử lý các thành viên của Card */}
              <CardUserGroup
                cardMemberIds={activeCard?.memberIds}
                onUpdateCardMembers={onUpdateCardMembers}
              />
            </Box>

            {activeCard?.dueDate && (
              <Box sx={{ mb: 3 }}>
                <Typography
                  sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}
                >
                  Due Date
                </Typography>

                <Box
                  sx={{
                    ml: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: '#6BCB77',
                      padding: 1,
                      display: 'flex',
                      alignItems: 'center',
                      borderRadius: '4px'
                    }}
                  >
                    <Typography sx={{ fontWeight: '600', color: 'white' }}>
                      Start Date:{' '}
                      {moment(activeCard?.startDate).format(
                        'HH:mm dddd MM/DD/YYYY '
                      )}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      bgcolor: '#FF6B6B',
                      padding: 1,
                      display: 'flex',
                      alignItems: 'center',
                      borderRadius: '4px'
                    }}
                  >
                    <Typography sx={{ fontWeight: '600', color: 'white' }}>
                      Due Date:{' '}
                      {moment(activeCard?.dueDate).format(
                        'HH:mm dddd MM/DD/YYYY '
                      )}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      bgcolor: '#4D96FF',
                      padding: 1,
                      display: 'flex',
                      alignItems: 'center',
                      borderRadius: '4px'
                    }}
                  >
                    <Typography sx={{ fontWeight: '600', color: 'white' }}>
                      reminder Date:{' '}
                      {moment(activeCard?.reminder).format(
                        'HH:mm dddd MM/DD/YYYY '
                      )}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <SubjectRoundedIcon />
                <Typography
                  variant="span"
                  sx={{ fontWeight: '600', fontSize: '20px' }}
                >
                  Description
                </Typography>
              </Box>

              {/* Feature 03: Xử lý mô tả của Card */}
              <CardDescriptionMdEditor
                cardDescriptionProp={activeCard?.description}
                handleUpdateCardDescription={onUpdateCardDescription}
              />
            </Box>

            {activeCard?.checklists?.length > 0 && (
              <CardCheckList
                checklists={activeCard?.checklists}
                cardChecklistIds={activeCard?.cardChecklistIds}
              />
            )}

            {activeCard?.attachments?.length > 0 && (
              <CardAttachment attachments={activeCard?.attachments} />
            )}

            <Box sx={{ mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <DvrOutlinedIcon />
                <Typography
                  variant="span"
                  sx={{ fontWeight: '600', fontSize: '20px' }}
                >
                  Activity
                </Typography>
              </Box>

              {/* Feature 04: Xử lý các hành động, ví dụ comment vào Card */}
              <CardActivitySection
                cardComments={activeCard?.comments}
                onAddCardComment={onAddCardComment}
              />
            </Box>
          </Grid>

          {/* Right side */}
          <Grid
            xs={12}
            sm={3}
            sx={{
              position: 'sticky',
              top: '20px', // hoặc bao nhiêu px bạn muốn cách từ đỉnh
              alignSelf: 'flex-start'
            }}
          >
            <Typography
              sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}
            >
              Add To Card
            </Typography>

            <Stack direction="column" spacing={1}>
              {/* Feature 05: Xử lý hành động bản thân user tự join vào card */}
              {!activeCard?.memberIds.includes(currentUser._id) ? (
                <SidebarItem
                  className="active"
                  onClick={() =>
                    onUpdateCardMembers({
                      userId: currentUser._id,
                      action: CARD_MEMBER_ACTION.ADD
                    })
                  }
                >
                  <PersonOutlineOutlinedIcon fontSize="small" />
                  Join To Card
                </SidebarItem>
              ) : (
                <SidebarItem
                  className="active"
                  onClick={() =>
                    onUpdateCardMembers({
                      userId: currentUser._id,
                      action: CARD_MEMBER_ACTION.REMOVE
                    })
                  }
                >
                  <PersonOutlineOutlinedIcon fontSize="small" />
                  Leave Card
                </SidebarItem>
              )}
              {/* Feature 06: Xử lý hành động cập nhật ảnh Cover của Card */}
              <SidebarItem className="active" component="label">
                <ImageOutlinedIcon fontSize="small" />
                Cover
                <VisuallyHiddenInput type="file" onChange={onUploadCardCover} />
              </SidebarItem>

              <AttachmentCreateModal
                cardModal={activeCard}
                SidebarItem={SidebarItem}
              />

              <LabelModal cardModal={activeCard} SidebarItem={SidebarItem} />

              <CreateChecklistModal
                card={activeCard}
                SidebarItem={SidebarItem}
              />

              {/* Date */}
              <DateModal SidebarItem={SidebarItem} card={activeCard} />

              {/* <SidebarItem>
                <AutoFixHighOutlinedIcon fontSize="small" />
                Custom Fields
              </SidebarItem> */}
            </Stack>

            {/* <Divider sx={{ my: 2 }} /> */}

            {/* <Typography
              sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}
            >
              Power-Ups
            </Typography>
            <Stack direction="column" spacing={1}>
              <SidebarItem>
                <AspectRatioOutlinedIcon fontSize="small" />
                Card Size
              </SidebarItem>
              <SidebarItem>
                <AddToDriveOutlinedIcon fontSize="small" />
                Google Drive
              </SidebarItem>
              <SidebarItem>
                <AddOutlinedIcon fontSize="small" />
                Add Power-Ups
              </SidebarItem>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography
              sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}
            >
              Actions
            </Typography>
            <Stack direction="column" spacing={1}>
              <SidebarItem>
                <ArrowForwardOutlinedIcon fontSize="small" />
                Move
              </SidebarItem>
              <SidebarItem>
                <ContentCopyOutlinedIcon fontSize="small" />
                Copy
              </SidebarItem>
              <SidebarItem>
                <AutoAwesomeOutlinedIcon fontSize="small" />
                Make Template
              </SidebarItem>
              <SidebarItem>
                <ArchiveOutlinedIcon fontSize="small" />
                Archive
              </SidebarItem>
              <SidebarItem>
                <ShareOutlinedIcon fontSize="small" />
                Share
              </SidebarItem>
            </Stack> */}
          </Grid>
        </Grid>
      </Box>
    </Modal>
  )
}

export default ActiveCard
