import { uploadDocument, getDocuments } from './client-activation.service.js'
import { success, error }               from '../../../utils/response.js'

// ── Upload document ────────────────────────────────────────────────────────
export const uploadDoc = async (req, res) => {
  try {
    console.log('\x1b[36m\n-> Controller:\x1b[0m')
    console.log('User ID from token:', req.user.id, '\nRole:', req.user.role, '\nRequest body:', req.body, '\nFile info:', req.file)
    console.log('Upload document request received for user:', req.user.id, '\nwith file:', req.file?.originalname, '\nand type:', req.body.type)

    // check file exists
    if (!req.file) {
      return error(res, 'No file provided', 400)
    }

    // check file type
    if (req.file.mimetype !== 'application/pdf') {
      return error(res, 'Only PDF files are allowed', 400)
    }

    // check file size
  if (req.file.size > 5 * 1024 * 1024) {
      return error(res, 'File must be under 5MB', 400)
    }

    const { type } = req.body

    const doc = await uploadDocument(req.user.id, type, req.file)
    return success(res, doc, 'Document uploaded successfully', 201)

  } catch (err) {
    if (err.message === 'UPLOAD_FAILED') {
      return error(res, 'Failed to upload document', 500)
    }
    return error(res, 'Something went wrong', 500)
  }
}

// ── Get documents ──────────────────────────────────────────────────────────
export const getDocs = async (req, res) => {
  try {
    const docs = await getDocuments(req.user.id)
    return success(res, docs, 'Documents retrieved', 200)
  } catch (err) {
    return error(res, 'Something went wrong', 500)
  }
}