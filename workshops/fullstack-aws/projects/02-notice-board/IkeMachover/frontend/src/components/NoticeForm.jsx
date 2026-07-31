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
    onSubmit({ name: form.name.trim(), message: form.message.trim() })
    setForm(DEFAULT)
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>New Notice</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            fullWidth
            autoFocus
          />
          <TextField
            label="Message"
            name="message"
            value={form.message}
            onChange={handleChange}
            multiline
            rows={4}
            required
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!form.name.trim() || !form.message.trim()}
        >
          Post Notice
        </Button>
      </DialogActions>
    </Dialog>
  )
}
