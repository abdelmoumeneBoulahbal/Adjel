import jwt from 'jsonwebtoken'
import { error } from '../utils/response.js'

export const protect = (req, res, next) => {

  // get token from header
  const authHeader = req.headers.authorization

  console.log('\nAuthorization header:', authHeader)

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return error(res, 'No token provided', 401)
  }

  // split the token from the header
  const token = authHeader.split(' ')[1]

  // verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    console.log('Decoded token:', decoded)
    req.user = decoded
    next()
  } catch (err) {
    return error(res, 'Invalid or expired token', 401)
  }
}