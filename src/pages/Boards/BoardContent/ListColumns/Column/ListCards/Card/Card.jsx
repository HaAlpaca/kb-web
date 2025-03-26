import { Card as MuiCard } from '@mui/material'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import GroupIcon from '@mui/icons-material/Group'
import CommentIcon from '@mui/icons-material/Comment'
import AttachmentIcon from '@mui/icons-material/Attachment'
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import LabelGroup from '~/components/Label/LabelGroup'
import { useNavigate, useSearchParams } from 'react-router-dom'
// import { useEffect, useState } from 'react'
// import { getBoardLabelsAPI } from '~/apis'

function Card({ card }) {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
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

  // https://github.com/clauderic/dnd-kit/issues/117
  // The items are stretched because you're using CSS.Transform.toString(),
  // use CSS.Translate.toString() if you don't want to have the scale transformation applied.
  // tạm tắt transition vì lag
  const dndKitCardStyle = {
    // touchAction: 'none',
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined
    // border: isDragging ? '2px solid #B1F0F7' : undefined
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
        // border: '4px solid transparent',
        borderRadius: '8px',
        '&:hover': {
          // theme.palette.primary.main undefined
          borderColor: theme => {
            theme.palette.primary.main
          }
        }
        // overflow: card?.FE_PlaceholderCard ? 'hidden' : 'unset',
        // height: card?.FE_PlaceholderCard ? '0px' : 'unset'
      }}
    >
      {/* COVER */}
      {card?.cover && (
        <CardMedia
          sx={{
            height: 140,
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px'
          }}
          image={card.cover}
          title={card?.title}
        />
      )}
      {/* LABELs */}
      {card.labels?.length > 0 && <LabelGroup labels={card.labels} />}
      {/* TITLE */}
      <CardContent sx={{ px: 1.5, py: 0.5 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: '600' }}>
          {card?.title}
        </Typography>
      </CardContent>
      {shouldShowCardActions() && (
        <>
          <CardActions
            sx={{
              p: '0 4px 8px 4px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '4px'
            }}
          >
            {/* !! kiem tra gt boolean */}
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
            <Button size="small" startIcon={<CheckBoxOutlinedIcon />}>
              1/10 (test ui)
            </Button>
          </CardActions>
        </>
      )}
    </MuiCard>
  )
}

export default Card
