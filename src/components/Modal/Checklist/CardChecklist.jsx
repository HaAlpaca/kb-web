import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Unstable_Grid2'
import { cloneDeep } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import {
  handleCreateChecklistAPI,
  handleDeleteChecklistAPI,
  handleUpdateChecklistAPI
} from '~/apis'
import {
  selectCurrentActiveBoard,
  updateCurrentActiveBoard
} from '~/redux/activeBoard/activeBoardSlice'
import {
  selectCurrentActiveCard,
  updateCurrentActiveCard
} from '~/redux/activeCard/activeCardSlice'

import { LinearProgress } from '@mui/material'
import ToggleFocusInput from '~/components/Form/ToggleFocusInput'
import CardCheckitem from './CardCheckitem'
import ChecklistSettingModal from './ChecklistSettingModal'

function CardCheckList({ checklists, cardChecklistIds }) {
  const board = useSelector(selectCurrentActiveBoard)
  const dispatch = useDispatch()
  const activeCardModal = useSelector(selectCurrentActiveCard)

  // update title
  const onUpdateChecklistTitle = async (checklistId, newTitle) => {
    await handleUpdateChecklistAPI(checklistId, {
      title: newTitle.trim()
    })
    const newActiveCardModal = cloneDeep(activeCardModal)
    newActiveCardModal.checklists.forEach(checklist => {
      if (checklist._id === checklistId) {
        checklist.title = newTitle
      }
    })
    dispatch(updateCurrentActiveCard(newActiveCardModal))
  }

  const onUpdateCheckitemTitle = async (checklistId, checkitemId, newTitle) => {
    await handleUpdateChecklistAPI(checklistId, {
      updateCheckItem: {
        _id: checkitemId,
        content: newTitle
      }
    })
    const newActiveCardModal = cloneDeep(activeCardModal)
    newActiveCardModal.checklists.forEach(checklist => {
      if (checklist._id === checklistId) {
        checklist.items.forEach(item => {
          if (item._id === checkitemId) {
            item.content = newTitle
          }
        })
      }
    })
    dispatch(updateCurrentActiveCard(newActiveCardModal))
  }

  // delete
  const onDeleteChecklist = async checklistId => {
    await handleDeleteChecklistAPI(checklistId).then(res => {
      const newActiveCardModal = cloneDeep(activeCardModal)
      newActiveCardModal.checklists = newActiveCardModal.checklists.filter(
        checklist => checklist._id !== checklistId
      )
      newActiveCardModal.cardChecklistIds =
        newActiveCardModal.cardChecklistIds.filter(
          checklist => checklist._id !== checklistId
        )
      dispatch(updateCurrentActiveCard(newActiveCardModal))

      const newBoard = cloneDeep(board)
      newBoard.columns.forEach(column => {
        column.cards.forEach(card => {
          if (card._id === res.cardId) {
            card.checklists = card.checklists.filter(
              checklist => checklist._id !== checklistId
            )
            card.cardChecklistIds = card.cardChecklistIds.filter(
              _id => _id !== checklistId
            )
          }
        })
      })
      dispatch(updateCurrentActiveBoard(newBoard))
    })
  }

  const onUpdateCheckitemMembers = async (
    checklistId,
    checkItemId,
    incomingMemberInfo
  ) => {
    // console.log(incomingMemberInfo)
    await handleUpdateChecklistAPI(checklistId, {
      updateIncomingAssignedUser: {
        _id: checkItemId,
        incomingInfo: incomingMemberInfo
      }
    }).then(res => {
      const newActiveCardModal = cloneDeep(activeCardModal)
      newActiveCardModal.checklists = newActiveCardModal.checklists.map(cl => {
        if (cl._id === checklistId) return res
        return cl
      })

      dispatch(updateCurrentActiveCard(newActiveCardModal))
    })
  }

  const onUpdateCheckitemDueDate = async (
    checklistId,
    checkitemId,
    dueDate
  ) => {
    await handleUpdateChecklistAPI(checklistId, {
      updateCheckItem: {
        _id: checkitemId,
        dueDate
      }
    }).then(res => {
      const newActiveCardModal = cloneDeep(activeCardModal)
      newActiveCardModal.checklists = newActiveCardModal.checklists.map(cl => {
        if (cl._id === checklistId) return res
        return cl
      })
      dispatch(updateCurrentActiveCard(newActiveCardModal))
    })
  }

  const onDeleteCheckitem = async (checklistId, checkitemId) => {
    await handleUpdateChecklistAPI(checklistId, {
      deleteCheckItemId: checkitemId
    }).then(res => {
      const newActiveCardModal = cloneDeep(activeCardModal)
      newActiveCardModal.checklists.forEach(checklist => {
        if (checklist._id === checklistId) {
          checklist.items = checklist.items.filter(
            item => item._id !== checkitemId
          )
        }
      })

      dispatch(updateCurrentActiveCard(newActiveCardModal))

      const newBoard = cloneDeep(board)
      newBoard.columns.forEach(column => {
        column.cards.forEach(card => {
          if (card._id === res.cardId) {
            card.checklists.forEach(checklist => {
              if (checklist._id === checklistId) {
                checklist.items = checklist.items.filter(
                  item => item._id !== checkitemId
                )
              }
            })
          }
        })
      })
      dispatch(updateCurrentActiveBoard(newBoard))
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
    })
    const newActiveCardModal = cloneDeep(activeCardModal)
    newActiveCardModal.checklists.forEach(checklist => {
      checklist.items.forEach(item => {
        if (item._id === checkitemId) {
          item.isCompleted = isCompleted
        }
      })
    })

    dispatch(updateCurrentActiveCard(newActiveCardModal))

    const newBoard = cloneDeep(board)
    newBoard.columns.forEach(column => {
      column.cards.forEach(card => {
        if (card._id === activeCardModal._id) {
          card.checklists.forEach(checklist => {
            checklist.items.forEach(item => {
              if (item._id === checkitemId) {
                item.isCompleted = isCompleted
              }
            })
          })
        }
      })
    })
    dispatch(updateCurrentActiveBoard(newBoard))
  }
  const onCreateNewCheckItem = (checklistId, content) => {
    handleUpdateChecklistAPI(checklistId, {
      createCheckItem: {
        content
      }
    }).then(res => {
      // Cập nhật checklist trong activeCardModal
      const newActiveCardModal = cloneDeep(activeCardModal)
      newActiveCardModal.checklists = newActiveCardModal.checklists.map(cl => {
        if (cl._id === checklistId) return res
        return cl
      })

      dispatch(updateCurrentActiveCard(newActiveCardModal))

      // Cập nhật checklist trong board
      const newBoard = cloneDeep(board)
      newBoard.columns.forEach(column => {
        column.cards.forEach(card => {
          if (card._id === activeCardModal._id) {
            card.checklists = card.checklists.map(cl => {
              if (cl._id === checklistId) return res
              return cl
            })
          }
        })
      })

      dispatch(updateCurrentActiveBoard(newBoard))
    })
  }

  const onCreateNewChecklist = async (title, cardId) => {
    await handleCreateChecklistAPI({ title, cardId }).then(res => {
      const newActiveCardModal = cloneDeep(activeCardModal)
      newActiveCardModal.cardChecklistIds.push(res._id)
      newActiveCardModal.checklists.push(res)
      dispatch(updateCurrentActiveCard(newActiveCardModal))

      const newBoard = cloneDeep(board)
      newBoard.columns.forEach(column => {
        column.cards.forEach(card => {
          if (card._id === cardId) {
            card.cardChecklistIds.push(res._id)
            card.checklists.push(res)
          }
        })
      })
      dispatch(updateCurrentActiveBoard(newBoard))
    })
  }

  const calculateChecklistProgress = checklist => {
    const total = checklist.items.length
    const checked = checklist.items.filter(item => item.isCompleted).length
    return total === 0 ? 0 : Math.round((checked / total) * 100)
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
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
                padding: '10px'
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

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: '100%', mr: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={progress}
                      sx={{
                        '.MuiLinearProgress-bar': {
                          transition: 'transform 0.2s ease-in-out'
                        }
                      }}
                    />
                  </Box>
                  <Box sx={{ minWidth: 35 }}>
                    <Typography
                      variant="body2"
                      sx={{ color: 'text.secondary' }}
                    >
                      {`${Math.round(progress)}%`}
                    </Typography>
                  </Box>
                </Box>
                <CardCheckitem
                  checklist={checklist}
                  onUpdateCheckitemTitle={onUpdateCheckitemTitle}
                  onToggleCheckitemStatus={onToggleCheckitemStatus}
                  onCreateNewCheckItem={onCreateNewCheckItem}
                  onUpdateCheckitemMembers={onUpdateCheckitemMembers}
                  onUpdateCheckitemDueDate={onUpdateCheckitemDueDate}
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
