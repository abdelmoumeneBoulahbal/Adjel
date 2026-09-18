import { Router }      from 'express'
import multer          from 'multer'
import { protect }     from '../../../middleware/auth.js'
import { requireRole } from '../../../middleware/role.js'
import { validate, merchantDocumentUploadSchema } from '../../../middleware/validate.js'
import { uploadDoc, getDocs }             from './merchant-activation.controller.js'

const router = Router()

const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 5 * 1024 * 1024 }
})

// run this on every route in this router so that the user is authenticated 
// before accessing any of the routes
router.use(protect) 
console.log('Merchant activation routes loaded, all routes are protected and require MERCHANT role')

// after protect, req.user is available, so we can check the role of the user 
// and only allow access to users with the MERCHANT role
router.use(requireRole('MERCHANT'))

router.post('/', upload.single('file'), validate(merchantDocumentUploadSchema), uploadDoc)
router.get('/',  getDocs)

export default router