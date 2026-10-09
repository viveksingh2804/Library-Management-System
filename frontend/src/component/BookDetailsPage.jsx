import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./BookDetailsPage.css";

const API_URL = "http://localhost:8081";

function BookDetailsPage() {
  const { id } = useParams();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchBook() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${API_URL}/api/books/${id}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "This book could not be found."
              : "Unable to load book details."
          );
        }

        const data = await response.json();
        setBook(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Failed to fetch book details:", err);
          setError(err.message || "Something went wrong.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchBook();

    return () => controller.abort();
  }, [id]);

  if (loading) {
    return (
      <main className="book-details-page">
        <div className="details-state">
          <div className="details-spinner" />
          <h2>Opening your book...</h2>
          <p>Gathering all the details for you.</p>
        </div>
      </main>
    );
  }

  if (error || !book) {
    return (
      <main className="book-details-page">
        <div className="details-state error-state">
          <span className="state-icon">📕</span>
          <h2>Book not found</h2>
          <p>{error || "The requested book is unavailable."}</p>
          <Link to="/search" className="details-primary-button">
            Browse Books
          </Link>
        </div>
      </main>
    );
  }

  const isBorrowed = book.status === "BORROWED";

  const authorName =
    typeof book.author === "object"
      ? book.author?.name
      : book.author;

  const publisherName =
    typeof book.publisher === "object"
      ? book.publisher?.name
      : book.publisher;

  const categoryName =
    typeof book.category === "object"
      ? book.category?.name
      : book.category;

  return (
    <main className="book-details-page">
      <div className="details-container">

        {/* Breadcrumb */}
        <div className="details-breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/search">Browse Books</Link>
          <span>/</span>
          <span className="breadcrumb-current">
            Book Details
          </span>
        </div>

        {/* Page heading */}
        <div className="details-page-heading">
          <div>
            <span className="details-eyebrow">
              THE LIBRARY COLLECTION
            </span>
            <h1>Discover your next read.</h1>
            <p>
              Explore the story, the author, and everything
              that makes this book special.
            </p>
          </div>

          <Link to="/search" className="details-back-button">
            ← Back to Books
          </Link>
        </div>

        {/* Main book panel */}
        <section className="book-details-card">

          {/* Cover */}
          <div className="book-cover-panel">
            <div className="cover-decoration cover-decoration-one" />
            <div className="cover-decoration cover-decoration-two" />

            <div className="book-cover-frame">
              {book.image ? (
                <img
                  src={
                    book.image.startsWith("http")
                      ? book.image
                      : `${API_URL}${book.image}`
                  }
                  alt={`Cover of ${book.title}`}
                  className="book-cover-image"
                />
              ) : (
                <div className="book-cover-placeholder">
                  <span className="placeholder-book-icon">📚</span>
                  <span className="placeholder-label">
                    LIBRARY EDITION
                  </span>
                  <span className="placeholder-title">
                    {book.title}
                  </span>
                </div>
              )}
            </div>

            <div
              className={`availability-badge ${
                isBorrowed ? "badge-borrowed" : "badge-available"
              }`}
            >
              <span className="availability-dot" />
              {isBorrowed ? "Currently Borrowed" : "Available to Read"}
            </div>
          </div>

          {/* Information */}
          <div className="book-information-panel">
            <div className="book-information-topline">
              <span className="book-id-label">
                BOOK ID: #{book.id}
              </span>

              {categoryName && (
                <span className="book-category-tag">
                  {categoryName}
                </span>
              )}
            </div>

            <h2 className="book-detail-title">
              {book.title}
            </h2>

            <p className="book-detail-author">
              Written by{" "}
              <strong>{authorName || "Unknown Author"}</strong>
            </p>

            <div className="book-detail-divider" />

            <div className="book-description-section">
              <h3>About this book</h3>
              <p>
                {book.description ||
                  "No description has been added for this book yet."}
              </p>
            </div>

            <div className="book-facts-grid">
              <div className="book-fact">
                <span className="fact-icon">👤</span>
                <div>
                  <span className="fact-label">AUTHOR</span>
                  <strong>{authorName || "Not specified"}</strong>
                </div>
              </div>

              <div className="book-fact">
                <span className="fact-icon">🏢</span>
                <div>
                  <span className="fact-label">PUBLISHER</span>
                  <strong>{publisherName || "Not specified"}</strong>
                </div>
              </div>

              <div className="book-fact">
                <span className="fact-icon">📍</span>
                <div>
                  <span className="fact-label">SHELF LOCATION</span>
                  <strong>{book.shelf || "Not assigned"}</strong>
                </div>
              </div>

              <div className="book-fact">
                <span className="fact-icon">📖</span>
                <div>
                  <span className="fact-label">CATEGORY</span>
                  <strong>{categoryName || "Not categorized"}</strong>
                </div>
              </div>
            </div>

            {isBorrowed && book.borrowedBy && (
              <div className="borrowed-information">
                <span>👤</span>
                <div>
                  <strong>Currently borrowed by</strong>
                  <p>{book.borrowedBy}</p>
                </div>
              </div>
            )}

            <div className="book-details-actions">
              <Link to="/search" className="details-primary-button">
                ← Explore More Books
              </Link>
            </div>

            <p className="book-details-note">
              <span>ℹ</span>
              For borrowing or returning this book, visit the
              Borrow &amp; Return section.
            </p>
          </div>
        </section>

        {/* Bottom information */}
        <section className="library-promise">
          <div className="promise-icon">✦</div>
          <div>
            <h3>A little knowledge goes a long way.</h3>
            <p>
              Find a book, discover an idea, and let every page
              take you somewhere new.
            </p>
          </div>
          <Link to="/book-borrow">Borrow &amp; Return →</Link>
        </section>

      </div>
    </main>
  );
}

export default BookDetailsPage;