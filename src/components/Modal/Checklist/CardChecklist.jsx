import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Unstable_Grid2'
import { useDispatch, useSelector } from 'react-redux'
import {
  handleDeleteChecklistAPI,
  handleUpdateChecklistAPI
} from '~/apis'
import {
  fetchFilteredBoardDetailsAPI,
  selectCurrentActiveBoard
} from '~/redux/activeBoard/activeBoardSlice'
import {
  fetchCardDataAPI,
  selectCurrentActiveCard
} from '~/redux/activeCard/activeCardSlice'

import { useParams, useSearchParams } from 'react-router-dom'
import ToggleFocusInput from '~/components/Form/ToggleFocusInput'
import { socketIoInstance } from '~/socket-client'
import CardUserGroup from '../ActiveCard/CardUserGroup'
import CardCheckitem from './CardCheckitem'
import ChecklistSetDueDate from './ChecklistSetDueDate'
import ChecklistSettingModal from './ChecklistSettingModal'
function CardCheckList({ checklists, cardChecklistIds }) {
  const board = useSelector(selectCurrentActiveBoard)
  const dispatch = useDispatch()
  const activeCardModal = useSelector(selectCurrentActiveCard)
  const { boardId } = useParams()
  const [searchParams] = useSearchParams()

  const handleRefreshBoard = () => {
    dispatch(
      fetchFilteredBoardDetailsAPI({
        boardId,
        queryParams: searchParams
      })
    )
  }

  // update title
  const onUpdateChecklistTitle = async (checklistId, newTitle) => {
    await handleUpdateChecklistAPI(checklistId, {
      title: newTitle.trim()
    }).then(res => {
      handleRefreshBoard()
      dispatch(fetchCardDataAPI(activeCardModal._id))
      socketIoInstance.emit('FE_UPDATE_CHECKLIST', {
        ...res,
        boardId: board._id,
        cardId: activeCardModal._id
      })
    })
  }

  const onUpdateCheckitemTitle = async (checklistId, checkitemId, newTitle) => {
    await handleUpdateChecklistAPI(checklistId, {
      updateCheckItem: {
        _id: checkitemId,
        content: newTitle
      }
    }).then(res => {
      handleRefreshBoard()
      dispatch(fetchCardDataAPI(activeCardModal._id))
      socketIoInstance.emit('FE_UPDATE_CHECKLIST', {
        ...res,
        boardId: board._id,
        cardId: activeCardModal._id
      })
    })
  }

  // delete
  const onDeleteChecklist = async checklistId => {
    await handleDeleteChecklistAPI(checklistId).then(res => {
      dispatch(fetchCardDataAPI(activeCardModal._id))
      handleRefreshBoard()
      socketIoInstance.emit('FE_DELETE_CHECKLIST', {
        ...res,
        boardId: board._id,
        cardId: activeCardModal._id
      })
    })
  }

  const onUpdateCheckitemMembers = async (
    checklistId,
    incomingMemberInfo,
    dueDate
  ) => {
    await handleUpdateChecklistAPI(checklistId, {
      updateIncomingAssignedUser: {
        ...incomingMemberInfo,
        cardId: activeCardModal._id,
        boardId: board._id,
        dueDate: dueDate
      }
    }).then(res => {
      dispatch(fetchCardDataAPI(activeCardModal._id))
      handleRefreshBoard()
      // socketIoInstance.emit('FE_UPDATE_CHECKLIST', {
      //   ...res,
      //   boardId: board._id,
      //   cardId: activeCardModal._id
      // })
    })
    socketIoInstance.emit('FE_UPDATE_CHECKLIST', {
      boardId: board._id,
      cardId: activeCardModal._id
    })
  }

  const onUpdateChecklistDueDate = async (checklistId, dueDate) => {
    await handleUpdateChecklistAPI(checklistId, {
      dueDate
    }).then(res => {
      dispatch(fetchCardDataAPI(activeCardModal._id))
      handleRefreshBoard()
    })
    socketIoInstance.emit('FE_UPDATE_CHECKLIST', {
      boardId: board._id,
      cardId: activeCardModal._id
    })
  }

  const onDeleteCheckitem = async (checklistId, checkitemId) => {
    await handleUpdateChecklistAPI(checklistId, {
      deleteCheckItemId: checkitemId
    }).then(res => {
      dispatch(fetchCardDataAPI(activeCardModal._id))
      handleRefreshBoard()
      socketIoInstance.emit('FE_UPDATE_CHECKLIST', {
        ...res,
        boardId: board._id,
        cardId: activeCardModal._id
      })
    })
  }

  const onToggleCheckitemStatus = async (
    checklistId,
    checkitemId,
    isCompleted
  ) => {
    await handleUpdateChecklistAPI(checklistId, {
      updateCheckItem: {
        _id: checkitemId,
        isCompleted
      }
    }).then(res => {
      dispatch(fetchCardDataAPI(activeCardModal._id))
      handleRefreshBoard()
      socketIoInstance.emit('FE_UPDATE_CHECKLIST', {
        ...res,
        boardId: board._id,
        cardId: activeCardModal._id
      })
    })
  }
  const onCreateNewCheckItem = (checklistId, content) => {
    handleUpdateChecklistAPI(checklistId, {
      createCheckItem: {
        content
      }
    }).then(res => {
      dispatch(fetchCardDataAPI(activeCardModal._id))
      handleRefreshBoard()
      socketIoInstance.emit('FE_UPDATE_CHECKLIST', {
        ...res,
        boardId: board._id,
        cardId: activeCardModal._id
      })
    })
  }

  // const onCreateNewChecklist = async (title, cardId) => {
  //   await handleCreateChecklistAPI({ title, cardId }).then(res => {
  //     const newActiveCardModal = cloneDeep(activeCardModal)
  //     newActiveCardModal.cardChecklistIds.push(res._id)
  //     newActiveCardModal.checklists.push(res)
  //     dispatch(updateCurrentActiveCard(newActiveCardModal))

  //     const newBoard = cloneDeep(board)
  //     newBoard.columns.forEach(column => {
  //       column.cards.forEach(card => {
  //         if (card._id === cardId) {
  //           card.cardChecklistIds.push(res._id)
  //           card.checklists.push(res)
  //         }
  //       })
  //     })
  //     dispatch(updateCurrentActiveBoard(newBoard))
  //   })
  // }

  const calculateChecklistProgress = checklist => {
    const total = checklist.items.length
    const checked = checklist.items.filter(item => item.isCompleted).length
    return total === 0 ? 0 : Math.round((checked / total) * 100)
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          mb: 2
        }}
      >
        <CheckBoxOutlinedIcon />
        <Typography variant="span" sx={{ fontWeight: '600', fontSize: '20px' }}>
          Checklist
        </Typography>
      </Box>

      <Grid container spacing={1} sx={{ ml: 2 }} gap={1}>
        {checklists.map((checklist, index) => {
          const progress = calculateChecklistProgress(checklist)
          return (
            <Grid
              xs={12}
              sm={12}
              key={index}
              sx={{
                borderRadius: '8px',
                padding: '10px',
                bgcolor: theme =>
                  theme.palette.mode === 'dark' ? '#33485d' : '#ebecf0'
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  justifyContent: 'center'
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <ToggleFocusInput
                    inputFontSize="16px"
                    value={checklist.title}
                    onChangedValue={newTitle =>
                      onUpdateChecklistTitle(checklist._id, newTitle)
                    }
                  />

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ChecklistSettingModal
                      cardChecklistIds={cardChecklistIds}
                      checklist={checklist}
                      onDeleteChecklist={onDeleteChecklist}
                    />
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1,
                    paddingLeft: '2px',
                    paddingRight: '6px'
                  }}
                >
                  <ChecklistSetDueDate
                    checklist={checklist}
                    progress={progress}
                    onChangeDate={onUpdateChecklistDueDate}
                  />

                  {checklist.items.length > 0 && (
                    <Box>
                      {/* <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                          '.MuiLinearProgress-bar': {
                            transition: 'transform 0.2s ease-in-out'
                          }
                        }}
                      /> */}
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{ color: 'text.secondary' }}
                        >
                          {`${Math.round(progress)}%`}
                        </Typography>
                      </Box>
                    </Box>
                  )}

                  <CardUserGroup
                    cardMemberIds={checklist.assignedUserIds}
                    onUpdateCardMembers={incomingMemberInfo =>
                      onUpdateCheckitemMembers(
                        checklist._id,
                        incomingMemberInfo,
                        checklist.dueDate
                      )
                    }
                  />
                </Box>

                <CardCheckitem
                  checklist={checklist}
                  onUpdateCheckitemTitle={onUpdateCheckitemTitle}
                  onToggleCheckitemStatus={onToggleCheckitemStatus}
                  onCreateNewCheckItem={onCreateNewCheckItem}
                  onDeleteCheckitem={onDeleteCheckitem}
                />
              </Box>
            </Grid>
          )
        })}
      </Grid>
    </Box>
  )
}

export default CardCheckList
