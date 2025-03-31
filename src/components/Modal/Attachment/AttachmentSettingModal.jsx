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

  const onSubmit = data => {
    const updateData = {
      attachmentName: data.attachmentName.trim(),
      attachmentLink: data.attachmentLink.trim()
    }
    if (attachment?.type !== 'link') {
      delete updateData.attachmentLink
    }
    handleChangeAttachment(attachment._id, updateData)
    handlePopoverClose()
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
