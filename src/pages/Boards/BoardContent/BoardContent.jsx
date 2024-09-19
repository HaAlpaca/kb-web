import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useEffect, useState } from 'react'

function BoardContent({ board }) {
  // yeu cau chuot di 10px ms active event, fix click goi event
  // const pointerSensor = useSensor(PointerSensor, {
  //   activationConstraint: { distance: 10 }
  // })
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 }
  })
  const touchSensor = useSensor(TouchSensor, {
    // tolerance la dung sai, tren 500 ms dung duoc but
    activationConstraint: { delay: 250, tolerance: 500 }
  })
  const sensors = useSensors(mouseSensor, touchSensor)
  const [orderedColumns, setOrderedColumns] = useState([])

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  const handleDragEnd = event => {
    console.log('handle drag end: ', event)
    const { active, over } = event
    // kiem tra ko ton tai over
    if (!over) return
    // neu vi tri keo tha khac vi tri ban dau
    if (active.id !== over.id) {
      // lay vi tri cu tu thang active
      const oldIndex = orderedColumns.findIndex(c => c._id === active.id)
      // lay vi moi cu tu thang over
      const newIndex = orderedColumns.findIndex(c => c._id === over.id)
      // xep lai mang dung arraymove cua sortable
      const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex)

      // xu li goi api
      const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
      // console.log(dndOrderedColumns)
      console.log(dndOrderedColumnsIds)
      setOrderedColumns(dndOrderedColumns)
    }
  }
  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <Box
        sx={{
          bgcolor: theme =>
            theme.palette.mode === 'dark' ? '#34495e' : '#1976d2',
          width: '100%',
          height: theme => theme.trelloCustom.boardContentHeight,
          display: 'flex',
          p: '10px 0'
        }}
      >
        {/* Board column */}

        <ListColumns columns={orderedColumns} />
      </Box>
    </DndContext>
  )
}

export default BoardContent
