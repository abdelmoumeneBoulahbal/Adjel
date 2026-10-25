import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'

import clientAuthRoutes from "./modules/auth/client/client.routes.js"
import clientActivationRoutes from "./modules/activation/client/client-activation.routes.js"


import merchantAuthRoutes from "./modules/auth/merchant/merchant.routes.js"
import merchantActivationRoutes from "./modules/activation/merchant/merchant-activation.routes.js"

import adminAuthRoutes from "./modules/admin/admin-auth.routes.js"
import adminRoutes from "./modules/admin/admin.routes.js"

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
app.use("/api/client/documents", clientActivationRoutes)
app.use("/api/merchant/documents", merchantActivationRoutes)

app.use("/api/admin/auth", adminAuthRoutes)
app.use("/api/admin", adminRoutes)


export default app