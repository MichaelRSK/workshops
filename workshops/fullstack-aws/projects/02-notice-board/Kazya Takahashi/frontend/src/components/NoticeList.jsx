import { Typography } from '@mui/material'
import NoticeCard from './NoticeCard'

export default function NoticeList({ notices, onDelete }) {
  if (notices.length === 0) {
    return (
      <Typography color="text.secondary" textAlign="center" mt={8}>
        No notices yet. Be the first to post one!
      </Typography>
    )
  }

  return (
    <>
      {notices.map(notice => (
        <NoticeCard key={notice.id} notice={notice} onDelete={onDelete} />
      ))}
    </>
  )
}
