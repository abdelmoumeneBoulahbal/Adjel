import bcrypt from "bcrypt";
import prisma from "../../../config/prisma.js";
import { generateToken } from "../../../utils/jwt.js";


// Register a new merchant
export const registerMerchant = async ({
    firstName,
    lastName,
    email,
    phoneNumber,
    password,
}) => {

    const [
        existingClientEmail,
        existingMerchantEmail,
        existingClientPhone,
        existingMerchantPhone,
    ] = await Promise.all([
        prisma.client.findUnique({ where: { email } }),
        prisma.merchant.findUnique({ where: { email } }),
        prisma.client.findUnique({ where: { phoneNumber } }),
        prisma.merchant.findUnique({ where: { phoneNumber } }),
    ]);

    if (existingClientEmail || existingMerchantEmail) {
        throw new Error("EMAIL_ALREADY_EXISTS");
    }

    if (existingClientPhone || existingMerchantPhone) {
        throw new Error("PHONE_ALREADY_EXISTS");
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create merchant
    const merchant = await prisma.merchant.create({
        data: {
            firstName,
            lastName,
            email,
            phoneNumber,
            passwordHash
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
            createdAt: true
        },
    });


    return merchant;
};



// Login merchant
export const loginMerchant = async ({
    identifier,
    password,
}) => {

    // Find merchant by email OR phone number
    const merchant = await prisma.merchant.findFirst({
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
    if (!merchant) {
        throw new Error("INVALID_CREDENTIALS");
    }


    // Compare password
    const passwordMatch = await bcrypt.compare(
        password,
        merchant.passwordHash
    );


    if (!passwordMatch) {
        throw new Error("INVALID_CREDENTIALS");
    }


    // Generate JWT
    const token = generateToken({
        id: merchant.id,
        type: "MERCHANT",
    });


    // Remove passwordHash
    const safeMerchant = {
        id: merchant.id,
        firstName: merchant.firstName,
        lastName: merchant.lastName,
        email: merchant.email,
        phoneNumber: merchant.phoneNumber,
        createdAt: merchant.createdAt,
    };


    return {
        merchant: safeMerchant,
        token,
    };
};




// Get current merchant
export const getMe = async (merchantId) => {

    const merchant = await prisma.merchant.findUnique({
        where: {
            id: merchantId,
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


    if (!merchant) {
        throw new Error("MERCHANT_NOT_FOUND");
    }


    return merchant;
};