import React, { useCallback, useEffect, useState } from "react";
import "./BorrowBook.css";

const API_URL = "http://localhost:8081/api";

function BorrowBook() {
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [borrowRecords, setBorrowRecords] = useState([]);

  const [selectedBook, setSelectedBook] = useState("");
  const [selectedMember, setSelectedMember] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [returningId, setReturningId] = useState(null);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const loadData = useCallback(async () => {
    setLoading(true);

    try {
      const responses = await Promise.all([
        fetch(`${API_URL}/books`),
        fetch(`${API_URL}/members`),
        fetch(`${API_URL}/borrow`),
      ]);

      for (const response of responses) {
        if (!response.ok) {
          throw new Error("Unable to load library records.");
        }
      }

      const [booksData, membersData, borrowData] = await Promise.all(
        responses.map((response) => response.json())
      );

      setBooks(Array.isArray(booksData) ? booksData : []);
      setMembers(Array.isArray(membersData) ? membersData : []);

      const records = Array.isArray(borrowData)
        ? borrowData
        : Array.isArray(borrowData?.content)
          ? borrowData.content
          : [];

      setBorrowRecords(records);
    } catch (error) {
      console.error("Error loading borrow data:", error);

      setMessage({
        type: "error",
        text: "Could not load library data. Check that the backend is running.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Books currently borrowed should not be offered again.
  const borrowedBookIds = new Set(
    borrowRecords
      .filter((record) => record.status === "BORROWED")
      .map((record) => String(record.book?.id))
  );

  const availableBooks = books.filter(
    (book) => !borrowedBookIds.has(String(book.id))
  );

  const handleBorrow = async (event) => {
    event.preventDefault();

    if (!selectedBook || !selectedMember) {
      setMessage({
        type: "error",
        text: "Please select both a book and a member.",
      });
      return;
    }

    const record = {
      book: { id: Number(selectedBook) },
      member: { id: Number(selectedMember) },
    };

    setSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch(`${API_URL}/borrow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(record),
      });

      if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
          errorText || "Failed to borrow this book."
        );
      }

      setSelectedBook("");
      setSelectedMember("");

      setMessage({
        type: "success",
        text: "Book borrowed successfully!",
      });

      await loadData();
    } catch (error) {
      console.error("Error borrowing book:", error);

      setMessage({
        type: "error",
        text: error.message || "Could not connect to the backend.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReturn = async (id) => {
    setReturningId(id);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch(
        `${API_URL}/borrow/${id}/return`,
        { method: "PUT" }
      );

      if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
          errorText || "Failed to return this book."
        );
      }

      setMessage({
        type: "success",
        text: "Book returned successfully!",
      });

      await loadData();
    } catch (error) {
      console.error("Error returning book:", error);

      setMessage({
        type: "error",
        text: error.message || "Could not connect to the backend.",
      });
    } finally {
      setReturningId(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const borrowedCount = borrowRecords.filter(
    (record) => record.status === "BORROWED"
  ).length;

  const returnedCount = borrowRecords.filter(
    (record) => record.status === "RETURNED"
  ).length;

  return (
    <main className="borrow-page">
      <div className="borrow-container">

        {/* Header */}
        <header className="borrow-page-header">
          <div>
            <span className="borrow-eyebrow">
              LIBRARY OPERATIONS
            </span>

            <h1>Borrow &amp; Return</h1>

            <p>
              Manage book circulation and keep track of every
              reader's library journey.
            </p>
          </div>

          <button
            type="button"
            className="borrow-refresh-button"
            onClick={loadData}
            disabled={loading}
          >
            ↻ {loading ? "Refreshing..." : "Refresh Records"}
          </button>
        </header>

        {/* Notification */}
        {message.text && (
          <div
            className={`borrow-notification ${
              message.type === "success"
                ? "borrow-notification-success"
                : "borrow-notification-error"
            }`}
            role="status"
          >
            <span>
              {message.type === "success" ? "✓" : "!"}
            </span>

            <p>{message.text}</p>

            <button
              type="button"
              onClick={() => setMessage({ type: "", text: "" })}
              aria-label="Dismiss message"
            >
              ×
            </button>
          </div>
        )}

        {/* Statistics */}
        <section className="borrow-stats-grid">
          <div className="borrow-stat-card">
            <span className="borrow-stat-icon">📚</span>
            <div>
              <span className="borrow-stat-label">TOTAL BOOKS</span>
              <strong>{books.length}</strong>
              <p>In your collection</p>
            </div>
          </div>

          <div className="borrow-stat-card">
            <span className="borrow-stat-icon">👥</span>
            <div>
              <span className="borrow-stat-label">MEMBERS</span>
              <strong>{members.length}</strong>
              <p>Registered readers</p>
            </div>
          </div>

          <div className="borrow-stat-card">
            <span className="borrow-stat-icon">↗</span>
            <div>
              <span className="borrow-stat-label">BORROWED</span>
              <strong>{borrowedCount}</strong>
              <p>Currently on loan</p>
            </div>
          </div>

          <div className="borrow-stat-card">
            <span className="borrow-stat-icon">✓</span>
            <div>
              <span className="borrow-stat-label">RETURNED</span>
              <strong>{returnedCount}</strong>
              <p>Completed loans</p>
            </div>
          </div>
        </section>

        {/* Borrow Form */}
        <section className="borrow-form-card">
          <div className="borrow-section-heading">
            <div className="borrow-section-icon">↗</div>

            <div>
              <h2>Issue a Book</h2>
              <p>Choose an available book and its registered reader.</p>
            </div>
          </div>

          <form onSubmit={handleBorrow}>
            <div className="borrow-form-grid">

              <div className="borrow-field">
                <label htmlFor="borrowBook">Select book *</label>

                <select
                  id="borrowBook"
                  value={selectedBook}
                  onChange={(event) =>
                    setSelectedBook(event.target.value)
                  }
                  required
                >
                  <option value="">Choose a book...</option>

                  {availableBooks.map((book) => (
                    <option key={book.id} value={book.id}>
                      {book.title}
                    </option>
                  ))}
                </select>

                <small>
                  {availableBooks.length} book(s) available to issue
                </small>
              </div>

              <div className="borrow-field">
                <label htmlFor="borrowMember">Select member *</label>

                <select
                  id="borrowMember"
                  value={selectedMember}
                  onChange={(event) =>
                    setSelectedMember(event.target.value)
                  }
                  required
                >
                  <option value="">Choose a member...</option>

                  {members.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>

                <small>
                  {members.length} registered member(s)
                </small>
              </div>

              <div className="borrow-submit-wrapper">
                <button
                  type="submit"
                  className="borrow-submit-button"
                  disabled={
                    submitting ||
                    loading ||
                    availableBooks.length === 0 ||
                    members.length === 0
                  }
                >
                  {submitting ? "Processing..." : "Issue Book →"}
                </button>
              </div>

            </div>
          </form>
        </section>

        {/* Borrow Records */}
        <section className="borrow-records-card">
          <div className="borrow-records-heading">
            <div>
              <span className="borrow-eyebrow">
                CIRCULATION HISTORY
              </span>

              <h2>Borrow Records</h2>

              <p>Review issued books and completed returns.</p>
            </div>

            <span className="borrow-record-count">
              {borrowRecords.length} records
            </span>
          </div>

          {loading ? (
            <div className="borrow-empty-state">
              <div className="borrow-spinner" />
              <p>Loading borrowing records...</p>
            </div>
          ) : borrowRecords.length === 0 ? (
            <div className="borrow-empty-state">
              <span>📖</span>
              <h3>No borrowing records yet</h3>
              <p>Issue your first book using the form above.</p>
            </div>
          ) : (
            <div className="borrow-table-wrapper">
              <table className="borrow-table">
                <thead>
                  <tr>
                    <th>RECORD</th>
                    <th>BOOK</th>
                    <th>MEMBER</th>
                    <th>ISSUED ON</th>
                    <th>RETURNED ON</th>
                    <th>STATUS</th>
                    <th>ACTION</th>
                  </tr>
                </thead>

                <tbody>
                  {borrowRecords.map((record) => (
                    <tr key={record.id}>
                      <td>
                        <span className="borrow-record-id">
                          #{record.id}
                        </span>
                      </td>

                      <td>
                        <div className="borrow-table-book">
                          <span>📕</span>
                          <strong>
                            {record.book?.title || "Unknown book"}
                          </strong>
                        </div>
                      </td>

                      <td>
                        {record.member?.name || "Unknown member"}
                      </td>

                      <td>{formatDate(record.borrowDate)}</td>

                      <td>{formatDate(record.returnDate)}</td>

                      <td>
                        <span
                          className={`borrow-status ${
                            record.status === "BORROWED"
                              ? "borrow-status-active"
                              : "borrow-status-returned"
                          }`}
                        >
                          <span className="borrow-status-dot" />
                          {record.status || "UNKNOWN"}
                        </span>
                      </td>

                      <td>
                        {record.status === "BORROWED" ? (
                          <button
                            type="button"
                            className="borrow-return-button"
                            onClick={() => handleReturn(record.id)}
                            disabled={returningId !== null}
                          >
                            {returningId === record.id
                              ? "Returning..."
                              : "Return Book"}
                          </button>
                        ) : (
                          <span className="borrow-completed-label">
                            ✓ Completed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <footer className="borrow-page-footer">
          <span>✦</span>
          Every book returned is another story ready to be shared.
        </footer>

      </div>
    </main>
  );
}

export default BorrowBook;