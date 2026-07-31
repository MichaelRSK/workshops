import {
  Box,
  Card,
  CardActions,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import PushPinIcon from '@mui/icons-material/PushPin'
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined'

export default function NoticeCard({ notice, onTogglePinned, onDelete }) {
  const created = notice.created_at
    ? new Date(notice.created_at).toLocaleString()
    : 'Date unavailable'

  return (
    <Card elevation={notice.pinned ? 5 : 2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1}>
          <Typography variant="h6" fontWeight="bold">
            {notice.title}
          </Typography>
          {notice.pinned && <Chip label="Pinned" color="warning" size="small" />}
        </Stack>

        <Chip label={notice.category || 'General'} size="small" variant="outlined" sx={{ my: 1.5 }} />

        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: 2 }}>
          {notice.message}
        </Typography>

        <Box>
          <Typography variant="caption" display="block" color="text.secondary">
            Posted by {notice.author || 'Anonymous'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {created}
          </Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Tooltip title={notice.pinned ? 'Unpin notice' : 'Pin notice'}>
          <IconButton onClick={() => onTogglePinned(notice)}>
            {notice.pinned ? <PushPinIcon /> : <PushPinOutlinedIcon />}
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete notice">
          <IconButton color="error" onClick={() => onDelete(notice.id)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  )
}
