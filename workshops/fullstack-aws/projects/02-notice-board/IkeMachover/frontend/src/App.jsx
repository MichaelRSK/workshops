import { useState, useEffect } from 'react'
import { Container, Typography, Box, Button, CircularProgress, Alert } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import NoticeBoard from './components/NoticeBoard'
import NoticeForm from './components/NoticeForm'
import { getNotices, createNotice, deleteNotice } from './api'

export default function App() {
  const [notices, setNotices]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [formOpen, setFormOpen] = useState(false)

  useEffect(() => { fetchNotices() }, [])

  async function fetchNotices() {
    try {
      setLoading(true)
      const data = await getNotices()
      setNotices(data.notices || [])
    } catch (e) {
      setError('Failed to load notices. Check your API URL.')
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate(notice) {
    try {
      const data = await createNotice(notice)
      if (data.notice) {
        setNotices(prev => [data.notice, ...prev])
        setFormOpen(false)
      } else {
        setError(`Failed to create notice: ${data.error || 'Unknown error'}`)
      }
    } catch (e) {
      setError(`API error: ${e.message}`)
    }
  }

  async function handleDelete(id) {
    await deleteNotice(id)
    setNotices(prev => prev.filter(notice => notice.id !== id))
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 2, px: 3, mb: 3 }}>
        <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" fontWeight="bold">Notice Board</Typography>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={() => setFormOpen(true)}
          >
            Add Notice
          </Button>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {loading
          ? <Box display="flex" justifyContent="center" mt={8}><CircularProgress /></Box>
          : <NoticeBoard notices={notices} onDelete={handleDelete} />
        }
      </Container>

      <NoticeForm open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleCreate} />
    </Box>
  )
}
