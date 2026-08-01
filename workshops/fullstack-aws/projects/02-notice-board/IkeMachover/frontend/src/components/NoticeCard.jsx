import { Card, CardContent, Typography, IconButton, Box } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

export default function NoticeCard({ notice, onDelete }) {
  return (
    <Card sx={{ height: '100%' }} elevation={2}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={2}>
          <Typography variant="subtitle1" fontWeight="bold">
            {notice.name}
          </Typography>
          <IconButton
            aria-label="Delete notice"
            color="error"
            size="small"
            onClick={() => onDelete(notice.id)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>

        <Typography variant="body1" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>
          {notice.message}
        </Typography>

        {notice.created_at && (
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 2 }}>
            {new Date(notice.created_at).toLocaleString()}
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}
