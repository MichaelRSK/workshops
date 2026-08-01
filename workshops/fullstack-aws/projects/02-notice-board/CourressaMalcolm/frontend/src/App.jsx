import { useCallback, useEffect, useState } from 'react';
import { fetchNotices } from './api';
import NoticeCard from './components/NoticeCard';

export default function App() {
  const [notices, setNotices] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadNotices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchNotices();
      setNotices(result.data ?? []);
      setCount(result.count ?? result.data?.length ?? 0);
    } catch (err) {
      setError(err.message || 'Something went wrong');
      setNotices([]);
      setCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotices();
  }, [loadNotices]);

  return (
    <div className="page">
      <header className="header">
        <div className="header-inner">
          <div>
            <p className="eyebrow">Collabera · Fullstack AWS</p>
            <h1 className="title">Notice Board</h1>
            <p className="subtitle">
              All posted notices from the board, refreshed from the live API.
            </p>
          </div>
          <button
            type="button"
            className="btn-refresh"
            onClick={loadNotices}
            disabled={loading}
            aria-label="Refresh notices"
          >
            {loading ? 'Loading…' : 'Refresh'}
          </button>
        </div>
      </header>

      <main className="main">
        {loading && (
          <div className="state state-loading" role="status">
            <div className="spinner" aria-hidden="true" />
            <p>Fetching notices…</p>
          </div>
        )}

        {!loading && error && (
          <div className="state state-error" role="alert">
            <h2>Could not load notices</h2>
            <p>{error}</p>
            <p className="hint">
              Make sure the backend is running on port 3000 (
              <code>node app.js</code> in <code>backend/</code>).
            </p>
            <button type="button" className="btn-refresh" onClick={loadNotices}>
              Try again
            </button>
          </div>
        )}

        {!loading && !error && notices.length === 0 && (
          <div className="state state-empty">
            <h2>No notices yet</h2>
            <p>When notices are added to the database, they will show up here.</p>
          </div>
        )}

        {!loading && !error && notices.length > 0 && (
          <>
            <div className="meta-bar">
              <span className="count-badge">{count} notice{count === 1 ? '' : 's'}</span>
            </div>
            <ul className="notice-grid">
              {notices.map((notice) => (
                <li key={notice.id}>
                  <NoticeCard notice={notice} />
                </li>
              ))}
            </ul>
          </>
        )}
      </main>

      <footer className="footer">
        <p>GET /api/v1/notice · Express + MongoDB</p>
      </footer>
    </div>
  );
}
