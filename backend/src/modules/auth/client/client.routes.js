// modules/auth/client/client.routes.js

import { Router } from "express";

import {
    register,
    login,
    me,
} from "./client.controller.js";

import { validate } from "../../../middleware/validate.js";
import { protect } from "../../../middleware/auth.js";
import { requireRole } from "../../../middleware/role.js";

import {
    registerSchema,
    loginSchema,
} from "../../../middleware/validate.js";


const router = Router();


// Register client
router.post(
    "/register",
    validate(registerSchema),
    register
);


// Login client
router.post(
    "/login",
    validate(loginSchema),
    login
);


// Get current client
router.get(
    "/me",
    protect,
    requireRole("CLIENT"),
    me
);


export default router;