import { useState } from 'react'
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material'

const EMPTY_FORM = {
  title: '',
  message: '',
  category: 'General',
  author: '',
  pinned: false,
}

export default function NoticeForm({ open, onClose, onSubmit }) {
  const [form, setForm] = useState(EMPTY_FORM)

  function handleChange(event) {
    const { name, value, checked, type } = event.target
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  function handleClose() {
    setForm(EMPTY_FORM)
    onClose()
  }

  function handleSubmit() {
    if (!form.title.trim() || !form.message.trim()) return
    onSubmit(form)
    setForm(EMPTY_FORM)
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Create Notice</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            autoFocus
          />
          <TextField
            label="Message"
            name="message"
            value={form.message}
            onChange={handleChange}
            required
            multiline
            rows={4}
          />
          <TextField
            label="Category"
            name="category"
            value={form.category}
            onChange={handleChange}
            select
          >
            {['General', 'Event', 'Reminder', 'Important', 'Lost & Found'].map((category) => (
              <MenuItem value={category} key={category}>{category}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Author"
            name="author"
            value={form.author}
            onChange={handleChange}
            placeholder="Your name"
          />
          <FormControlLabel
            control={<Checkbox name="pinned" checked={form.pinned} onChange={handleChange} />}
            label="Pin this notice"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!form.title.trim() || !form.message.trim()}
        >
          Post Notice
        </Button>
      </DialogActions>
    </Dialog>
  )
}
