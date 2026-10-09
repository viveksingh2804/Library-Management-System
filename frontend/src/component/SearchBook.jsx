import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./SearchBook.css";

function SearchBook() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSearch(event) {
    event.preventDefault();

    const searchTerm = query.trim();

    if (!searchTerm) {
      setError("Enter a book title, author, category or publisher.");
      setResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:8081/api/books/search?q=${encodeURIComponent(searchTerm)}`
      );

      if (!response.ok) {
        throw new Error(`Search failed (${response.status}). Please try again.`);
      }

      const data = await response.json();
      setResults(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Book search failed:", err);
      setResults([]);
      setError(
        "Unable to search books. Check that the backend is running and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleBookClick(id) {
    navigate(`/books/${id}`);
  }

  return (
    <main className="search-page">
      <section className="search-hero">
        <div className="search-hero-content">
          <span className="search-eyebrow">YOUR NEXT READ IS OUT THERE</span>

          <h1>
            Find your next
            <br />
            <span>favourite book.</span>
          </h1>

          <p>
            Search the collection, discover new authors, and find the
            perfect book for your next chapter.
          </p>

          <form className="modern-search-form" onSubmit={handleSearch}>
            <span className="modern-search-icon" aria-hidden="true">
              ⌕
            </span>

            <input
              type="search"
              aria-label="Search library"
              placeholder="Title, author, category or publisher..."
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setError("");
              }}
            />

            <button type="submit" disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </button>
          </form>

          {error && <p className="search-error">{error}</p>}

          <div className="search-hint">
            <span>✦</span> Every great journey begins with a book.
          </div>
        </div>

        <div className="search-hero-art" aria-hidden="true">
          <div className="search-art-circle"></div>

          <div className="search-art-book search-art-book-one">
            <span>THE</span>
            <strong>WISDOM<br />OF WORDS</strong>
            <i>✳</i>
          </div>

          <div className="search-art-book search-art-book-two">
            <span>A COLLECTION OF</span>
            <strong>NEW<br />WORLDS</strong>
            <i>✦</i>
          </div>

          <div className="search-art-label">OPEN A BOOK. OPEN A WORLD.</div>
        </div>
      </section>

      <section className="search-results-section">
        <div className="search-results-heading">
          <div>
            <span className="search-section-eyebrow">
              {hasSearched ? "YOUR DISCOVERIES" : "EXPLORE THE COLLECTION"}
            </span>

            <h2>
              {loading
                ? "Finding books..."
                : hasSearched
                ? "Search results"
                : "Ready to explore?"}
            </h2>

            <p>
              {hasSearched && !loading
                ? `${results.length} ${
                    results.length === 1 ? "book" : "books"
                  } found`
                : "Enter a search term above to discover books in your library."}
            </p>
          </div>

          {hasSearched && !loading && results.length > 0 && (
            <button
              className="search-clear-button"
              onClick={() => {
                setQuery("");
                setResults([]);
                setHasSearched(false);
                setError("");
              }}
            >
              Clear results
            </button>
          )}
        </div>

        {loading && (
          <div className="search-empty-state">
            <div className="search-spinner"></div>
            <p>Searching the shelves...</p>
          </div>
        )}

        {!loading && !error && hasSearched && results.length === 0 && (
          <div className="search-empty-state">
            <span className="search-empty-icon">⌕</span>
            <h3>No books found</h3>
            <p>
              We couldn't find anything matching "{query}". Try another
              title or search term.
            </p>
          </div>
        )}

        {!loading && !hasSearched && !error && (
          <div className="search-welcome-state">
            <span>📖</span>
            <div>
              <strong>Your next favourite is waiting.</strong>
              <p>Use the search bar above to explore the library collection.</p>
            </div>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="search-book-grid">
            {results.map((book) => (
              <button
                type="button"
                className="search-book-card"
                key={book.id}
                onClick={() => handleBookClick(book.id)}
                aria-label={`View details for ${book.title}`}
              >
                <div className="search-book-cover">
                  {book.image ? (
                    <img
                      src={`http://localhost:8081${book.image}`}
                      alt={book.title}
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="search-book-placeholder">
                      <span>✳</span>
                      <small>THE LIBRARY EDITION</small>
                    </div>
                  )}

                  <span className="search-cover-shelf">
                    Shelf {book.shelf || "—"}
                  </span>
                </div>

                <div className="search-book-info">
                  <span className="search-book-category">
                    {book.category?.name || "LIBRARY COLLECTION"}
                  </span>

                  <h3>{book.title}</h3>

                  <p className="search-book-author">
                    By {book.author?.name || "Unknown author"}
                  </p>

                  <div className="search-book-meta">
                    <span>{book.publisher?.name || "Publisher unavailable"}</span>
                    <span className="search-book-arrow">↗</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      <footer className="search-page-footer">
        <span>📚 Netaji Library</span>
        <span>A little more knowledge, one book at a time.</span>
      </footer>
    </main>
  );
}

export default SearchBook;