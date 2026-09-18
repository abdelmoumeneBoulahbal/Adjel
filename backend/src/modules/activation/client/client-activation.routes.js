import { Router }      from 'express'
import multer          from 'multer'
import { protect }     from '../../../middleware/auth.js'
import { requireRole } from '../../../middleware/role.js'
import { validate, clientDocumentUploadSchema } from '../../../middleware/validate.js'
import { uploadDoc, getDocs }             from './client-activation.controller.js'

const router = Router()

const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 5 * 1024 * 1024 }
})

//run this on every route in this router so that the user is authenticated 
// before accessing any of the routes
router.use(protect) 
console.log('Client activation routes loaded, all routes are protected and require CLIENT role')

// after protect, req.user is available, so we can check the role of the user 
// and only allow access to users with the CLIENT role
router.use(requireRole('CLIENT'))

router.post('/', upload.single('file'), validate(clientDocumentUploadSchema), uploadDoc)
router.get('/',  getDocs)

export default router