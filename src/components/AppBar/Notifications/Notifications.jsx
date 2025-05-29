import { useEffect, useState } from 'react'
import moment from 'moment'
import {
  Badge,
  Box,
  Typography,
  Tooltip,
  Button,
  Chip,
  Menu,
  MenuItem,
  Divider
} from '@mui/material'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import DoneIcon from '@mui/icons-material/Done'
import NotInterestedIcon from '@mui/icons-material/NotInterested'
import AssignmentIcon from '@mui/icons-material/Assignment'
import {
  ACTION_TYPES,
  BOARD_INVITATION_STATUS,
  OWNER_ACTION_TARGET
} from '~/utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import {
  addNotification,
  fetchInvitationsAPI,
  selectCurrentNotifications,
  updateBoardInvitationAPI
} from '~/redux/notifications/notificationsSlice'
import {
  fetchActionsAPI,
  selectCurrentActionNotifications
} from '~/redux/notifications/notificationsActionSlice'
import { socketIoInstance } from '~/socket-client'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { useNavigate } from 'react-router-dom'
import Expandable from '~/components/Expandable/Expandable'

function Notifications() {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const [newNotifications, setNewNotifications] = useState(false)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const notifications = useSelector(selectCurrentNotifications)
  const actionNotifications = useSelector(selectCurrentActionNotifications)
  const currentUser = useSelector(selectCurrentUser)

  const handleClickNotificationIcon = event => {
    setAnchorEl(event.currentTarget)
    setNewNotifications(false)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const updateBoardInvitation = (status, invitationId) => {
    dispatch(updateBoardInvitationAPI({ status, invitationId })).then(res => {
      if (
        res.payload.boardInvitation.status === BOARD_INVITATION_STATUS.ACCEPTED
      ) {
        navigate(`/boards/${res.payload.boardInvitation.boardId}`)
      } else {
        dispatch(fetchInvitationsAPI())
      }
    })
  }

  const handleNavigateToTask = (boardId, metadata) => {
    if (metadata.ownerTargetType === OWNER_ACTION_TARGET.COLUMN) {
      navigate(`/boards/${boardId}?cardModal=${metadata.targetId}`)
    } else if (metadata.ownerTargetType === OWNER_ACTION_TARGET.CARD) {
      navigate(`/boards/${boardId}?cardModal=${metadata.ownerTargetId}`)
    } else {
      navigate(`/boards/${boardId}`)
    }
    handleClose()
  }

  useEffect(() => {
    dispatch(fetchInvitationsAPI())

    const onReceiveNewInvitation = invitation => {
      if (invitation.inviteeId === currentUser._id) {
        dispatch(addNotification(invitation))
        setNewNotifications(true)
      }
    }

    socketIoInstance.on('BE_USER_INVITED_TO_BOARD', onReceiveNewInvitation)

    return () => {
      socketIoInstance.off('BE_USER_INVITED_TO_BOARD', onReceiveNewInvitation)
    }
  }, [dispatch, currentUser._id])

  useEffect(() => {
    dispatch(fetchActionsAPI())

    const onReceiveNewAction = action => {
      dispatch(fetchActionsAPI())
      if (action.assigneeId === currentUser._id) {
        setNewNotifications(true)
      }
    }

    socketIoInstance.on('BE_USER_RECEIVED_ACTION', onReceiveNewAction)

    return () => {
      socketIoInstance.off('BE_USER_RECEIVED_ACTION', onReceiveNewAction)
    }
  }, [dispatch, currentUser._id])

  return (
    <Box>
      <Tooltip title="Notifications">
        <Badge
          color="warning"
          variant={newNotifications ? 'dot' : 'none'}
          sx={{ cursor: 'pointer' }}
          id="basic-button-open-notification"
          aria-controls={open ? 'basic-notification-drop-down' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClickNotificationIcon}
        >
          <NotificationsNoneIcon
            sx={{
              color: newNotifications ? 'yellow' : 'white',
              fontSize: '1.8rem'
            }}
          />
        </Badge>
      </Tooltip>

      <Menu
        sx={{
          mt: 2,
          '& .MuiPaper-root': {
            borderRadius: 2,
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
            minWidth: 300
          }
        }}
        id="basic-notification-drop-down"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ 'aria-labelledby': 'basic-button-open-notification' }}
      >
        {/* ============================ ASSIGNMENT ============================ */}
        <Box sx={{ px: 2, py: 1 }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}
          >
            Board Assignment Notification
          </Typography>
          {(!actionNotifications || actionNotifications.length === 0) && (
            <MenuItem
              sx={{
                minWidth: 200,
                maxWidth: 360,
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                color: 'text.secondary'
              }}
            >
              You do not have any new assignment notifications.
            </MenuItem>
          )}
          <Expandable size={300} buttonBorderRadiusTop={true}>
            {actionNotifications?.map((notification, index) => (
              <Box key={`action-${index}`}>
                <MenuItem
                  sx={{
                    minWidth: 200,
                    maxWidth: 360,
                    '&:hover': {
                      backgroundColor: 'action.hover'
                    }
                  }}
                  onClick={() =>
                    handleNavigateToTask(
                      notification.boardId,
                      notification.metadata
                    )
                  }
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                      width: '100%'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AssignmentIcon fontSize="small" color="primary" />
                      <Typography
                        variant="body2"
                        sx={{ color: 'text.primary' }}
                      >
                        {notification.type === ACTION_TYPES.ASSIGN_CARD ? (
                          notification.assigner[0]?._id === currentUser._id ? (
                            <>
                              <strong>You</strong> assigned yourself to a new
                              card
                            </>
                          ) : (
                            <>
                              <strong>
                                {notification.assigner[0]?.displayName}
                              </strong>{' '}
                              assigned you to a new card
                            </>
                          )
                        ) : notification.assigner[0]?._id ===
                          currentUser._id ? (
                          <>
                            <strong>You</strong> assigned yourself to a new
                            checklist
                          </>
                        ) : (
                          <>
                            <strong>
                              {notification.assigner[0]?.displayName}
                            </strong>{' '}
                            assigned you to a new checklist
                          </>
                        )}
                      </Typography>
                    </Box>

                    {notification.metadata.dueDate && (
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Box
                          sx={{
                            fontSize: '13px',
                            fontWeight: 'bold',
                            padding: '4px 8px',
                            borderRadius: 1,
                            bgcolor: moment(
                              notification.metadata.dueDate
                            ).isBefore(moment())
                              ? 'error.main'
                              : 'success.main',
                            color: 'white'
                          }}
                        >
                          Due date:{' '}
                          {moment(notification.metadata.dueDate).format('llll')}
                        </Box>
                      </Box>
                    )}

                    <Box sx={{ textAlign: 'right' }}>
                      <Typography
                        variant="caption"
                        sx={{ color: 'text.secondary' }}
                      >
                        {moment(notification.updatedAt).format('llll')}
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
                {index !== actionNotifications.length - 1 && <Divider />}
              </Box>
            ))}
          </Expandable>
        </Box>

        {/* ============================ INVITATION ============================ */}
        <Box sx={{ px: 2, py: 1 }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}
          >
            Board Invite Notification
          </Typography>

          {(!notifications || notifications.length === 0) && (
            <MenuItem
              sx={{
                minWidth: 200,
                maxWidth: 360,
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                color: 'text.secondary'
              }}
            >
              You do not have any new invite board notifications.
            </MenuItem>
          )}
          <Expandable size={250}>
            {notifications?.map((notification, index) => (
              <Box key={`invite-${index}`}>
                <MenuItem
                  sx={{
                    minWidth: 200,
                    maxWidth: 360,
                    '&:hover': {
                      backgroundColor: 'action.hover'
                    }
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                      width: '100%'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <GroupAddIcon fontSize="small" color="primary" />
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.primary',
                          whiteSpace: 'normal', // Cho phép xuống dòng
                          wordWrap: 'break-word', // Tự động ngắt dòng khi quá dài
                          overflowWrap: 'break-word' // Hỗ trợ ngắt dòng cho các từ dài
                        }}
                      >
                        <strong>{notification.inviter?.displayName}</strong>{' '}
                        invited you to board{' '}
                        <strong>{notification.board?.title}</strong>
                      </Typography>
                    </Box>

                    {notification.boardInvitation.status ===
                      BOARD_INVITATION_STATUS.PENDING && (
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          gap: 1
                        }}
                      >
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={() =>
                            updateBoardInvitation(
                              BOARD_INVITATION_STATUS.ACCEPTED,
                              notification._id
                            )
                          }
                        >
                          Accept
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          size="small"
                          onClick={() =>
                            updateBoardInvitation(
                              BOARD_INVITATION_STATUS.REJECTED,
                              notification._id
                            )
                          }
                        >
                          Reject
                        </Button>
                      </Box>
                    )}

                    {notification.boardInvitation.status !==
                      BOARD_INVITATION_STATUS.PENDING && (
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        {notification.boardInvitation.status ===
                        BOARD_INVITATION_STATUS.ACCEPTED ? (
                          <Chip
                            icon={<DoneIcon />}
                            label="Accepted"
                            color="success"
                            size="small"
                          />
                        ) : (
                          <Chip
                            icon={<NotInterestedIcon />}
                            label="Rejected"
                            size="small"
                          />
                        )}
                      </Box>
                    )}

                    <Box sx={{ textAlign: 'right' }}>
                      <Typography
                        variant="caption"
                        sx={{ color: 'text.secondary' }}
                      >
                        {moment(notification.createdAt).format('llll')}
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
                {index !== notifications.length - 1 && <Divider />}
              </Box>
            ))}
          </Expandable>
        </Box>
      </Menu>
    </Box>
  )
}

export default Notifications
