import { error } from '../utils/response.js'

export const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return error(res, 'Forbidden — insufficient permissions', 403)
  }
  next()
}