import { uploadDocument, getDocuments } from './client-activation.service.js'
import { success, error }               from '../../utils/response.js'

// ── Upload document ────────────────────────────────────────────────────────
export const uploadDoc = async (req, res) => {
  try {
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
      return error(res, 'File upload failed, please try again', 500)
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