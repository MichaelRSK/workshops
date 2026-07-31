function formatDate(value) {
  if (!value) return 'Unknown date';
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value));
  } catch {
    return String(value);
  }
}

export default function NoticeCard({ notice }) {
  const { title, content, author, createdAt } = notice;

  return (
    <article className="notice-card">
      <div className="notice-card-top">
        <h2 className="notice-title">{title}</h2>
        <time className="notice-date" dateTime={createdAt}>
          {formatDate(createdAt)}
        </time>
      </div>
      <p className="notice-content">{content}</p>
      <footer className="notice-footer">
        <span className="notice-author">
          <span className="author-label">Posted by</span> {author || 'Admin'}
        </span>
      </footer>
    </article>
  );
}
