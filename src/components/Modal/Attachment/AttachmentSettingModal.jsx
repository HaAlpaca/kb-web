import React from 'react'
import { useForm } from 'react-hook-form'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import IconButton from '@mui/material/IconButton'
import Popover from '@mui/material/Popover'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { downloadFile, generateDownloadURL } from '~/utils/formatters'
import { ALLOW_COMMON_IMAGE_TYPES } from '~/utils/validators'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import { updateCardDetailsAPI } from '~/apis'
import {
  selectCurrentActiveCard,
  updateCurrentActiveCard
} from '~/redux/activeCard/activeCardSlice'
import { updateCardInBoard } from '~/redux/activeBoard/activeBoardSlice'
import { useDispatch, useSelector } from 'react-redux'
import HideImageOutlinedIcon from '@mui/icons-material/HideImageOutlined'
function AttachmentSettingModal({
  attachment,
  handleDeleteAttachment,
  handleChangeAttachment
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      attachmentName: attachment.name,
      attachmentLink: attachment.link
    }
  })

  const dispatch = useDispatch()
  const activeCard = useSelector(selectCurrentActiveCard)

  const [anchorEl, setAnchorEl] = React.useState(null)
  const [popoverEl, setPopoverEl] = React.useState(null)

  const openMenu = Boolean(anchorEl)
  const openPopover = Boolean(popoverEl)

  const handleMenuClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleChangeClick = event => {
    handleMenuClose()
    setPopoverEl(event.currentTarget)
  }

  const handlePopoverClose = () => {
    setPopoverEl(null)
    reset()
  }

  const callApiUpdateCard = async updateData => {
    const updatedCard = await updateCardDetailsAPI(activeCard._id, {
      cover: updateData
    })
    // const updatedCardWithLabel = cloneDeep(updatedCard)
    // updatedCardWithLabel.labels = activeCard.labels
    // cap nhat nho phai luu vao redux
    dispatch(updateCurrentActiveCard(updatedCard))
    // nho cap nhat ca board ns vi card co trong board
    dispatch(updateCardInBoard(updatedCard))
    handleMenuClose()
  }

  const onSubmit = data => {
    handlePopoverClose()
    const updateData = {
      attachmentName: data.attachmentName.trim(),
      attachmentLink: data.attachmentLink.trim()
    }
    if (attachment?.type !== 'link') {
      delete updateData.attachmentLink
    }
    handleChangeAttachment(attachment._id, updateData)
  }

  return (
    <Box>
      <IconButton size="small" onClick={handleMenuClick}>
        <MoreVertIcon />
      </IconButton>

      <Menu anchorEl={anchorEl} open={openMenu} onClose={handleMenuClose}>
        <MenuItem onClick={handleChangeClick}>
          <ListItemIcon>
            <CreateOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Change</ListItemText>
        </MenuItem>
        {attachment?.type === 'link' ? (
          <MenuItem
            component="a" // Chuyển IconButton thành thẻ <a>
            target="_blank"
            rel="noreferrer"
            href={attachment.link}
          >
            <ListItemIcon>
              <OpenInNewIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>View</ListItemText>
          </MenuItem>
        ) : (
          <MenuItem
            onClick={() =>
              downloadFile(
                generateDownloadURL(attachment.link),
                attachment.name
              )
            }
          >
            <ListItemIcon>
              <FileDownloadOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Download</ListItemText>
          </MenuItem>
        )}

        {ALLOW_COMMON_IMAGE_TYPES.includes(attachment.type) && (
          <Box>
            {activeCard?.cover === attachment.link ? (
              <MenuItem onClick={() => callApiUpdateCard('')}>
                <ListItemIcon>
                  <HideImageOutlinedIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Remove Cover</ListItemText>
              </MenuItem>
            ) : (
              <MenuItem onClick={() => callApiUpdateCard(attachment.link)}>
                <ListItemIcon>
                  <ImageOutlinedIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Make Cover</ListItemText>
              </MenuItem>
            )}
          </Box>
        )}

        <MenuItem onClick={() => handleDeleteAttachment(attachment._id)}>
          <ListItemIcon>
            <DeleteOutlineOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      <Popover
        open={openPopover}
        anchorEl={popoverEl}
        onClose={handlePopoverClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box
          p={2}
          display="flex"
          flexDirection="column"
          width="300px"
          gap={2}
          component="form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Typography variant="h6">Edit Attachment</Typography>
          <TextField
            label="Attachment Name"
            size="small"
            {...register('attachmentName', { required: 'Name is required' })}
            error={!!errors.attachmentName}
            helperText={errors.attachmentName?.message}
            fullWidth
          />
          {attachment?.type === 'link' && (
            <TextField
              label="Attachment Link"
              size="small"
              {...register('attachmentLink', { required: 'Link is required' })}
              error={!!errors.attachmentLink}
              helperText={errors.attachmentLink?.message}
              fullWidth
            />
          )}
          <Button type="submit" variant="outlined">
            Save
          </Button>
        </Box>
      </Popover>
    </Box>
  )
}

export default AttachmentSettingModal
