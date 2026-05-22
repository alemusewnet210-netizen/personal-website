import express from 'express'
import cors from 'cors'
import sqlite3 from 'sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dbPath = path.join(__dirname, 'projects.db')
const port = process.env.PORT || 5001

const app = express()
app.use(cors())
app.use(express.json({ limit: '20mb' }))

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Unable to open SQLite database:', err)
    process.exit(1)
  }
})

const initDb = () => {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        date TEXT NOT NULL,
        created_at TEXT NOT NULL
      )
    `)

    db.run(`
      CREATE TABLE IF NOT EXISTS files (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        path TEXT NOT NULL,
        size INTEGER NOT NULL,
        content TEXT NOT NULL,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
      )
    `)
  })
}

app.get('/api/projects', (req, res) => {
  const sql = `
    SELECT p.id AS projectId, p.title, p.category, p.date, f.id AS fileId,
      f.name, f.path, f.size, f.content
    FROM projects p
    LEFT JOIN files f ON f.project_id = p.id
    ORDER BY p.id DESC, f.id ASC
  `

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Failed to load projects:', err)
      return res.status(500).json({ error: 'Unable to load projects' })
    }

    const projectsById = rows.reduce((map, row) => {
      if (!map[row.projectId]) {
        map[row.projectId] = {
          id: row.projectId,
          title: row.title,
          category: row.category,
          date: row.date,
          files: [],
        }
      }

      if (row.fileId) {
        map[row.projectId].files.push({
          id: row.fileId,
          name: row.name,
          path: row.path,
          size: row.size,
          content: row.content,
        })
      }

      return map
    }, {})

    res.json(Object.values(projectsById))
  })
})

app.post('/api/projects', (req, res) => {
  const { title, category, files } = req.body

  if (!title || !category || !Array.isArray(files) || files.length === 0) {
    return res.status(400).json({ error: 'Project title, category, and files are required.' })
  }

  const createdAt = new Date().toLocaleDateString()
  const insertProjectSql = `
    INSERT INTO projects (title, category, date, created_at)
    VALUES (?, ?, ?, ?)
  `

  db.run(insertProjectSql, [title, category, createdAt, new Date().toISOString()], function (err) {
    if (err) {
      console.error('Failed to insert project:', err)
      return res.status(500).json({ error: 'Unable to save project.' })
    }

    const projectId = this.lastID
    const insertFileSql = `
      INSERT INTO files (project_id, name, path, size, content)
      VALUES (?, ?, ?, ?, ?)
    `

    const insertFileStmt = db.prepare(insertFileSql)

    files.forEach((file) => {
      insertFileStmt.run(projectId, file.name, file.path, file.size, file.content)
    })

    insertFileStmt.finalize((fileErr) => {
      if (fileErr) {
        console.error('Failed to save project files:', fileErr)
        return res.status(500).json({ error: 'Unable to save project files.' })
      }

      res.status(201).json({
        id: projectId,
        title,
        category,
        date: createdAt,
        files,
      })
    })
  })
})

app.listen(port, () => {
  initDb()
  console.log(`Project database server is running on http://localhost:${port}`)
})
