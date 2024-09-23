export const capitalizeFirstLetter = val => {
  if (!val) return ''
  return `${val.charAt(0).toUpperCase()}${val.slice(1)}`
}
// generate ra card de giu cho tranh th cot rong thi se bi loi
export const generatePlaceholderCard = column => {
  return {
    _id: `${column._id}-placeholder-card`,
    boardId: column.boardId,
    columnId: column._id,
    FE_PlaceholderCard: true
  }
}
