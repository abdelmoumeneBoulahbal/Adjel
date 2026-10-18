// Admin schema seperated from the main schema file for better organization and maintainability.
import { z } from 'zod'

export const adminSignupSchema = z.object({  
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.email({ error: 'Invalid email format' }),
    phoneNumber: z.string()
                .regex(/^(\+213|0)(5|6|7)[0-9]{8}$/, 'Invalid Algerian phone number'),
    username: z.string().min(3, 'Username must be at least 3 characters'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
    role: z.enum(['SUPER_ADMIN', 'ADMIN'], { message: 'Invalid role' }),
})


export const adminLoginSchema = z.object({
    email: z.email({ error: 'Invalid email format' }),
    password: z.string().min(1, 'Password is required'),
})
