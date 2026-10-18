import { Router } from 'express'
import { validate } from '../../../middleware/validate.js'
import { adminLoginSchema } from './admin.schema.js'
import { adminLogin } from './admin.controller.js'

const router = Router()

router.post('/login', validate(adminLoginSchema), adminLogin)

export default router