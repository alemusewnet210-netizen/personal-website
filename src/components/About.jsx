import React from 'react'

export default function About() {
  return (
    <section id="about" className="hero">
      <h2 className="about-title">About Me</h2>
      <p className="about-text">Hello! I'm Alemu Sewnet, a dedicated 3rd-year Computer Science student with a strong passion for technology and innovation. My journey in computer science has equipped me with a diverse skill set, allowing me to explore various domains including web development, machine learning, and computer graphics.</p>
      <p className="about-text">I believe in the power of technology to solve real-world problems and am committed to continuous learning and growth in this ever-evolving field. When I'm not coding, I enjoy exploring new technologies and collaborating on exciting projects.</p>
      <div className="contact-info">
        <p className="about-contact"><strong>Email:</strong> <a href="mailto:alemusewnet210@gmail.com">alemusewnet210@gmail.com</a></p>
        <p className="about-contact"><strong>Phone:</strong> <a href="tel:+251932261668">+251932261668</a></p>
      </div>
      <div className="about-actions">
        <a className="download-cv-btn" href="/resume.txt" download>
          Download CV
        </a>
      </div>
    </section>
  )
}
