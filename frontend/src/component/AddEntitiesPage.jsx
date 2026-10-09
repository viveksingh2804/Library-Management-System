import React, { useState } from "react";
import "./AddEntitiesPage.css";

const API_URL = "http://localhost:8081/api";

function AddEntitiesPage() {
  const [authorName, setAuthorName] = useState("");
  const [authorBio, setAuthorBio] = useState("");

  const [publisherName, setPublisherName] = useState("");
  const [publisherBio, setPublisherBio] = useState("");

  const [categoryName, setCategoryName] = useState("");
  const [categoryDesc, setCategoryDesc] = useState("");

  const [loading, setLoading] = useState("");
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const handleSubmit = async (event, endpoint, data, resetForm) => {
    event.preventDefault();

    if (!data.name.trim()) {
      setMessage({
        type: "error",
        text: "Please enter a name before submitting.",
      });
      return;
    }

    setLoading(endpoint);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          errorText || `Unable to add ${endpoint.slice(0, -1)}.`
        );
      }

      resetForm();

      setMessage({
        type: "success",
        text: `${endpoint.slice(0, -1)} added successfully!`,
      });
    } catch (error) {
      console.error(`Error adding ${endpoint}:`, error);

      setMessage({
        type: "error",
        text: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setLoading("");
    }
  };

  return (
    <main className="entities-page">
      <div className="entities-container">

        <header className="entities-header">
          <span className="entities-eyebrow">
            LIBRARY MANAGEMENT
          </span>

          <h1>Build your collection.</h1>

          <p>
            Organize your library by adding authors, publishers,
            and categories to keep every book connected.
          </p>
        </header>

        {message.text && (
          <div
            className={`entities-alert ${
              message.type === "success"
                ? "entities-alert-success"
                : "entities-alert-error"
            }`}
            role="status"
          >
            <span>{message.type === "success" ? "✓" : "!"}</span>
            {message.text}
            <button
              type="button"
              onClick={() => setMessage({ type: "", text: "" })}
              aria-label="Dismiss message"
            >
              ×
            </button>
          </div>
        )}

        <section className="entities-intro">
          <div className="entities-intro-icon">✦</div>
          <div>
            <h2>Your library, thoughtfully organized.</h2>
            <p>
              Add the people and classifications behind your books.
              You can use these entries when adding a new book.
            </p>
          </div>
        </section>

        <div className="entities-grid">

          {/* Author */}
          <section className="entity-card">
            <div className="entity-card-heading">
              <div className="entity-icon entity-icon-author">
                👤
              </div>

              <div>
                <span className="entity-card-label">PEOPLE</span>
                <h2>Add an Author</h2>
                <p>Introduce the minds behind the books.</p>
              </div>
            </div>

            <form
              onSubmit={(event) =>
                handleSubmit(
                  event,
                  "authors",
                  {
                    name: authorName,
                    bio: authorBio,
                  },
                  () => {
                    setAuthorName("");
                    setAuthorBio("");
                  }
                )
              }
            >
              <div className="entity-form-group">
                <label htmlFor="authorName">Author name *</label>
                <input
                  id="authorName"
                  type="text"
                  placeholder="e.g. R. K. Narayan"
                  value={authorName}
                  onChange={(event) => setAuthorName(event.target.value)}
                  required
                />
              </div>

              <div className="entity-form-group">
                <label htmlFor="authorBio">Biography</label>
                <textarea
                  id="authorBio"
                  placeholder="Write a short introduction..."
                  value={authorBio}
                  onChange={(event) => setAuthorBio(event.target.value)}
                  rows="4"
                />
                <small>A brief biography is enough.</small>
              </div>

              <button
                type="submit"
                className="entity-submit-button"
                disabled={loading !== ""}
              >
                {loading === "authors" ? "Adding..." : "+ Add Author"}
              </button>
            </form>
          </section>

          {/* Publisher */}
          <section className="entity-card">
            <div className="entity-card-heading">
              <div className="entity-icon entity-icon-publisher">
                🏢
              </div>

              <div>
                <span className="entity-card-label">PUBLISHING</span>
                <h2>Add a Publisher</h2>
                <p>Record the publishers in your collection.</p>
              </div>
            </div>

            <form
              onSubmit={(event) =>
                handleSubmit(
                  event,
                  "publishers",
                  {
                    name: publisherName,
                    bio: publisherBio,
                  },
                  () => {
                    setPublisherName("");
                    setPublisherBio("");
                  }
                )
              }
            >
              <div className="entity-form-group">
                <label htmlFor="publisherName">Publisher name *</label>
                <input
                  id="publisherName"
                  type="text"
                  placeholder="e.g. Penguin Random House"
                  value={publisherName}
                  onChange={(event) => setPublisherName(event.target.value)}
                  required
                />
              </div>

              <div className="entity-form-group">
                <label htmlFor="publisherBio">About publisher</label>
                <textarea
                  id="publisherBio"
                  placeholder="Add a short publisher description..."
                  value={publisherBio}
                  onChange={(event) => setPublisherBio(event.target.value)}
                  rows="4"
                />
                <small>Include a short description if available.</small>
              </div>

              <button
                type="submit"
                className="entity-submit-button"
                disabled={loading !== ""}
              >
                {loading === "publishers"
                  ? "Adding..."
                  : "+ Add Publisher"}
              </button>
            </form>
          </section>

          {/* Category */}
          <section className="entity-card entity-card-category">
            <div className="entity-card-heading">
              <div className="entity-icon entity-icon-category">
                🗂️
              </div>

              <div>
                <span className="entity-card-label">CLASSIFICATION</span>
                <h2>Add a Category</h2>
                <p>Make books easier to discover and organize.</p>
              </div>
            </div>

            <form
              onSubmit={(event) =>
                handleSubmit(
                  event,
                  "categories",
                  {
                    name: categoryName,
                    description: categoryDesc,
                  },
                  () => {
                    setCategoryName("");
                    setCategoryDesc("");
                  }
                )
              }
            >
              <div className="entity-form-group">
                <label htmlFor="categoryName">Category name *</label>
                <input
                  id="categoryName"
                  type="text"
                  placeholder="e.g. Computer Science"
                  value={categoryName}
                  onChange={(event) => setCategoryName(event.target.value)}
                  required
                />
              </div>

              <div className="entity-form-group">
                <label htmlFor="categoryDesc">Description</label>
                <textarea
                  id="categoryDesc"
                  placeholder="What kind of books belong here?"
                  value={categoryDesc}
                  onChange={(event) => setCategoryDesc(event.target.value)}
                  rows="4"
                />
                <small>Describe the category in a few words.</small>
              </div>

              <button
                type="submit"
                className="entity-submit-button"
                disabled={loading !== ""}
              >
                {loading === "categories"
                  ? "Adding..."
                  : "+ Add Category"}
              </button>
            </form>
          </section>

        </div>

        <footer className="entities-footer">
          <span>📚</span>
          <p>
            Good organization makes every book easier to find.
          </p>
        </footer>

      </div>
    </main>
  );
}

export default AddEntitiesPage;