import { Router } from 'express'
import { adminLoginSchema } from './admin.schema.js'
import { validate } from '../../middleware/validate.js'
import { adminLogin } from './admin.service.js'

const router = Router()

router.post('/login', validate(adminLoginSchema), adminLogin);

export default router