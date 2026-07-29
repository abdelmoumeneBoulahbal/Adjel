import {
    registerClient,
    loginClient,
    getMe,
} from "./client.service.js";


// POST /api/auth/register
export const register = async (req, res) => {
    try {

        const user = await registerClient(req.body);


        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: user,
        });


    } catch (error) {
        console.error(error);

        if (error.message === "EMAIL_ALREADY_EXISTS") {
            return res.status(409).json({
                success: false,
                message: "Email already exists",
            });
        }


        if (error.message === "PHONE_ALREADY_EXISTS") {
            return res.status(409).json({
                success: false,
                message: "Phone number already exists",
            });
        }


        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};




// POST /api/auth/login
export const login = async (req, res) => {
    try {

        const result = await loginClient(req.body);


        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: result,
        });


    } catch (error) {

        if (error.message === "INVALID_CREDENTIALS") {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};




// GET /api/auth/me
export const me = async (req, res) => {
    try {

        const user = await getMe(req.user.id);


        return res.status(200).json({
            success: true,
            data: user,
        });


    } catch (error) {

        console.log(error);

        if (error.message === "USER_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }


        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};