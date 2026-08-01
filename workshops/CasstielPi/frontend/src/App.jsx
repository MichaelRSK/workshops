import { useEffect, useState } from "react";
import {
  createNotice,
  deleteNotice,
  getNotices,
} from "./services/api";
import "./App.css";

function App() {
  const [notices, setNotices] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function loadNotices() {
    try {
      setError("");
      const data = await getNotices();
      setNotices(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotices();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedMessage = message.trim();

    if (!trimmedTitle || !trimmedMessage) {
      setError("Title and message are required.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await createNotice({
        title: trimmedTitle,
        message: trimmedMessage,
      });

      setTitle("");
      setMessage("");
      await loadNotices();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(noticeId) {
    try {
      setError("");
      await deleteNotice(noticeId);
      setNotices((currentNotices) =>
        currentNotices.filter((notice) => notice.id !== noticeId),
      );
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="page">
      <section className="notice-board">
        <header className="page-header">
          <p className="eyebrow">Community Updates</p>
          <h1>Notice Board</h1>
          <p>Create, view, and remove notices.</p>
        </header>

        <form className="notice-form" onSubmit={handleSubmit}>
          <h2>Create a notice</h2>

          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            maxLength="100"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Enter a notice title"
          />

          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            maxLength="500"
            rows="4"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Enter the notice message"
          />

          <button type="submit" disabled={submitting}>
            {submitting ? "Adding..." : "Add Notice"}
          </button>
        </form>

        {error && <p className="error-message">{error}</p>}

        <section className="notices-section">
          <div className="section-heading">
            <h2>Current notices</h2>
            <span>{notices.length}</span>
          </div>

          {loading ? (
            <p className="status-message">Loading notices...</p>
          ) : notices.length === 0 ? (
            <p className="status-message">No notices available.</p>
          ) : (
            <div className="notice-list">
              {notices.map((notice) => (
                <article className="notice-card" key={notice.id}>
                  <div>
                    <h3>{notice.title}</h3>
                    <p>{notice.message}</p>
                    <time>
                      {new Date(notice.created_at).toLocaleString()}
                    </time>
                  </div>

                  <button
                    className="delete-button"
                    type="button"
                    onClick={() => handleDelete(notice.id)}
                  >
                    Delete
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

export default App;