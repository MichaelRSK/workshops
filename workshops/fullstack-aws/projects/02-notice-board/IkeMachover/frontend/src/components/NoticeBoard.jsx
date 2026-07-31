import { Grid, Typography, Box } from '@mui/material'
import NoticeCard from './NoticeCard'

export default function NoticeBoard({ notices, onDelete }) {
  if (notices.length === 0) {
    return (
      <Box textAlign="center" mt={8}>
        <Typography variant="h6" color="text.secondary">No notices yet</Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>
          Add the first notice to confirm the app is connected to MongoDB.
        </Typography>
      </Box>
    )
  }

  return (
    <Grid container spacing={2}>
      {notices.map(notice => (
        <Grid item xs={12} md={6} lg={4} key={notice.id}>
          <NoticeCard notice={notice} onDelete={onDelete} />
        </Grid>
      ))}
    </Grid>
  )
}
