import { Alert, Grid } from '@mui/material'
import NoticeCard from './NoticeCard'

export default function NoticeBoard({ notices, onTogglePinned, onDelete }) {
  const sorted = [...notices].sort((a, b) => Number(b.pinned) - Number(a.pinned))

  if (sorted.length === 0) {
    return <Alert severity="info">No notices have been posted yet.</Alert>
  }

  return (
    <Grid container spacing={3}>
      {sorted.map((notice) => (
        <Grid item xs={12} sm={6} md={4} key={notice.id}>
          <NoticeCard
            notice={notice}
            onTogglePinned={onTogglePinned}
            onDelete={onDelete}
          />
        </Grid>
      ))}
    </Grid>
  )
}
