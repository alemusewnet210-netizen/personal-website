import React from 'react'

export default function Skills() {
  return (
    <section id="skills">
      <h2 className="skills-title">Skills & Technologies</h2>
      <div className="skills-list">
        <div className="skill-category">
          <h3>Web Development</h3>
          <ul>
            <li>HTML</li>
            <li>CSS</li>
            <li>JavaScript</li>
            <li>PHP</li>
            <li>React</li>
          </ul>
        </div>
        <div className="skill-category">
          <h3>Machine Learning</h3>
          <ul>
            <li>Python</li>
            <li>Data Analysis</li>
            <li>Predictive Modeling</li>
          </ul>
        </div>
        <div className="skill-category">
          <h3>Computer Graphics</h3>
          <ul>
            <li>OpenGL</li>
            <li>3D Modeling</li>
            <li>Visualization</li>
          </ul>
        </div>
        <div className="skill-category">
          <h3>Other</h3>
          <ul>
            <li>Problem Solving</li>
            <li>Team Collaboration</li>
            <li>Project Management</li>
          </ul>
        </div>
      </div>
    </section>
  )
}
