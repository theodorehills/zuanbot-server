import express from "express"
import sqlite3 from "sqlite3"
import bodyParser from "body-parser"

const app = express()
const port = 3000

const db = new sqlite3.Database("./db/data.db", (err) => {
  if (err) {
    console.error("Error connecting to the database:", err.message)
  } else {
    console.log("Successfully connected to the database.")
  }
})

app.use(bodyParser.json())

app.get("/", (req, res) => {
  res.send("Hello, Express with TypeScript!")
})

app.get("/api", (req, res) => {
  const level = req.query["level"]

  let query: string
  if (level && (level == "min" || level == "max")) {
    // 有 Level 字段
    query = `SELECT text FROM main WHERE level = '${level}' ORDER BY RANDOM() LIMIT 1`
  } else {
    // 无 Level 字段或 Level 字段错误
    query = `SELECT * FROM main ORDER BY RANDOM() LIMIT 1`
  }

  db.get(query, (err, row: { id: number, text: string, level: "min" | "max" }) => {
    if (err) {
      res.status(500).json({ error: "Error fetching data" })
    } else if (row) {
      res.contentType("text/plain").send(row["text"])
    } else {
      res.json({ message: "No data found" })
    }
  })
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
