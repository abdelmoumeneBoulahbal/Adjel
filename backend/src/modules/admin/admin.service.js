import prisma from '../../config/prisma.js'
import bcrypt from 'bcrypt'
import { generateToken } from '../../utils/jwt.js'


export const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body

    // Find Admin by username
    const admin = await prisma.admin.findUnique({
      where: { username }
    })

    // Use the same error for unknown email and wrong password
    if (!admin) {
      return res.status(401).json({
        message: 'Invalid username or password'
      })
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      admin.passwordHash
    )

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid username or password'
      })
    }

    // Generate JWT after successful authentication
    const token = generateToken({
      id: admin.id,
      role: admin.role
    })

    // Return token and safe Admin information
    return res.status(200).json({
      message: 'Login successful',
      token,
      admin: {
        id: admin.id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        username: admin.username,
        role: admin.role
      }
    })
  } catch (error) {
    console.error('Admin login error:', error)

    return res.status(500).json({
      message: 'Internal server error'
    })
  }
}



export const getAllUsers = async ({ page = 1, limit = 20 }) => {
  const skip = (Number(page) - 1) * Number(limit)

  const [clients, total] = await Promise.all([
    prisma.client.findMany({
      skip,
      take: Number(limit),
      select: {
        id:            true,
        firstName:     true,
        lastName:      true,
        email:         true,
        phoneNumber:   true,
        accountStatus: true,
        createdAt:     true,
        
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.client.count(),
  ])

  return {
    clients,
    pagination: {
      page:       Number(page),
      limit:      Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    }
  }
}

