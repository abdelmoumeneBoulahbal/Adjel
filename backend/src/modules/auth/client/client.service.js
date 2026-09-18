import bcrypt from "bcrypt";
import prisma from "../../../config/prisma.js";
import { generateToken } from "../../../utils/jwt.js";


// Register a new client
export const registerClient = async ({
    firstName,
    lastName,
    email,
    phoneNumber,
    password,
}) => {

    // Check if email already exists
    const existingEmail = await prisma.client.findUnique({
        where: {
            email,
        },
    });

    if (existingEmail) {
        throw new Error("EMAIL_ALREADY_EXISTS");
    }


    // Check if phone number already exists
    const existingPhone = await prisma.client.findUnique({
        where: {
            phoneNumber,
        },
    });

    if (existingPhone) {
        throw new Error("PHONE_ALREADY_EXISTS");
    }


    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);



    // Create client
    const client = await prisma.client.create({
        data: {
            firstName,
            lastName,
            email,
            phoneNumber,
            passwordHash,
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
            createdAt: true,
        },
    });


    return client;
};



// Login client
export const loginClient = async ({
    identifier,
    password,
}) => {

    // Find client by email OR phone number
    const client = await prisma.client.findFirst({
        where: {
            OR: [
                {
                    email: identifier,
                },
                {
                    phoneNumber: identifier,
                },
            ],
        },
    });


    // Same error for security reasons
    if (!client) {
        throw new Error("INVALID_CREDENTIALS");
    }


    // Compare password
    const passwordMatch = await bcrypt.compare(
        password,
        client.passwordHash
    );


    if (!passwordMatch) {
        throw new Error("INVALID_CREDENTIALS");
    }


    // Generate JWT
    const token = generateToken({
        id: client.id,
        role: "CLIENT",
    });


    // Remove passwordHash
    const safeClient = {
        id: client.id,
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.email,
        phoneNumber: client.phoneNumber,
        createdAt: client.createdAt,
    };


    return {
        client: safeClient,
        token,
    };
};

// Get current client
export const getMe = async (clientId) => {
  const client = await prisma.client.findUnique({
    where: { id: clientId },
    select: {
      id:            true,
      firstName:     true,
      lastName:      true,
      email:         true,
      phoneNumber:   true,
      role:          true,
      accountStatus: true,
      createdAt:     true,

      documents: {
        select: {
          id:     true,
          type:   true,
          status: true,
        }
      },
    }
  })

  if (!client) throw new Error('CLIENT_NOT_FOUND')

  return client
}