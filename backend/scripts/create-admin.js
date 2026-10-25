
import 'dotenv/config'
import bcrypt from 'bcrypt'
import prisma from '../src/config/prisma.js'
import { createInterface } from 'node:readline/promises'
import { stdin, stdout } from 'node:process'

const rl = createInterface({ input: stdin, output: stdout })

async function main() {
  try {
    const firstName = (await rl.question('First name: '))
      .trim()
      .toLowerCase()

    const lastName = (await rl.question('Last name: '))
      .trim()
      .toLowerCase()
    const email = (await rl.question('Email: ')).trim().toLowerCase()
    const phoneNumber = await rl.question('Phone number: ')
    const username = await rl.question('Username: ')
    const roleInput = await rl.question(
      'Role (default ADMIN): '
    )

    const role = roleInput.trim() || 'ADMIN'

    if (!['ADMIN'].includes(role)) {
      throw new Error('Invalid Admin role')
    }

   
    const password = await rl.question('Password: ')

    if (!password) {
      throw new Error('Set ADMIN_PASSWORD before running this script')
    }

    if (
      firstName.length < 2 ||
      lastName.length < 2 ||
      !email ||
      !phoneNumber.trim() ||
      username.trim().length < 3
    ) {
      throw new Error('Please provide valid Admin details')
    }

    // Check whether the email or username already exists.
    const existingAdmin = await prisma.admin.findFirst({
      where: {
        OR: [
          { email },
          { username: username.trim() },
        ],
      },
    })

    if (existingAdmin) {
      throw new Error('An Admin with this email or username already exists')
    }

    // Hash the password before saving it.
    const passwordHash = await bcrypt.hash(password, 12)

    const admin = await prisma.admin.create({
      data: {
        firstName,
        lastName,
        email,
        phoneNumber: phoneNumber.trim(),
        username: username.trim(),
        passwordHash,
        role,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        username: true,
        role: true,
      },
    })

    console.log('\nAdmin created successfully:')
    console.table(admin)
  } catch (error) {
    console.error('Failed to create Admin:', error.message)
    process.exitCode = 1
  } finally {
    rl.close()
    await prisma.$disconnect()
  }
}

main()
