import React from 'react'

export default function Projects() {
  return (
    <section id="projects">
      <h2 className="projects-title">My Projects</h2>
      <p>Here are some of the projects I have completed, organized by category, and a list of future work I plan to build.</p>

      <div className="project-category">
        <h3>Completed Projects</h3>
        <div className="project-list">
          <div className="project">
            <span className="project-tag">Web App</span>
            <h3>Hotel Management System</h3>
            <p>A comprehensive system for managing hotel operations, including room bookings, guest management, and billing. Built using HTML, CSS, JavaScript, and PHP for full-stack functionality.</p>
            <p><strong>Technologies:</strong> HTML, CSS, JavaScript, PHP</p>
            <div className="project-links">
              <a href="https://github.com/alemusewnet/hotel-management-system" target="_blank" rel="noreferrer">GitHub Repo</a>
              <a href="https://alemusewnet.github.io/hotel-management-system" target="_blank" rel="noreferrer">Live Demo</a>
            </div>
          </div>
          <div className="project">
            <span className="project-tag">Machine Learning</span>
            <h3>Loan Default Prediction</h3>
            <p>A predictive model that analyzes loan data to estimate the risk of default. This project demonstrates my ability to work with data, Python, and machine learning techniques.</p>
            <p><strong>Technologies:</strong> Python, Scikit-learn, Data Analysis</p>
            <div className="project-links">
              <a href="https://github.com/alemusewnet/loan-default-prediction" target="_blank" rel="noreferrer">GitHub Repo</a>
              <a href="https://alemusewnet.github.io/loan-default-prediction" target="_blank" rel="noreferrer">Live Demo</a>
            </div>
          </div>
          <div className="project">
            <span className="project-tag">Graphics</span>
            <h3>Student Cafeteria Simulation</h3>
            <p>An OpenGL project simulating a student cafeteria environment, with realistic visual elements and interaction design to showcase computer graphics skills.</p>
            <p><strong>Technologies:</strong> OpenGL, C/C++</p>
            <div className="project-links">
              <a href="https://github.com/alemusewnet/cafeteria-simulation" target="_blank" rel="noreferrer">GitHub Repo</a>
            </div>
          </div>
          <div className="project project-highlight">
            <span className="project-tag">React</span>
            <h3 className="project-highlight-title">Dormitory Management System</h3>
            <p className="project-highlight-text">A dormitory management web application built with React, designed to handle room assignments, resident tracking, and maintenance requests.</p>
            <p className="project-highlight-text"><strong>Technologies:</strong> React, JavaScript, HTML, CSS</p>
            <div className="project-links">
              <a href="https://github.com/alemusewnet/dormitory-management" target="_blank" rel="noreferrer">GitHub Repo</a>
              <a href="https://alemusewnet.github.io/dormitory-management" target="_blank" rel="noreferrer">Live Demo</a>
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}
