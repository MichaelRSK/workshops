import { useEffect, useState } from 'react'
import {
  Alert,
  AppBar,
  Box,
  Button,
  CircularProgress,
  Container,
  Toolbar,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import NoticeBoard from './components/NoticeBoard'
import NoticeForm from './components/NoticeForm'
import { createNotice, deleteNotice, getNotices, updateNotice } from './api'

export default function App() {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formOpen, setFormOpen] = useState(false)

  useEffect(() => {
    loadNotices()
  }, [])

  async function loadNotices() {
    try {
      setLoading(true)
      setError('')
      const data = await getNotices()
      setNotices(data.notices || [])
    } catch (err) {
      setError(`Failed to load notices: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate(notice) {
    try {
      setError('')
      const data = await createNotice(notice)
      setNotices((current) => [data.notice, ...current])
      setFormOpen(false)
    } catch (err) {
      setError(`Failed to create notice: ${err.message}`)
    }
  }

  async function handleTogglePinned(notice) {
    try {
      const pinned = !notice.pinned
      await updateNotice(notice.id, { pinned })
      setNotices((current) =>
        current.map((item) => item.id === notice.id ? { ...item, pinned } : item),
      )
    } catch (err) {
      setError(`Failed to update notice: ${err.message}`)
    }
  }

  async function handleDelete(id) {
    try {
      await deleteNotice(id)
      setNotices((current) => current.filter((notice) => notice.id !== id))
    } catch (err) {
      setError(`Failed to delete notice: ${err.message}`)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6f8' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5" fontWeight="bold" sx={{ flexGrow: 1 }}>
            Notification Board
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={() => setFormOpen(true)}
          >
            Add Notice
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Community Notices
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Post announcements, reminders, events, and important updates.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {loading ? (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress />
          </Box>
        ) : (
          <NoticeBoard
            notices={notices}
            onTogglePinned={handleTogglePinned}
            onDelete={handleDelete}
          />
        )}
      </Container>

      <NoticeForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleCreate}
      />
    </Box>
  )
}
