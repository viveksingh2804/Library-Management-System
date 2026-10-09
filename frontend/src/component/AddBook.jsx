import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AddBook.css";

const API = "http://localhost:8081/api";

function AddBook() {
  const [bookTitle, setBookTitle] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [publisherId, setPublisherId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [shelf, setShelf] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loadingOptions, setLoadingOptions] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    async function fetchDropdowns() {
      try {
        const [authorsRes, publishersRes, categoriesRes] =
          await Promise.all([
            fetch(`${API}/authors`),
            fetch(`${API}/publishers`),
            fetch(`${API}/categories`),
          ]);

        if (!authorsRes.ok || !publishersRes.ok || !categoriesRes.ok) {
          throw new Error("Unable to load form options.");
        }

        const [authorsData, publishersData, categoriesData] =
          await Promise.all([
            authorsRes.json(),
            publishersRes.json(),
            categoriesRes.json(),
          ]);

        setAuthors(authorsData);
        setPublishers(publishersData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
        setMessage({
          type: "error",
          text: "Could not load authors, publishers or categories. Please check the backend.",
        });
      } finally {
        setLoadingOptions(false);
      }
    }

    fetchDropdowns();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const formData = new FormData();

    formData.append("title", bookTitle.trim());
    formData.append("authorId", authorId);
    formData.append("publisherId", publisherId);
    formData.append("categoryId", categoryId);
    formData.append("shelf", shelf.trim());
    formData.append("description", description.trim());

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const response = await fetch(`${API}/books`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Unable to add book.");
      }

      setMessage({
        type: "success",
        text: "Book added successfully to your library!",
      });

      setBookTitle("");
      setAuthorId("");
      setPublisherId("");
      setCategoryId("");
      setShelf("");
      setDescription("");
      setImageFile(null);

      const fileInput = document.getElementById("book-image");
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Error adding book:", error);
      setMessage({
        type: "error",
        text: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="add-book-page">
      <div className="add-book-heading">
        <span className="add-book-eyebrow">LIBRARY COLLECTION</span>
        <h1>Add a new book<span>.</span></h1>
        <p>
          Grow your collection with another story, idea, or adventure.
        </p>
      </div>

      <div className="add-book-layout">
        <aside className="add-book-sidebar">
          <div className="sidebar-icon">📚</div>

          <span className="sidebar-eyebrow">BUILD YOUR COLLECTION</span>

          <h2>Every book opens a new world.</h2>

          <p>
            Keep your library organized by adding book details,
            classification and a cover image.
          </p>

          <div className="sidebar-divider" />

          <div className="sidebar-tip">
            <span>01</span>
            <div>
              <strong>Book information</strong>
              <p>Add the title and description.</p>
            </div>
          </div>

          <div className="sidebar-tip">
            <span>02</span>
            <div>
              <strong>Classification</strong>
              <p>Choose author, publisher and category.</p>
            </div>
          </div>

          <div className="sidebar-tip">
            <span>03</span>
            <div>
              <strong>Cover image</strong>
              <p>Add an image to make it stand out.</p>
            </div>
          </div>
        </aside>

        <section className="add-book-form-card">
          <div className="form-card-heading">
            <div>
              <h2>Book information</h2>
              <p>Enter the details below to add a book.</p>
            </div>
            <span className="required-note">* Required</span>
          </div>

          {message && (
            <div
              className={`form-message ${message.type}`}
              role="status"
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-section-label">
              <span>01</span> BASIC DETAILS
            </div>

            <div className="modern-form-group full-width">
              <label htmlFor="book-title">
                Book title <span>*</span>
              </label>
              <input
                id="book-title"
                type="text"
                placeholder="e.g. The Great Gatsby"
                value={bookTitle}
                onChange={(event) => setBookTitle(event.target.value)}
                required
              />
            </div>

            <div className="modern-form-group full-width">
              <label htmlFor="book-description">Description</label>
              <textarea
                id="book-description"
                placeholder="What is this book about?"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={4}
              />
              <span className="field-hint">
                A short summary helps readers discover the book.
              </span>
            </div>

            <div className="form-section-label classification-label">
              <span>02</span> CLASSIFICATION
            </div>

            {loadingOptions && (
              <p className="field-hint">Loading authors and categories...</p>
            )}

            <div className="modern-form-grid">
              <div className="modern-form-group">
                <label htmlFor="book-author">Author</label>
                <select
                  id="book-author"
                  value={authorId}
                  onChange={(event) => setAuthorId(event.target.value)}
                >
                  <option value="">Select author</option>
                  {authors.map((author) => (
                    <option key={author.id} value={author.id}>
                      {author.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modern-form-group">
                <label htmlFor="book-publisher">Publisher</label>
                <select
                  id="book-publisher"
                  value={publisherId}
                  onChange={(event) =>
                    setPublisherId(event.target.value)
                  }
                >
                  <option value="">Select publisher</option>
                  {publishers.map((publisher) => (
                    <option key={publisher.id} value={publisher.id}>
                      {publisher.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modern-form-group">
                <label htmlFor="book-category">Category</label>
                <select
                  id="book-category"
                  value={categoryId}
                  onChange={(event) =>
                    setCategoryId(event.target.value)
                  }
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modern-form-group">
                <label htmlFor="book-shelf">Shelf number</label>
                <input
                  id="book-shelf"
                  type="text"
                  placeholder="e.g. A-12"
                  value={shelf}
                  onChange={(event) => setShelf(event.target.value)}
                />
              </div>
            </div>

            <div className="form-section-label image-section-label">
              <span>03</span> BOOK COVER
            </div>

            <div className="modern-form-group">
              <label htmlFor="book-image">Upload cover image</label>
              <input
                id="book-image"
                className="book-file-input"
                type="file"
                accept="image/*"
                onChange={(event) =>
                  setImageFile(event.target.files?.[0] || null)
                }
              />
              <span className="field-hint">
                Optional. Select an image from your computer.
              </span>
              {imageFile && (
                <span className="selected-file">
                  Selected: {imageFile.name}
                </span>
              )}
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="form-reset-button"
                disabled={submitting}
                onClick={() => {
                  setBookTitle("");
                  setAuthorId("");
                  setPublisherId("");
                  setCategoryId("");
                  setShelf("");
                  setDescription("");
                  setImageFile(null);
                  setMessage(null);

                  const fileInput = document.getElementById("book-image");
                  if (fileInput) fileInput.value = "";
                }}
              >
                Clear form
              </button>

              <button
                type="submit"
                className="form-submit-button"
                disabled={submitting}
              >
                {submitting ? "Adding book..." : "＋  Add to library"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

export default AddBook;