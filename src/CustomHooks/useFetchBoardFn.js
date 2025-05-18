import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useParams, useSearchParams } from 'react-router-dom'
import { fetchFilteredBoardDetailsAPI } from '~/redux/activeBoard/activeBoardSlice'

function useFetchBoardFn() {
  const dispatch = useDispatch()
  const { boardId } = useParams() // Lấy boardId từ URL
  const [searchParams] = useSearchParams() // Lấy query parameters từ URL

  // Hàm để fetch dữ liệu, được memoize bằng useCallback
  const fetchBoardDetails = useCallback(() => {
    if (boardId) {
      const queryParams = Object.fromEntries([...searchParams]) // Chuyển đổi searchParams thành object
      dispatch(fetchFilteredBoardDetailsAPI({ boardId, queryParams }))
    }
  }, [dispatch, boardId, searchParams]) // Chỉ tạo lại hàm khi dispatch, boardId hoặc searchParams thay đổi

  return fetchBoardDetails
}

export default useFetchBoardFn
