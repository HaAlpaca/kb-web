import Box from '@mui/material/Box'
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import {
  downloadFile,
  generateDownloadURL,
  getFaviconUrl
} from '~/utils/formatters'
import Expandable from '~/components/Expandable/Expandable'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import { ALLOW_COMMON_IMAGE_TYPES } from '~/utils/validators'
import Grid from '@mui/material/Unstable_Grid2'
import AttachmentSettingModal from './AttachmentSettingModal'
import { useConfirm } from 'material-ui-confirm'
import { handleChangeAttachmentAPI, handleDeleteAttachmentAPI } from '~/apis'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectCurrentActiveBoard,
  updateCurrentActiveBoard
} from '~/redux/activeBoard/activeBoardSlice'
import {
  selectCurrentActiveCard,
  updateCurrentActiveCard
} from '~/redux/activeCard/activeCardSlice'
import { cloneDeep } from 'lodash'
import moment from 'moment'
function CardAttachment({ attachments }) {
  const board = useSelector(selectCurrentActiveBoard)
  const dispatch = useDispatch()
  const activeCardModal = useSelector(selectCurrentActiveCard)
  let linkAttachment = attachments.filter(
    attachment => attachment.type === 'link'
  )
  let fileAttachment = attachments.filter(
    attachment => attachment.type !== 'link'
  )
  const confirmDeleteAttachment = useConfirm()
  const handleDeleteAttachment = async attachmentId => {
    await confirmDeleteAttachment({
      title: 'Delete this Attachment',
      description: 'Are you sure?',
      confirmationText: 'Yes',
      cancellationText: 'No'
    }).then(
      async () =>
        await handleDeleteAttachmentAPI(attachmentId).then(() => {
          // update board attachment
          // update board label
          const newBoard = cloneDeep(board)
          newBoard.columns.forEach(column => {
            column.cards.forEach(card => {
              if (card.cardAttachmentIds) {
                card.cardAttachmentIds = card.cardAttachmentIds.filter(
                  _id => _id !== attachmentId
                )
              }
            })
          })
          dispatch(updateCurrentActiveBoard(newBoard))
          // update card modal
          const newActiveCardModal = cloneDeep(activeCardModal)
          newActiveCardModal.attachments =
            newActiveCardModal.attachments.filter(
              attachment => attachment._id !== attachmentId
            )
          newActiveCardModal.cardAttachmentIds =
            newActiveCardModal.cardAttachmentIds.filter(
              attachment => attachment._id !== attachmentId
            )
          dispatch(updateCurrentActiveCard(newActiveCardModal))
        })
    )
  }
  const handleChangeAttachment = async (attachmentId, data) => {
    // console.log('Change Form Attachment', data)
    const updatedAttachment = {
      name: data.attachmentName
    }
    if (data.attachmentLink) {
      updatedAttachment.link = data.attachmentLink
    }
    await handleChangeAttachmentAPI(attachmentId, updatedAttachment).then(
      () => {
        // update board attachment
        const newActiveCardModal = cloneDeep(activeCardModal)
        newActiveCardModal.attachments.forEach(attachment => {
          if (attachment._id === attachmentId) {
            attachment.name = data.attachmentName
            if (data.attachmentLink) {
              attachment.link = data.attachmentLink
            }
          }
        })
        dispatch(updateCurrentActiveCard(newActiveCardModal))
      }
    )
  }

  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            mb: 2
          }}
        >
          <AttachFileOutlinedIcon />
          <Typography
            variant="span"
            sx={{ fontWeight: '600', fontSize: '20px' }}
          >
            Attachment
          </Typography>
        </Box>
        <Grid container spacing={1} sx={{ ml: 2 }}>
          {linkAttachment.length > 0 && (
            <Grid xs={12} sm={12}>
              <Expandable size={300}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography
                    variant="span"
                    sx={{ fontWeight: '600', fontSize: '16px' }}
                  >
                    Link
                  </Typography>

                  {linkAttachment.map((attachment, index) => (
                    <Box
                      key={index}
                      sx={{
                        borderRadius: '4px',
                        backgroundColor: theme =>
                          theme.palette.mode === 'dark' ? '#333643' : '#ebecf0',
                        paddingY: '6px',
                        paddingX: '12px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 1
                        }}
                      >
                        <a
                          href={attachment.link}
                          target="_blank"
                          rel="noreferrer"
                          style={{ display: 'flex', alignItems: 'center' }}
                        >
                          <img
                            src={getFaviconUrl(attachment.link)}
                            alt={attachment.name}
                            style={{ width: '22px', height: '22px' }}
                          />
                        </a>
                        <Tooltip
                          title={
                            <span style={{ whiteSpace: 'pre-line' }}>
                              {`${attachment.name}\n${attachment.link}`}
                            </span>
                          }
                          placement="right"
                        >
                          <Typography
                            component="a"
                            href={attachment.link}
                            variant="subtitle1"
                            target="_blank"
                            rel="noreferrer"
                            sx={{
                              marginX: '6px',
                              textDecoration: 'none',
                              color: theme =>
                                theme.palette.mode === 'dark'
                                  ? '#90caf9'
                                  : '#0c66e4',
                              '&:hover': {
                                textDecoration: 'underline'
                              },

                              display: '-webkit-box',
                              WebkitBoxOrient: 'vertical',
                              WebkitLineClamp: 2, // Giới hạn 2 dòng, quá sẽ có "..."
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              wordBreak: 'break-word', // Ngăn vỡ layout với từ quá dài
                              maxWidth: '100%' // Đảm bảo không bị tràn ra ngoài
                            }}
                          >
                            {attachment.name}
                          </Typography>
                        </Tooltip>
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <AttachmentSettingModal
                          attachment={attachment}
                          handleDeleteAttachment={handleDeleteAttachment}
                          handleChangeAttachment={handleChangeAttachment}
                        />
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Expandable>
            </Grid>
          )}
          {fileAttachment.length > 0 && (
            <Grid xs={12} sm={12}>
              <Expandable size={300}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography
                    variant="span"
                    sx={{ fontWeight: '600', fontSize: '16px' }}
                  >
                    File
                  </Typography>

                  {fileAttachment.map((attachment, index) => (
                    <Box
                      key={index}
                      sx={{
                        borderRadius: '4px',
                        backgroundColor: theme =>
                          theme.palette.mode === 'dark' ? '#333643' : '#ebecf0',
                        paddingY: '6px',
                        paddingX: '12px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 1
                        }}
                      >
                        {ALLOW_COMMON_IMAGE_TYPES.includes(attachment.type) ? (
                          <a
                            href={attachment.link}
                            target="_blank"
                            rel="noreferrer"
                            style={{ display: 'flex', alignItems: 'center' }}
                          >
                            <img
                              src={attachment.link}
                              alt={attachment.name}
                              style={{
                                padding: '4px',
                                height: '48px',
                                width: '64px',
                                objectFit: 'contain',
                                backgroundColor: '#ccc',
                                borderRadius: '4px'
                              }}
                            />
                          </a>
                        ) : (
                          <Box
                            style={{
                              padding: '4px',
                              height: '48px',
                              width: '64px',
                              backgroundColor: '#ccc',
                              borderRadius: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Typography
                              variant="subtitle2"
                              sx={{
                                fontWeight: '600',
                                fontSize: '16px'
                              }}
                            >
                              {attachment.type.toUpperCase()}
                            </Typography>
                          </Box>
                        )}

                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            marginX: '6px',
                            gap: '2px'
                          }}
                        >
                          <Tooltip
                            title={
                              <span style={{ whiteSpace: 'pre-line' }}>
                                {`${attachment.name} - ${attachment.type} `}
                              </span>
                            }
                            placement="right"
                          >
                            <Typography
                              component="a"
                              href={attachment.link}
                              variant="subtitle1"
                              target="_blank"
                              rel="noreferrer"
                              sx={{
                                textDecoration: 'none',
                                color: theme =>
                                  theme.palette.mode === 'dark'
                                    ? '#90caf9'
                                    : '#0c66e4',
                                '&:hover': {
                                  textDecoration: 'underline'
                                },

                                display: '-webkit-box',
                                WebkitBoxOrient: 'vertical',
                                WebkitLineClamp: 2,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                wordBreak: 'break-word',
                                maxWidth: '100%'
                              }}
                            >
                              {attachment.name}
                            </Typography>
                          </Tooltip>
                          <Typography variant="body2">
                            Added{' '}
                            {moment(attachment.createdAt).format(
                              'MMMM Do YYYY, h:mm:ss a'
                            )}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() =>
                            downloadFile(
                              generateDownloadURL(attachment.link),
                              attachment.name
                            )
                          }
                        >
                          <FileDownloadOutlinedIcon fontSize="medium" />
                        </IconButton>
                        {/* <IconButton size="small">
                          <FilePreview attachment={attachment} />
                        </IconButton> */}
                        <AttachmentSettingModal
                          attachment={attachment}
                          handleDeleteAttachment={handleDeleteAttachment}
                          handleChangeAttachment={handleChangeAttachment}
                        />
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Expandable>
            </Grid>
          )}
        </Grid>
      </Box>
    </>
  )
}

export default CardAttachment
