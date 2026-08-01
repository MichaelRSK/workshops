import { Card, CardContent, CardActions, Typography, IconButton, Tooltip } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

export default function NoticeCard({ notice, onDelete }) {
  const date = notice.created_at
    ? new Date(notice.created_at).toLocaleString()
    : ''

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          {notice.name}
        </Typography>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: 1 }}>
          {notice.message}
        </Typography>
        {date && (
          <Typography variant="caption" color="text.secondary">
            {date}
          </Typography>
        )}
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
        <Tooltip title="Delete notice">
          <IconButton size="small" color="error" onClick={() => onDelete(notice.id)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  )
}
