import React, { useState } from "react";
import "./contact.css";

const Navigation = React.lazy(() => import("../layout/Navigation"));
const Footer = React.lazy(() => import("../layout/Footer"));

/**chat gpt scanned and optimised */

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Simulate a POST request (Replace this with an actual API call)
      console.log("Submitting form data:", formData);
      setTimeout(() => {
        alert("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
        setIsSubmitting(false);
      }, 1000);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to send your message. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navigation />
      <div className="background-page">
        <div className="container contact-page mb-5">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-md-10">
              <div className="card shadow-sm p-4">
                <h3 className="text-center mb-4">Contact Us</h3>
                <p className="text-center text-muted mb-4">
                  We'd love to hear from you! Reach out through the details below or fill out the contact
                  form.
                </p>
                <div className="mb-4">
                  <p>
                    <strong>Email:</strong>{" "}
                    <a href="mailto:taskvibeofficial@gmail.com" className="text-decoration-none">
                      taskvibeofficial@gmail.com
                    </a>
                  </p>
                  {/* <p>
                    <strong>Phone:</strong> +1 (555) 123-4567
                  </p>
                  <p>
                    <strong>Address:</strong> 123 TaskVibe Street, Suite 100, New York, NY, USA
                  </p> */}
                </div>
                <h5 className="mb-3">Send Us a Message</h5>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Your Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Your Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="message" className="form-label">
                      Message
                    </label>
                    <textarea
                      className="form-control"
                      id="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Write your message here"
                      required></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
