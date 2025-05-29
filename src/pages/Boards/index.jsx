/* eslint-disable indent */
import { useState, useEffect } from 'react'
import AppBar from '~/components/AppBar/AppBar'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Unstable_Grid2'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard'
import ArchiveIcon from '@mui/icons-material/Archive'

import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Pagination from '@mui/material/Pagination'
import PaginationItem from '@mui/material/PaginationItem'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import randomColor from 'randomcolor'
import SidebarCreateBoardModal from './create'
import PublicIcon from '@mui/icons-material/Public'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import { styled } from '@mui/material/styles'
import {
  fetchBoardAPI,
  fetchPublicBoardAPI,
  fetchPrivateBoardAPI,
  fetchArchivedBoardAPI,
  joinPublicBoardAPI,
  unArchiveBoardAPI // Import API unarchive
} from '~/apis'
import { DEFAULT_ITEM_PER_PAGE, DEFAULT_PAGE } from '~/utils/constants'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'

const SidebarItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  padding: '12px 16px',
  borderRadius: '8px',
  fontSize: '1rem', // Kích thước mặc định
  '@media (max-width: 992px)': {
    fontSize: '0.875rem' // Giảm kích thước chữ trên màn hình nhỏ hơn 992px
  },
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'dark' ? '#33485D' : theme.palette.grey[300]
  },
  '&.active': {
    color: theme.palette.mode === 'dark' ? '#90caf9' : '#0c66e4',
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#e9f2ff'
  }
}))

