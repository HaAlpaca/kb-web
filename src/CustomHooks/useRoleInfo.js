import { useMemo } from 'react'

const useRoleInfo = (board, userId) => {
  const { allMembers = [], ownerIds = [] } = board || {}

  const roleInfo = useMemo(() => {
    const currentUser = allMembers.find(user => user._id === userId)
    const isOwner = ownerIds.includes(userId)
    const isAdmin = currentUser?.boardRole === 'admin'
    const isModerator = currentUser?.boardRole === 'moderator'
    const isUser = currentUser?.boardRole === 'user'
    const userIndex = allMembers.findIndex(user => user._id === userId)
    const ownerIndex = ownerIds.findIndex(id => id === userId)

    return {
      isOwner,
      isAdmin,
      currentUserRole: currentUser?.boardRole || 'user',
      userIndex,
      ownerIndex,
      ownerIds,
      allMembers,
      isModerator,
      isUser
    }
  }, [allMembers, ownerIds, userId])

  return roleInfo
}

export default useRoleInfo
