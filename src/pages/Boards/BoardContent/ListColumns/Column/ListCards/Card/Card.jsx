import { Card as MuiCard } from '@mui/material'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import GroupIcon from '@mui/icons-material/Group'
import CommentIcon from '@mui/icons-material/Comment'
import AttachmentIcon from '@mui/icons-material/Attachment'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useDispatch } from 'react-redux'
import {
  showModalActiveCard,
  updateCurrentActiveCard
} from '~/redux/activeCard/activeCardSlice'
import LabelGroup from '~/components/Label/LabelGroup'

const labels = [
  { id: 1, color: '#C2F0D0', title: 'Label 1' },
  { id: 2, color: '#4BC99F', title: 'Label 2' },
  { id: 3, color: '#10754C', title: 'Label 3' },
  { id: 4, color: '#FBE9A0', title: 'Label 4' },
  { id: 5, color: '#FFD74B', title: 'Label 5' },
  { id: 6, color: '#8C6B00', title: 'Label 6' },
  { id: 7, color: '#FFE2CF', title: 'Label 7' },
  { id: 8, color: '#FFA160', title: 'Label 8' },
  { id: 9, color: '#F66A66', title: 'Label 9' },
  { id: 10, color: '#A085E6', title: 'Label 10' },
  { id: 11, color: '#A18AFF', title: 'Label 11' },
  { id: 12, color: '#4E97FF', title: 'Label 12' },
  { id: 13, color: '#7ECDE6', title: 'Label 13' },
  { id: 14, color: '#94C950', title: 'Label 14' },
  { id: 15, color: '#E678B6', title: 'Label 15' }
]

function Card({ card }) {
  const dispatch = useDispatch()

  const setActiveCard = () => {
    dispatch(updateCurrentActiveCard(card))
    // show modal active card
    dispatch(showModalActiveCard())
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
  const dndKitCardStyle = {
    // touchAction: 'none',
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    border: isDragging ? '2px solid #B1F0F7' : undefined
  }
  const shouldShowCardActions = () => {
    return (
      !!card?.memberIds?.length ||
      !!card?.comments?.length ||
      !!card?.attachments?.length
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
      {card?.cover && (
        <CardMedia
          sx={{
            height: 140,
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px'
          }}
          image={card.cover}
          title="green iguana"
        />
      )}
      {/* <LabelGroup labels={labels} /> */}

      <CardContent
        sx={{ p: 1.5, py: 0.5, '&:last-child': { px: 1.5, py: 0.5 } }}
      >
        <Typography>{card?.title}</Typography>
      </CardContent>

      {shouldShowCardActions() && (
        <CardActions sx={{ p: '0 4px 8px 4px' }}>
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
          {!!card?.attachments?.length && (
            <Button size="small" startIcon={<AttachmentIcon />}>
              {card.attachments.length}
            </Button>
          )}
        </CardActions>
      )}
    </MuiCard>
  )
}

export default Card