function Boards() {
  const [boards, setBoards] = useState(null)
  const [totalBoards, setTotalBoards] = useState(null)
  const [boardType, setBoardType] = useState('all') // 'all', 'public', 'private', or 'archived'

  const currentUser = useSelector(selectCurrentUser)
  const location = useLocation()
  const navigate = useNavigate()
  const query = new URLSearchParams(location.search)
  const page = parseInt(query.get('page') || '1', 10)

  const updateStateData = res => {
    setBoards(res.boards || [])
    setTotalBoards(res.totalBoard || 0)
  }

  useEffect(() => {
    const fetchBoards = async () => {
      let apiCall
      if (boardType === 'all') {
        apiCall = fetchBoardAPI
      } else if (boardType === 'public') {
        apiCall = fetchPublicBoardAPI
      } else if (boardType === 'private') {
        apiCall = fetchPrivateBoardAPI
      } else if (boardType === 'archived') {
        apiCall = fetchArchivedBoardAPI
      }
      const res = await apiCall(location.search)
      updateStateData(res)
    }
    fetchBoards()
  }, [location.search, boardType])

  function afterCreateNewBoard() {
    const apiCall =
      boardType === 'all'
        ? fetchBoardAPI
        : boardType === 'public'
        ? fetchPublicBoardAPI
        : boardType === 'private'
        ? fetchPrivateBoardAPI
        : fetchArchivedBoardAPI
    apiCall(location.search).then(res => {
      updateStateData(res)
    })
  }

  const handleJoinBoard = async boardId => {
    await joinPublicBoardAPI(boardId).then(() => {
      navigate(`/boards/${boardId}`) // Redirect to the board page after success
    }) // Call the API to join the board
  }

  const handleUnarchiveBoard = async boardId => {
    await unArchiveBoardAPI(boardId).then(() => {
      setBoards(prevBoards => prevBoards.filter(b => b._id !== boardId)) // Loại bỏ bảng khỏi danh sách archived
      navigate(`/boards/${boardId}`) // Redirect to the board page after success
    })
  }

  if (!boards) {
    return <PageLoadingSpinner caption="Loading Boards..." />
  }

  return (
    <Container disableGutters maxWidth={false}>
      <AppBar />
      <Box
        sx={{
          paddingX: 2,
          my: '24px',
          height: 'calc(100vh - 64px - 48px)',
          overflowY: 'auto'
        }}
      >
        <Grid container spacing={2}>
          <Grid xs={12} sm={3}>
            <Stack direction="column" spacing={1}>
              <SidebarItem
                className={boardType === 'all' ? 'active' : ''}
                onClick={() => setBoardType('all')}
              >
                <SpaceDashboardIcon fontSize="small" />
                All My Boards
              </SidebarItem>
              <SidebarItem
                className={boardType === 'private' ? 'active' : ''}
                onClick={() => setBoardType('private')}
              >
                <LockOpenIcon fontSize="small" />
                Private Boards
              </SidebarItem>
              <SidebarItem
                className={boardType === 'public' ? 'active' : ''}
                onClick={() => setBoardType('public')}
              >
                <PublicIcon fontSize="small" />
                Public Boards
              </SidebarItem>
              <SidebarItem
                className={boardType === 'archived' ? 'active' : ''}
                onClick={() => setBoardType('archived')}
              >
                <ArchiveIcon fontSize="small" />
                Archived Boards
              </SidebarItem>
            </Stack>
            <Divider sx={{ my: 1 }} />
            <Stack direction="column" spacing={1}>
              <SidebarCreateBoardModal
                afterCreateNewBoard={afterCreateNewBoard}
              />
            </Stack>
          </Grid>

          <Grid xs={12} sm={9}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
              {boardType === 'all'
                ? 'All My Boards:'
                : boardType === 'public'
                ? 'Public Boards:'
                : boardType === 'private'
                ? 'Private Boards:'
                : 'Archived Boards:'}
            </Typography>

            {boards?.length === 0 && (
              <Typography variant="span" sx={{ fontWeight: 'bold', mb: 3 }}>
                No result found!
              </Typography>
            )}

            {boards?.length > 0 && (
              <Grid container spacing={2}>
                {boards.map(b => (
                  <Grid xs={2} sm={3} md={4} key={b._id}>
                    <Card
                      sx={{
                        width: '250px', // Chiều rộng mặc định
                        '@media (max-width: 1100px)': {
                          width: '230px' // Chiều rộng khi màn hình nhỏ hơn 800px
                        }
                      }}
                    >
                      {b?.cover ? (
                        <CardMedia
                          component="img"
                          height="100"
                          image={`${b.cover}?w=250`}
                          alt={`${b.title} cover`}
                        />
                      ) : (
                        <Box
                          sx={{
                            height: '100px',
                            backgroundColor: randomColor()
                          }}
                        ></Box>
                      )}

                      <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
                        <Typography gutterBottom variant="h6" component="div">
                          {b?.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {b?.description}
                        </Typography>
                        <Box
                          sx={{
                            mt: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end'
                          }}
                        >
                          {boardType === 'archived' ? (
                            <Box
                              onClick={() => handleUnarchiveBoard(b._id)} // Gọi hàm xử lý unarchive
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                color: '#f57c00',
                                cursor: 'pointer',
                                '&:hover': { color: '#fb8c00' }
                              }}
                            >
                              Unarchive <ArrowRightIcon fontSize="small" />
                            </Box>
                          ) : b.memberIds.includes(currentUser._id) ||
                            b.ownerIds.includes(currentUser._id) ? (
                            <Box
                              component={Link}
                              to={`/boards/${b._id}`}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                color: 'primary.main',
                                '&:hover': { color: 'primary.light' }
                              }}
                            >
                              Go to board <ArrowRightIcon fontSize="small" />
                            </Box>
                          ) : (
                            <Box
                              onClick={() => handleJoinBoard(b._id)}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                color: '#43a047',
                                cursor: 'pointer',
                                '&:hover': { color: '#69b36c' }
                              }}
                            >
                              Join board <ArrowRightIcon fontSize="small" />
                            </Box>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}

            {totalBoards > 0 && (
              <Box
                sx={{
                  my: 3,
                  pr: 5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start'
                }}
              >
                <Pagination
                  size="large"
                  color="secondary"
                  showFirstButton
                  showLastButton
                  count={Math.ceil(totalBoards / DEFAULT_ITEM_PER_PAGE)}
                  page={page}
                  renderItem={item => (
                    <PaginationItem
                      component={Link}
                      to={`/boards${
                        item.page === DEFAULT_PAGE ? '' : `?page=${item.page}`
                      }`}
                      {...item}
                    />
                  )}
                />
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}

export default Boards
