import { Checkbox, Card as MuiCard } from '@mui/material'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import GroupIcon from '@mui/icons-material/Group'
import CommentIcon from '@mui/icons-material/Comment'
import AttachmentIcon from '@mui/icons-material/Attachment'
import EventIcon from '@mui/icons-material/Event'
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import EventBusyIcon from '@mui/icons-material/EventBusy'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import LabelGroup from '~/components/Label/LabelGroup'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form'
import { handleToggleCompleteCardAPI } from '~/apis'
import { useState } from 'react'
import moment from 'moment'
// import { useEffect, useState } from 'react'
// import { getBoardLabelsAPI } from '~/apis'
const calculateChecklistCompletion = checklists => {
  return checklists.reduce(
    (acc, checklist) => {
      const totalItems = checklist.items.length // Tổng số phần tử trong checklist
      const completedItems = checklist.items.filter(
        item => item.isCompleted
      ).length // Số phần tử đã hoàn thành

      // Cộng vào accumulator
      acc.total += totalItems
      acc.completed += completedItems

      return acc
    },
    { total: 0, completed: 0 } // Giá trị khởi tạo cho accumulator
  )
}

function Card({ card }) {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [isPortrait, setIsPortrait] = useState(false)
  const handleImageLoad = event => {
    const img = event.currentTarget
    setIsPortrait(img.naturalHeight > img.naturalWidth)
  }

  const { control } = useForm({
    defaultValues: {
      isComplete: card.isComplete ?? false
    }
  })

  // Tính toán tổng số phần tử và số phần tử hoàn thành
  const { total, completed } = calculateChecklistCompletion(
    card?.checklists || []
  )

  const setActiveCard = () => {
    // show modal active card
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
    opacity: isDragging ? 0.5 : control._formValues.isComplete ? 0.7 : 1
  }

  const shouldShowCardActions = () => {
    return (
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
        boxShadow: '0 1px 1px rgba(0,0,0,0.2)',
        overflow: 'unset',
        display: card?.FE_PlaceholderCard ? 'none' : 'block',
        borderRadius: '8px',
        '&:focus': {
          outline: 'none'
        },
        '&:hover': {
          borderColor: theme => {
            theme.palette.primary.main
          }
        }
      }}
    >
      {card?.cover && (
        <CardMedia
          component="img"
          sx={{
            width: isPortrait ? 'auto' : '100%',
            height: isPortrait ? 200 : 140,
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px',
            marginTop: isPortrait && '8px',
            objectFit: 'cover',
            display: 'block',
            margin: isPortrait ? '8px auto' : '0 auto'
          }}
          image={card.cover}
          title={card?.title}
          onLoad={handleImageLoad}
        />
      )}

      {card.labels?.length > 0 && <LabelGroup labels={card.labels} />}

      <CardContent
        sx={{
          px: 1.5,
          py: shouldShowCardActions() ? 0.5 : '10px !important',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          '&:hover .animated-checkbox': {
            opacity: 1,
            transform: 'translateX(0)'
          },
          '&:hover .animated-title': {
            transform: 'translateX(0)'
          }
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
                opacity: field.value ? 1 : 0,
                transform: field.value ? 'translateX(0)' : 'translateX(-20px)',
                transition: 'opacity 0.3s ease, transform 0.3s ease'
              }}
              {...field}
              checked={field.value}
              onChange={async event => {
                event.preventDefault()
                event.stopPropagation()
                field.onChange(event.target.checked)
                await handleToggleCompleteCardAPI(card._id)
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
            transform: 'translateX(-20px)',
            transition: 'transform 0.3s ease',
            ...(control._formValues.isComplete && {
              transform: 'translateX(0)'
            })
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
            justifyContent: 'flex-start', // Căn trái để các nút xuống dòng từ trái sang phải
            alignItems: 'center' // Căn giữa các nút theo chiều dọc
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
                ? `(${card?.checklists?.length} checklist)`
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
