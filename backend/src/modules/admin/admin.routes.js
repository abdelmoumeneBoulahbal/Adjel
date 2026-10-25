
import { Router } from 'express'
import { protect } from '../../middleware/auth.js'
import { requireRole } from '../../middleware/role.js'
// import { validate } from '../../middleware/validate.js'

// import {
//   rejectDocumentSchema,
//   updateStatusSchema,
//   fillExtractedInfoSchema,
//   addUserSchema,
// } from './admin.schema.js'

import {
  // User Management
  getAllUsersController,
  // getUserById,
  // deleteUser,
  // banUser,
  // permaBanUser,
  // activateUser,
  // deactivateUser,
  // updateUserStatus,
  // addUser,

  // Document Review
  // getAllDocuments,
  // getUserDocuments,
  // approveDocument,
  // rejectDocument,

  // Account Activation
  // fillExtractedInfo,
} from './admin.controller.js'

const router = Router()

// Protect all enabled routes
router.use(protect)
router.use(requireRole('ADMIN'))

// ── User Management ────────────────────────────────────────────
router.get('/users', getAllUsersController)

// Uncomment each route when its controller is ready

// router.get('/users/:id', getUserById)
// router.post('/users', validate(addUserSchema), addUser)
// router.put('/users/:id/status', validate(updateStatusSchema), updateUserStatus)
// router.put('/users/:id/activate', activateUser)
// router.put('/users/:id/deactivate', deactivateUser)
// router.put('/users/:id/ban', banUser)
// router.put('/users/:id/perma-ban', permaBanUser)
// router.delete('/users/:id', deleteUser)

// ── Document Review ────────────────────────────────────────────
// router.get('/documents', getAllDocuments)
// router.get('/documents/user/:userId', getUserDocuments)
// router.put('/documents/:id/approve', approveDocument)
// router.put('/documents/:id/reject', validate(rejectDocumentSchema), rejectDocument)

// ── Account Activation ─────────────────────────────────────────
// router.post('/users/:id/activate-account', validate(fillExtractedInfoSchema), fillExtractedInfo)

export default router