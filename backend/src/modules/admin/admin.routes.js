import { Router }      from 'express'
import { protect }     from '../../../middleware/auth.js'
import { requireRole } from '../../../middleware/role.js'
import { validate }    from '../../../middleware/validate.js'
import {
  rejectDocumentSchema,
  updateStatusSchema,
  fillExtractedInfoSchema,
  addUserSchema,
} from './admin.schema.js'
import {
// User Management
  getAllUsers,
  getUserById,

  deleteUser,
  banUser,
  permaBanUser,

  activateUser,
  deactivateUser,
  updateUserStatus,

  addUser,

// Document Review
  getAllDocuments,
  getUserDocuments,

  approveDocument,
  rejectDocument,

  fillExtractedInfo,
} from './admin.controller.js'



const router = Router()

// protect all routes — admin only
router.use(protect)
router.use(requireRole('ADMIN'))

// ── User Management ────────────────────────────────────────────
router.get('/users',                    getAllUsers)
router.get('/users/:id',                getUserById)
router.post('/users',                   validate(addUserSchema),      addUser)
router.put('/users/:id/status',         validate(updateStatusSchema), updateUserStatus)
router.put('/users/:id/activate',       activateUser)
router.put('/users/:id/deactivate',     deactivateUser)
router.put('/users/:id/ban',            banUser)
router.put('/users/:id/perma-ban',      permaBanUser)
router.delete('/users/:id',             deleteUser)

// ── Document Review ────────────────────────────────────────────
router.get('/documents',                getAllDocuments)
router.get('/documents/user/:userId',   getUserDocuments)
router.put('/documents/:id/approve',    approveDocument)
router.put('/documents/:id/reject',     validate(rejectDocumentSchema), rejectDocument)

// ── Account Activation (fill extracted info) ───────────────────
router.post('/users/:id/activate-account', validate(fillExtractedInfoSchema), fillExtractedInfo)

export default router