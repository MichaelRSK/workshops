import { useState } from "react";

import {
  Alert,
  Card,
  CardContent,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

import { deleteNotice } from "../api/notices";

// Turns the timestamp the backend sends into something readable.
//
// created_at arrives as an ISO string with a UTC offset, because the column
// is timestamptz. new Date parses that and toLocaleString renders it in the
// reader's own timezone, which is the point of storing it that way.
//
// Falls back to the raw string if parsing fails, so a notice with an
// unexpected timestamp still renders instead of showing "Invalid Date" or
// taking the whole list down.
function formatCreatedAt(createdAt) {
  const parsed = new Date(createdAt);

  if (Number.isNaN(parsed.getTime())) {
    return createdAt;
  }

  return parsed.toLocaleString();
}

// One notice, with the button that deletes it.
//
// onDeleted is called after the backend confirms the delete, which tells
// App to refetch. As with the form, nothing is removed from the list here:
// the refetch is what makes the screen agree with the database.
function NoticeCard({ notice, onDeleted }) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setDeleting(true);
    setError("");

    try {
      await deleteNotice(notice.id);

      onDeleted();
    } catch (err) {
      console.error(err);

      // A 404 here means someone else deleted this notice first, which is
      // worth saying in plainer words than the backend's own "Notice not
      // found". The list is refetched either way, so the stale card
      // disappears on its own.
      setError(err.message);

      // Only re-enabled on failure. On success this component is about to
      // be unmounted by the refetch, and setting state on the way out would
      // be pointless work.
      setDeleting(false);
    }
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          spacing={2}
        >
          <div>
            <Typography variant="subtitle1" fontWeight="bold">
              {notice.name}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              {formatCreatedAt(notice.created_at)}
            </Typography>

            {/* whiteSpace pre-wrap keeps the line breaks someone typed into
                the message box. Without it the browser collapses them and
                every notice renders as one run-on paragraph. */}
            <Typography sx={{ mt: 1, whiteSpace: "pre-wrap" }}>
              {notice.message}
            </Typography>
          </div>

          <Tooltip title="Delete this notice">
            {/* The span is here because MUI's Tooltip needs a child that can
                hold a ref and fire hover events, and a disabled button fires
                neither. Without it the tooltip breaks once deleting starts. */}
            <span>
              <IconButton
                aria-label={`Delete notice from ${notice.name}`}
                onClick={handleDelete}
                disabled={deleting}
                size="small"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

export default NoticeCard;
