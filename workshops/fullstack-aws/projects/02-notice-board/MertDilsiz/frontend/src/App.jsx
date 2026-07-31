import { useEffect, useState } from "react";
import "./App.css";

const API_BASE_URL = "http://localhost:5001";

function App() {
  const [notices, setNotices] = useState([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const loadNotices = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/notices`);

      if (!response.ok) {
        throw new Error("Failed to load notices");
      }

      const data = await response.json();
      setNotices(data);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotices();
  }, []);

  const handleCreateNotice = async (event) => {
    event.preventDefault();

    if (!name.trim() || !message.trim()) {
      setError("Name and message are required.");
      return;
    }

    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/notices`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          message: message.trim(),
        }),
      });

      if (!response.ok) {
        const apiError = await response.json().catch(() => null);
        throw new Error(apiError?.error || "Failed to create notice");
      }

      setName("");
      setMessage("");
      await loadNotices();
    } catch (createError) {
      setError(createError.message);
    }
  };

  const handleDeleteNotice = async (id) => {
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/notices/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const apiError = await response.json().catch(() => null);
        throw new Error(apiError?.error || "Failed to delete notice");
      }

      await loadNotices();
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  return (
    <main className="app-shell">
      <section className="panel">
        <h1>Notice Board</h1>
        <p className="subtitle">Post and manage notices from one place.</p>

        <form className="notice-form" onSubmit={handleCreateNotice}>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter your name"
          />

          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Write your notice"
            rows={4}
          />

          <button type="submit">Add Notice</button>
        </form>

        {error ? <p className="error">{error}</p> : null}

        <div className="notice-list">
          <h2>Notices</h2>

          {isLoading ? <p>Loading notices...</p> : null}

          {!isLoading && notices.length === 0 ? <p>No notices yet.</p> : null}

          {!isLoading
            ? notices.map((notice) => (
                <article key={notice.id} className="notice-item">
                  <div>
                    <p className="notice-name">{notice.name}</p>
                    <p className="notice-message">{notice.message}</p>
                  </div>
                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => handleDeleteNotice(notice.id)}
                  >
                    Delete
                  </button>
                </article>
              ))
            : null}
        </div>
      </section>
    </main>
  );
}

export default App;
