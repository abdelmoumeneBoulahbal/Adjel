import prisma from '../../../config/prisma.js'

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