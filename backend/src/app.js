import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'

const app = express()

// ── Middleware ──────────────────────────────────────────
app.use(express.json())     // parse JSON request bodies
app.use(cors())             // allow frontend to call API
app.use(helmet())           // secure HTTP headers
app.use(morgan('dev'))      // log requests in terminal

// ── Health check ───────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is healthy' })
})

// ── Routes ────────────────────────────────
export default app