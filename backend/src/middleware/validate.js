import { z } from 'zod'
import { error } from '../utils/response.js'

// ── User Register ──────────────────────────────────────────────
export const registerSchema = z.object({
  firstName:   z.string().min(2,  'First name must be at least 2 characters'),
  lastName:    z.string().min(2,  'Last name must be at least 2 characters'),
  email:       z.string().email('Invalid email format'),
  phoneNumber: z.string()
                .regex(/^(\+213|0)(5|6|7)[0-9]{8}$/, 'Invalid Algerian phone number'),
  password:    z.string()
                .min(8,           'Password must be at least 8 characters')
                .regex(/[A-Z]/,   'Password must contain at least one uppercase letter')
                .regex(/[0-9]/,   'Password must contain at least one number')
                .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
})

// ── User Login ─────────────────────────────────────────────────
export const loginSchema = z.object({
  identifier: z.string().min(1, 'Email or phone number is required'),
  password:   z.string().min(1, 'Password is required'),
})

// ── Validate middleware ───────────────────────────────────
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body)

  if (!result.success) {
    return error(
      res,
      result.error.errors.map(e => ({
        field:   e.path[0],
        message: e.message,
      })),
      400
    )
  }

  req.body = result.data
  next()
}