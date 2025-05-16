import { useState } from 'react'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import Popover from '@mui/material/Popover'
import AddIcon from '@mui/icons-material/Add'
import Badge from '@mui/material/Badge'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useSelector } from 'react-redux'
import { selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { CARD_MEMBER_ACTION } from '~/utils/constants'
function CardUserGroup({
  cardMemberIds = [],
  onUpdateCardMembers,
  isShowAddMember = true,
  ...props
}) {
  /**
   * Xử lý Popover để ẩn hoặc hiện toàn bộ user trên một cái popup, tương tự docs để tham khảo ở đây:
   * https://mui.com/material-ui/react-popover/
   */

  const [anchorPopoverElement, setAnchorPopoverElement] = useState(null)
  const isOpenPopover = Boolean(anchorPopoverElement)
  const popoverId = isOpenPopover ? 'card-all-users-popover' : undefined
  // const dispatch = useDispatch()
  // lấy toàn bộ thông tin active board qua fe_alluser
  const board = useSelector(selectCurrentActiveBoard)
  // thành viên trong card là tập con thành viên trong board,
  // dựa vào thành viên của board để hiển thị và có các option thêm xoá user trong card
  const FE_CardMembers = board.FE_allUsers?.filter(user =>
    cardMemberIds.includes(user._id)
  )
  // console.log('FE_CardMembers: ', FE_CardMembers)
  // console.log('cardMemberIds', cardMemberIds)
  // console.log(board.FE_allUsers)

  const handleUpdateCardMembers = user => {
    // console.log(user)
    // tạo biến icomingmembersInfo để truyên id và status loại bỏ hay thêm user
    const incomingMemberInfo = {
      userId: user._id,
      action: cardMemberIds.includes(user._id)
        ? CARD_MEMBER_ACTION.REMOVE
        : CARD_MEMBER_ACTION.ADD
    }
    // console.log(incomingMemberInfo)
    onUpdateCardMembers(incomingMemberInfo)
  }

  const handleTogglePopover = event => {
    if (!anchorPopoverElement) setAnchorPopoverElement(event.currentTarget)
    else setAnchorPopoverElement(null)
  }

  // Lưu ý ở đây chúng ta không dùng Component AvatarGroup của MUI bởi nó không hỗ trợ tốt trong việc chúng ta cần custom & trigger xử lý phần tử tính toán cuối, đơn giản là cứ dùng Box và CSS - Style đám Avatar cho chuẩn kết hợp tính toán một chút thôi.
  return (
    <Box sx={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
      {/* Hiển thị các user là thành viên của card */}
      {FE_CardMembers.map((user, index) => (
        <Tooltip title="Đổi sang moderator" key={index}>
          <Avatar
            sx={{ width: 34, height: 34 }}
            alt={user.displayName}
            src={user.avatar}
          />
        </Tooltip>
      ))}

      {isShowAddMember && (
        <>
          {/* Nút này để mở popover thêm member */}
          <Tooltip title="Add new member">
            <Box
              aria-describedby={popoverId}
              onClick={handleTogglePopover}
              sx={{
                width: 36,
                height: 36,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: '600',
                borderRadius: '50%',
                color: theme =>
                  theme.palette.mode === 'dark' ? '#90caf9' : '#172b4d',
                bgcolor: theme =>
                  theme.palette.mode === 'dark'
                    ? '#2f3542'
                    : theme.palette.grey[200],
                '&:hover': {
                  color: theme =>
                    theme.palette.mode === 'dark' ? '#000000de' : '#0c66e4',
                  bgcolor: theme =>
                    theme.palette.mode === 'dark' ? '#90caf9' : '#e9f2ff'
                }
              }}
              {...props}
            >
              <AddIcon fontSize="small" />
            </Box>
          </Tooltip>

          {/* Khi Click vào + ở trên thì sẽ mở popover hiện toàn bộ users trong board để người dùng Click chọn thêm vào card  */}
          <Popover
            id={popoverId}
            open={isOpenPopover}
            anchorEl={anchorPopoverElement}
            onClose={handleTogglePopover}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          >
            <Box
              sx={{
                p: 2,
                maxWidth: '260px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1.5
              }}
            >
              {board.FE_allUsers.map((user, index) => (
                <Tooltip title={user.displayName} key={index}>
                  {/* Cách làm Avatar kèm badge icon: https://mui.com/material-ui/react-avatar/#with-badge */}
                  <Badge
                    sx={{ cursor: 'pointer' }}
                    overlap="rectangular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      cardMemberIds.includes(user._id) ? (
                        <CheckCircleIcon
                          fontSize="small"
                          sx={{ color: '#27ae60' }}
                        />
                      ) : null
                    }
                    onClick={() => handleUpdateCardMembers(user)}
                  >
                    <Avatar
                      sx={{ width: 34, height: 34 }}
                      alt={user.displayName}
                      src={user.avatar}
                    />
                  </Badge>
                </Tooltip>
              ))}
            </Box>
          </Popover>
        </>
      )}
    </Box>
  )
}

export default CardUserGroup
