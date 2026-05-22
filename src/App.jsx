import { useEffect, useRef, useState } from 'react'
import JSZip from 'jszip'
import './App.css'
import NavBar from './components/NavBar'
import About from './components/About'
import Skills from './components/Skills'
import Education from './components/Education'
import Projects from './components/Projects'
import Contact from './components/Contact'

const API_BASE = import.meta.env.VITE_API_BASE || ''
const CONTACT_API_URL = 'http://localhost/react1/contact.php'

function App() {
  const [projectTitle, setProjectTitle] = useState('')
  const [projectCategory, setProjectCategory] = useState('Web App')
  const [selectedFiles, setSelectedFiles] = useState([])
  const [uploadedProjects, setUploadedProjects] = useState([])
  const [uploadMessage, setUploadMessage] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [expandedFiles, setExpandedFiles] = useState({})
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactMessage, setContactMessage] = useState('')
  const [contactResponse, setContactResponse] = useState('')
  const [likes, setLikes] = useState(0)
  const fileInputRef = useRef(null)

  useEffect(() => {
    fetchProjects()

    fetch('http://localhost/react1/contact.php')
      .then((res) => res.json())
      .then((data) => console.log('Backend Status:', data.status))
      .catch((err) => console.error('Backend is unreachable. Check XAMPP!', err))
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/projects`)
      if (!response.ok) {
        throw new Error('Failed to load projects')
      }
      const data = await response.json()
      setUploadedProjects(data)
    } catch (error) {
      setUploadMessage('Unable to load saved projects. Please start the server and refresh.')
    }
  }

  const toggleFileExpand = (projectId, filePath) => {
    const key = `${projectId}-${filePath}`
    setExpandedFiles((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const isTextFile = (file) => {
    const textTypes = [
      'text/',
      'application/javascript',
      'application/json',
      'application/xml',
      'application/xhtml+xml',
      'application/x-httpd-php',
      'application/x-sh',
    ]
    return (
      textTypes.some((type) => file.type.includes(type)) ||
      /\.(js|jsx|ts|tsx|css|html|json|md|py|php|java|c|cpp|h|txt|xml|sh|yml|yaml)$/i.test(file.name)
    )
  }

  const readFileAsText = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result?.toString() || '')
      reader.onerror = reject
      reader.readAsText(file)
    })

  const extractZipFile = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const zip = new JSZip()
      await zip.loadAsync(arrayBuffer)
      const extractedFiles = []

      for (const [filePath, zipEntry] of Object.entries(zip.files)) {
        if (!zipEntry.dir) {
          try {
            const content = await zipEntry.async('text')
            extractedFiles.push({
              name: zipEntry.name,
              path: filePath,
              size: content.length,
              content: content,
            })
          } catch {
            extractedFiles.push({
              name: zipEntry.name,
              path: filePath,
              size: 0,
              content: '[Unable to read binary file]',
            })
          }
        }
      }

      return extractedFiles
    } catch (error) {
      console.error('Error extracting zip:', error)
      return []
    }
  }

  const handleFileChange = (event) => {
    const files = event.target.files ? Array.from(event.target.files) : []
    setSelectedFiles(files)
    setUploadMessage('')
  }

  const handleUpload = async (event) => {
    event.preventDefault()

    if (!projectTitle.trim() || selectedFiles.length === 0) {
      setUploadMessage('Please enter a project title and select at least one file or folder.')
      return
    }

    setIsUploading(true)
    setUploadMessage('')

    try {
      const fileData = []

      for (const file of selectedFiles) {
        const isZip = file.name.toLowerCase().endsWith('.zip')

        if (isZip) {
          const extractedFiles = await extractZipFile(file)
          fileData.push(...extractedFiles)
        } else {
          const fileInfo = {
            name: file.name,
            path: file.webkitRelativePath || file.name,
            size: file.size,
            content: isTextFile(file) ? await readFileAsText(file) : '[Binary or unsupported file type]',
          }
          fileData.push(fileInfo)
        }
      }

      const response = await fetch(`${API_BASE}/api/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: projectTitle.trim(),
          category: projectCategory,
          files: fileData,
        }),
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      setProjectTitle('')
      setSelectedFiles([])
      if (fileInputRef.current) {
        fileInputRef.current.value = null
      }
      setUploadMessage('Project uploaded successfully.')

      await fetchProjects()
    } catch {
      setUploadMessage('Unable to save the selected files. Please try again later.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleContactSubmit = async (event) => {
    event.preventDefault()

    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
      setContactResponse('Error: Please complete all contact fields before sending.')
      return
    }

    try {
      const response = await fetch('http://localhost/portfolio-backend/contact.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: contactName.trim(),
          email: contactEmail.trim(),
          message: contactMessage.trim(),
        }),
      })

      const data = await response.json()
      if (response.ok && data.status === 'success') {
        setContactResponse(`Success: ${data.message}`)
        setContactName('')
        setContactEmail('')
        setContactMessage('')
      } else {
        setContactResponse(`Error: ${data.message || 'Unable to send contact message.'}`)
      }
    } catch (error) {
      setContactResponse(`Error: ${error.message || 'Unable to connect to the contact server.'}`)
    }
  }

  const handleLike = () => {
    setLikes(likes + 1)
  }

  return (
    <div className="portfolio">
      <header>
        <div className="header-inner">
          <img src="/profile.jpg" alt="Alemu Sewnet profile" className="profile-image" />
          <div className="header-text">
            <h1>Alemu Sewnet</h1>
            <NavBar />
          </div>
        </div>
      </header>

      <About />
      <Skills />
      <Education />
      <Projects />
      <Contact
        contactName={contactName}
        contactEmail={contactEmail}
        contactMessage={contactMessage}
        setContactName={setContactName}
        setContactEmail={setContactEmail}
        setContactMessage={setContactMessage}
        contactResponse={contactResponse}
        handleContactSubmit={handleContactSubmit}
      />

      <footer>
        <div className="footer-content">
          <p>&copy; 2026 Alemu Sewnet. All rights reserved.</p>
          <div className="social-media">
            <a href="https://t.me/yourtelegram" target="_blank" rel="noreferrer">Telegram</a>
            <a href="https://tiktok.com/@yourusername" target="_blank" rel="noreferrer">TikTok</a>
            <a href="https://facebook.com/yourprofile" target="_blank" rel="noreferrer">Facebook</a>
            <a href="https://linkedin.com/in/alemu-sewnet" target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="https://github.com/alemusewnet" target="_blank" rel="noreferrer">GitHub</a>
          </div>
          <div className="like-section">
            <button onClick={handleLike} className="like-btn">👍 Like ({likes})</button>
          </div>
          <p className="developed-by">Developed by Alemu Sewnet, 3rd year computer science student</p>
        </div>
      </footer>
    </div>
  )
}

export default App
