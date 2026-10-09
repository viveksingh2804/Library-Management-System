import React, { useState } from "react";
import "./AddMemberPage.css";

const API_URL = "http://localhost:8081/api/members";

function AddMemberPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [membershipDate, setMembershipDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name.trim() || !email.trim()) {
      setMessage({
        type: "error",
        text: "Name and email are required.",
      });
      return;
    }

    const newMember = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
      membership_date: membershipDate || null,
    };

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMember),
      });

      if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
          errorText || "Unable to register this member."
        );
      }

      setMessage({
        type: "success",
        text: `${name.trim()} has been registered successfully!`,
      });

      setName("");
      setEmail("");
      setPhone("");
      setAddress("");
      setMembershipDate("");
    } catch (error) {
      console.error("Error adding member:", error);

      setMessage({
        type: "error",
        text:
          error.message ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="add-member-page">
      <div className="member-page-container">

        {/* Page Header */}
        <header className="member-page-header">
          <span className="member-eyebrow">
            LIBRARY MEMBERSHIP
          </span>

          <h1>Every reader belongs.</h1>

          <p>
            Welcome new readers to your library. Register their
            details below to get their membership started.
          </p>
        </header>

        {/* Notification */}
        {message.text && (
          <div
            className={`member-notification ${
              message.type === "success"
                ? "member-notification-success"
                : "member-notification-error"
            }`}
            role="status"
          >
            <span className="member-notification-icon">
              {message.type === "success" ? "✓" : "!"}
            </span>

            <span>{message.text}</span>

            <button
              type="button"
              onClick={() =>
                setMessage({ type: "", text: "" })
              }
              aria-label="Dismiss message"
            >
              ×
            </button>
          </div>
        )}

        <section className="member-registration-layout">

          {/* Left Information Panel */}
          <aside className="member-welcome-panel">
            <div className="member-welcome-decoration">
              <span>✦</span>
            </div>

            <span className="member-welcome-label">
              A NEW CHAPTER
            </span>

            <h2>
              Great stories
              <br />
              start with
              <br />
              <em>a reader.</em>
            </h2>

            <p>
              Create a membership record and make it easier
              to manage readers and their library journeys.
            </p>

            <div className="member-welcome-divider" />

            <div className="member-welcome-feature">
              <span>01</span>
              <div>
                <strong>Reader details</strong>
                <p>Keep member information organized.</p>
              </div>
            </div>

            <div className="member-welcome-feature">
              <span>02</span>
              <div>
                <strong>Membership record</strong>
                <p>Record when a reader joins the library.</p>
              </div>
            </div>

            <div className="member-welcome-bottom">
              <span>📚</span>
              <span>READ · DISCOVER · GROW</span>
            </div>
          </aside>

          {/* Registration Form */}
          <section className="member-form-panel">
            <div className="member-form-heading">
              <div className="member-form-icon">
                ♙
              </div>

              <div>
                <h2>Register a Member</h2>
                <p>Fill in the details to create a new record.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>

              <div className="member-form-group">
                <label htmlFor="memberName">
                  Full name <span>*</span>
                </label>

                <input
                  id="memberName"
                  type="text"
                  placeholder="Enter member's full name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  autoComplete="name"
                  required
                />
              </div>

              <div className="member-form-group">
                <label htmlFor="memberEmail">
                  Email address <span>*</span>
                </label>

                <input
                  id="memberEmail"
                  type="email"
                  placeholder="reader@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="member-form-row">
                <div className="member-form-group">
                  <label htmlFor="memberPhone">
                    Phone number
                  </label>

                  <input
                    id="memberPhone"
                    type="tel"
                    placeholder="Enter phone number"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    autoComplete="tel"
                  />
                </div>

                <div className="member-form-group">
                  <label htmlFor="membershipDate">
                    Joining date
                  </label>

                  <input
                    id="membershipDate"
                    type="date"
                    value={membershipDate}
                    onChange={(event) =>
                      setMembershipDate(event.target.value)
                    }
                  />
                </div>
              </div>

              <div className="member-form-group">
                <label htmlFor="memberAddress">
                  Residential address
                </label>

                <textarea
                  id="memberAddress"
                  placeholder="Enter the member's address"
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  rows="3"
                  autoComplete="street-address"
                />
              </div>

              <div className="member-form-required-note">
                <span>*</span>
                Required fields
              </div>

              <button
                type="submit"
                className="member-submit-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="member-button-spinner" />
                    Registering Member...
                  </>
                ) : (
                  <>
                    Register Member
                    <span>→</span>
                  </>
                )}
              </button>

              <p className="member-form-footer">
                Please verify the details before submitting.
              </p>

            </form>
          </section>
        </section>

        <footer className="member-page-footer">
          <span>✦</span>
          A welcoming library begins with its readers.
        </footer>

      </div>
    </main>
  );
}

export default AddMemberPage;