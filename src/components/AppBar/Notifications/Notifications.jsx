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
    if (metadata.ownerTargetType === OWNER_ACTION_TARGET.CARD) {
      navigate(`/boards/${boardId}?cardModal=${metadata.ownerTargetId}`)
    } else {
      navigate(`/boards/${boardId}`)
    }
    handleClose()
  }

  useEffect(() => {
    dispatch(fetchInvitationsAPI())
    dispatch(fetchActionsAPI())

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
            sx={{ color: newNotifications ? 'yellow' : 'white' }}
          />
        </Badge>
      </Tooltip>

      <Menu
        sx={{ mt: 2 }}
        id="basic-notification-drop-down"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ 'aria-labelledby': 'basic-button-open-notification' }}
      >
        {/* ============================ ASSIGNMENT ============================ */}
        <Box sx={{ px: 1.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            Board Assignment Notification
          </Typography>

          {(!actionNotifications || actionNotifications.length === 0) && (
            <MenuItem
              sx={{
                minWidth: 200,
                maxWidth: 360,
                whiteSpace: 'normal',
                wordBreak: 'break-word'
              }}
            >
              You do not have any new assignment notifications.
            </MenuItem>
          )}

          {actionNotifications?.map((notification, index) => (
            <Box key={`action-${index}`}>
              <MenuItem
                sx={{ minWidth: 200, maxWidth: 360 }}
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
                    <AssignmentIcon fontSize="small" />
                    {notification.type === ACTION_TYPES.ASSIGN_CARD && (
                      <Typography variant="body2">
                        {notification.assignerId === notification.assigneeId ? (
                          'You have a new card assigned'
                        ) : (
                          <>
                            <strong>
                              {notification.assigner[0]?.displayName}
                            </strong>{' '}
                            assigned you in new card
                          </>
                        )}
                      </Typography>
                    )}
                    {notification.type === ACTION_TYPES.ASSIGN_CHECKLIST && (
                      <Typography variant="body2">
                        {notification.assignerId === notification.assigneeId ? (
                          'You have a new checklist assigned'
                        ) : (
                          <>
                            <strong>
                              {notification.assigner[0]?.displayName}
                            </strong>{' '}
                            assigned you in new checklist
                          </>
                        )}
                      </Typography>
                    )}
                  </Box>

                  {notification.metadata.dueDate && (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          bgcolor: moment(
                            notification.metadata.dueDate
                          ).isBefore(moment())
                            ? 'error.main'
                            : 'success.main'
                        }}
                      >
                        {moment(notification.metadata.dueDate).format('llll')}
                      </Button>
                    </Box>
                  )}

                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="caption">
                      {moment(notification.createAt).format('llll')}
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
              {index !== actionNotifications.length - 1 && <Divider />}
            </Box>
          ))}
        </Box>

        {/* ============================ INVITATION ============================ */}
        <Box sx={{ px: 1.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            Board Invite Notification
          </Typography>

          {(!notifications || notifications.length === 0) && (
            <MenuItem
              sx={{
                minWidth: 200,
                maxWidth: 360,
                whiteSpace: 'normal',
                wordBreak: 'break-word'
              }}
            >
              You do not have any new invite board notifications.
            </MenuItem>
          )}

          {notifications?.map((notification, index) => (
            <Box key={`invite-${index}`}>
              <MenuItem sx={{ minWidth: 200, maxWidth: 360 }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    width: '100%'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <GroupAddIcon fontSize="small" />
                    <Typography variant="body2">
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
                    <Typography variant="caption">
                      {moment(notification.createAt).format('llll')}
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
              {index !== notifications.length - 1 && <Divider />}
            </Box>
          ))}
        </Box>
      </Menu>
    </Box>
  )
}

export default Notifications
