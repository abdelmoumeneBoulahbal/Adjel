// modules/auth/client/client.routes.js

import { Router } from "express";

import {
    register,
    login,
    me,
} from "./merchant.controller.js";

import { validate } from "../../../middleware/validate.js";
import { protect } from "../../../middleware/auth.js";
import { requireRole } from "../../../middleware/role.js";

import {
    registerSchema,
    loginSchema, 
} from "../../../middleware/validate.js";


const router = Router();


// Register merchant
router.post(
    "/register",
    validate(registerSchema),
    register
);


// Login merchant
router.post(
    "/login",
    validate(loginSchema),
    login
);


// Get current merchant
router.get(
    "/me",
    protect,
    requireRole("MERCHANT"),
    me
);


export default router;