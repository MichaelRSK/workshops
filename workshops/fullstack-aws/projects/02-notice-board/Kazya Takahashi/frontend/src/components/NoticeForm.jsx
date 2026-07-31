import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Stack
} from '@mui/material'
import { useState } from 'react'

const DEFAULT = { name: '', message: '' }

export default function NoticeForm({ open, onClose, onSubmit }) {
  const [form, setForm] = useState(DEFAULT)

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit() {
    if (!form.name.trim() || !form.message.trim()) return
    onSubmit(form)
    setForm(DEFAULT)
  }

  function handleClose() {
    setForm(DEFAULT)
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Post a Notice</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Your Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Message"
            name="message"
            value={form.message}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            required
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!form.name.trim() || !form.message.trim()}
        >
          Post
        </Button>
      </DialogActions>
    </Dialog>
  )
}
