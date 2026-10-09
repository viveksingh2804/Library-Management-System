import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./HomePage.css";

function HomePage() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchBooks() {
      try {
        const response = await fetch("http://localhost:8081/api/books");

        if (!response.ok) {
          throw new Error("Unable to fetch books");
        }

        const data = await response.json();

        const sorted = [...data].sort(
          (a, b) =>
            new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );

        setBooks(sorted);
      } catch (err) {
        console.error("Unable to fetch books:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();
  }, []);

  const filteredBooks = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return books;

    return books.filter((book) =>
      [
        book.title,
        book.description,
        book.author?.name,
        typeof book.author === "string" ? book.author : "",
        book.category?.name,
        typeof book.category === "string" ? book.category : "",
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [books, search]);

  return (
    <main className="library-page">
      <section className="library-hero">
        <div className="hero-content">
          <span className="hero-eyebrow">
            YOUR NEXT CHAPTER STARTS HERE
          </span>

          <h1>
            A world of stories,
            <br />
            <span>waiting for you.</span>
          </h1>

          <p>
            Explore fascinating books, discover new ideas, and find
            your next favourite read.
          </p>

          <div className="hero-search">
            <span className="search-icon" aria-hidden="true">
              ⌕
            </span>

            <input
              type="search"
              placeholder="Search books by title or description..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search books"
            />

            {search && (
              <button
                type="button"
                className="clear-search"
                onClick={() => setSearch("")}
              >
                Clear
              </button>
            )}
          </div>

          <div className="hero-note">
            <span>✦</span> Find a book. Find a new perspective.
          </div>
        </div>

        <div className="hero-art" aria-hidden="true">
          <div className="art-circle"></div>

          <div className="art-book art-book-back">
            <div className="art-book-spine"></div>
            <span>THE ART OF</span>
            <strong>IMAGINATION</strong>
            <div className="art-book-decoration">✳</div>
          </div>

          <div className="art-book art-book-front">
            <div className="art-book-spine"></div>
            <span>COLLECTED</span>
            <strong>STORIES</strong>
            <div className="art-book-decoration">❋</div>
          </div>

          <div className="art-caption">
            <span>01 — DISCOVER</span>
            <strong>Something wonderful.</strong>
          </div>
        </div>
      </section>

      <section className="library-content">
        <div className="library-intro">
          <div>
            <span className="section-eyebrow">THE COLLECTION</span>
            <h2>
              {search ? "Search results" : "Recently added"}
              <span className="book-count">{filteredBooks.length}</span>
            </h2>
            <p>
              {search
                ? `Books matching "${search}"`
                : "A few good books to get you started."}
            </p>
          </div>

          <Link to="/add-book" className="add-book-button">
            <span>＋</span> Add a book
          </Link>
        </div>

        {loading ? (
          <div className="library-message">
            <div className="library-spinner"></div>
            <p>Opening the books...</p>
          </div>
        ) : error ? (
          <div className="library-message">
            <span className="message-icon">!</span>
            <h3>Couldn't load the collection</h3>
            <p>
              Make sure the backend is running on port 8081, then refresh
              this page.
            </p>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="library-message">
            <span className="message-icon">⌕</span>
            <h3>{search ? "No matching books" : "Your shelves are waiting"}</h3>
            <p>
              {search
                ? "Try another title or a different search term."
                : "Add your first book to start building the collection."}
            </p>

            {search ? (
              <button
                className="add-book-button"
                onClick={() => setSearch("")}
              >
                Clear search
              </button>
            ) : (
              <Link to="/add-book" className="add-book-button">
                Add your first book
              </Link>
            )}
          </div>
        ) : (
          <div className="book-grid">
            {filteredBooks.map((book) => (
              <Link
                to={`/books/${book.id}`}
                key={book.id}
                className="modern-book-card"
              >
                <div className="book-cover">
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
                    <div className="book-placeholder">
                      <span className="placeholder-symbol">✳</span>
                      <span>BETWEEN THE PAGES</span>
                    </div>
                  )}

                  <span className="book-shelf-badge">
                    Shelf {book.shelf || "—"}
                  </span>
                </div>

                <div className="book-information">
                  <span className="book-category">
                    {book.category?.name ||
                      (typeof book.category === "string"
                        ? book.category
                        : "LIBRARY COLLECTION")}
                  </span>

                  <h3>{book.title}</h3>

                  <p className="book-description">
                    {book.description || "A new story waiting to be explored."}
                  </p>

                  <div className="book-card-footer">
                    <span>Explore book</span>
                    <span className="book-arrow">↗</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <footer className="library-footer">
        <span>📚 Your library, your next chapter.</span>
        <span>Made for curious minds.</span>
      </footer>
    </main>
  );
}

export default HomePage;