import React from 'react'

export default function Contact({
  contactName,
  contactEmail,
  contactMessage,
  setContactName,
  setContactEmail,
  setContactMessage,
  contactResponse,
  handleContactSubmit,
}) {
  return (
    <section id="contact">
      <h2 className="contact-title">Contact Me</h2>
      <p>Feel free to reach out for collaborations or opportunities!</p>
      <div className="contact-info">
        <p><strong>Email:</strong> <a href="mailto:alemusewnet210@gmail.com">alemusewnet210@gmail.com</a></p>
        <p><strong>Phone:</strong> <a href="tel:+251932261668">+251932261668</a></p>
        <p><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/alemu-sewnet" target="_blank" rel="noreferrer">linkedin.com/in/alemu-sewnet</a></p>
      </div>
      <form className="contact-form" onSubmit={handleContactSubmit}>
        <label>
          Name
          <input type="text" value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="Your name" />
        </label>
        <label>
          Email
          <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="Your email" />
        </label>
        <label>
          Message
          <textarea value={contactMessage} onChange={(e) => setContactMessage(e.target.value)} placeholder="Write your message" rows="5" />
        </label>
        <button type="submit" className="submit-btn">Send Message</button>
        {contactResponse && <p className="form-response">{contactResponse}</p>}
      </form>
    </section>
  )
}
