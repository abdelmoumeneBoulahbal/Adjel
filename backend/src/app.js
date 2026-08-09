import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'

import clientAuthRoutes from "./modules/auth/client/client.routes.js"
import merchantAuthRoutes from "./modules/auth/merchant/merchant.routes.js"

const app = express()

// ── Middleware ──────────────────────────────────────────
app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(morgan('dev'))


// ── Health check ───────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is healthy' })
})


// ── Routes ──────────────────────────────────────────────
app.use("/api/auth/client", clientAuthRoutes)
app.use("/api/auth/merchant", merchantAuthRoutes)


export default app