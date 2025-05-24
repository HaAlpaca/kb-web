import { Checkbox, Card as MuiCard } from '@mui/material'
import Button from '@mui/material/Button'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import AttachmentIcon from '@mui/icons-material/Attachment'
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined'
import CommentIcon from '@mui/icons-material/Comment'
import EventIcon from '@mui/icons-material/Event'
import GroupIcon from '@mui/icons-material/Group'

import moment from 'moment'
import { useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { handleToggleCompleteCardAPI } from '~/apis'
import LabelGroup from '~/components/Label/LabelGroup'
import { fetchBoardDetailsAPI } from '~/redux/activeBoard/activeBoardSlice'
import { useDispatch } from 'react-redux'
import { socketIoInstance } from '~/socket-client'
import { getOptimizedImageUrl } from '~/utils/formatters'

const calculateChecklistCompletion = checklists => {
  return checklists.reduce(
    (acc, checklist) => {
      const totalItems = checklist.items.length
      const completedItems = checklist.items.filter(
        item => item.isCompleted
      ).length
      acc.total += totalItems
      acc.completed += completedItems
      return acc
    },
    { total: 0, completed: 0 }
  )
}

function Card({ card }) {
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [isPortrait, setIsPortrait] = useState(false)
  const handleImageLoad = event => {
    const img = event.currentTarget
    setIsPortrait(img.naturalHeight > img.naturalWidth) // Xác định ảnh dọc hay ngang
  }

  const { control } = useForm({
    defaultValues: {
      isComplete: card.isComplete ?? false
    }
  })

  const watchIsComplete = useWatch({ control, name: 'isComplete' })
  const { total, completed } = calculateChecklistCompletion(
    card?.checklists || []
  )

  const setActiveCard = () => {
    searchParams.set('cardModal', card._id)
    navigate(`?${searchParams.toString()}`, { replace: false })
  }

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: card._id, data: { ...card } })

  const dndKitCardStyle = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : watchIsComplete ? 0.8 : 1
  }

  const shouldShowCardActions = () => {
    return (
      !!card?.checklists?.length ||
      !!card?.dueDate ||
      !!card?.labels?.length ||
      !!card?.memberIds?.length ||
      !!card?.comments?.length ||
      !!card?.cardAttachmentIds?.length
    )
  }

  return (
    <MuiCard
      onClick={setActiveCard}
      ref={setNodeRef}
      style={dndKitCardStyle}
      {...attributes}
      {...listeners}
      sx={{
        cursor: 'pointer',
        boxShadow: watchIsComplete ? 'none' : '0 1px 1px rgba(0,0,0,0.15)',
        overflow: 'unset',
        display: card?.FE_PlaceholderCard ? 'none' : 'block',
        borderRadius: '8px',
        '&:focus': { outline: 'none' },
        '&:hover .animated-checkbox': {
          opacity: 1,
          transform: 'translateX(0)'
        },
        '&:hover .animated-title': {
          transform: 'translateX(0)'
        }
      }}
    >
      {card?.cover && (
        <CardMedia
          component="img"
          sx={{
            width: isPortrait ? 130 : '100%',
            height: isPortrait ? 200 : 140,
            borderTopLeftRadius: isPortrait ? '0px' : '8px',
            borderTopRightRadius: isPortrait ? '0px' : '8px',
            objectFit: 'cover',
            display: 'block',
            margin: '0 auto'
          }}
          image={getOptimizedImageUrl(card.cover)}
          title={card?.title}
          onLoad={handleImageLoad}
        />
      )}

      {card.labels?.length > 0 && <LabelGroup labels={card.labels} />}

      <CardContent
        sx={{
          px: 1.5,
          py: shouldShowCardActions() ? '2px !important' : '10px !important',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start'
        }}
      >
        <Controller
          name="isComplete"
          control={control}
          render={({ field }) => (
            <Checkbox
              color="success"
              className="animated-checkbox"
              size="small"
              sx={{
                p: 0.5,
                opacity: watchIsComplete ? 1 : 0,
                transform: watchIsComplete
                  ? 'translateX(0)'
                  : 'translateX(-20px)',
                // transition: 'opacity 0.3s ease, transform 0.3s ease'
              }}
              {...field}
              checked={watchIsComplete}
              onClick={e => e.stopPropagation()}
              onChange={async event => {
                field.onChange(event.target.checked)
                await handleToggleCompleteCardAPI(card._id).then(() => {
                  dispatch(fetchBoardDetailsAPI(card.boardId))
                  socketIoInstance.emit('FE_UPDATE_CARD', {
                    boardId: card.boardId,
                    updatedCard: card
                  })
                })
              }}
            />
          )}
        />
        <Typography
          className="animated-title"
          variant="subtitle2"
          sx={{
            fontWeight: '600',
            opacity: 1,
            transform: watchIsComplete ? 'translateX(0)' : 'translateX(-20px)',
            // transition: 'transform 0.3s ease'
          }}
        >
          {card?.title}
        </Typography>
      </CardContent>

      {shouldShowCardActions() && (
        <CardActions
          sx={{
            p: '0 4px 8px 4px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '4px',
            justifyContent: 'flex-start',
            alignItems: 'center'
          }}
        >
          {!!card?.memberIds?.length && (
            <Button size="small" startIcon={<GroupIcon />}>
              {card.memberIds.length}
            </Button>
          )}
          {!!card?.comments?.length && (
            <Button size="small" startIcon={<CommentIcon />}>
              {card.comments.length}
            </Button>
          )}
          {!!card?.cardAttachmentIds?.length && (
            <Button size="small" startIcon={<AttachmentIcon />}>
              {card.cardAttachmentIds.length}
            </Button>
          )}
          {!!card?.checklists?.length > 0 && (
            <Button size="small" startIcon={<CheckBoxOutlinedIcon />}>
              {completed}/{total}{' '}
              {card?.checklists?.length > 1
                ? `(${card?.checklists?.length} checklists)`
                : ''}
            </Button>
          )}
          {!!card?.dueDate && (
            <Button size="small" startIcon={<EventIcon />}>
              {moment(card.dueDate).format('HH:mm dddd MM/DD/YYYY')}
            </Button>
          )}
        </CardActions>
      )}
    </MuiCard>
  )
}

export default Card
