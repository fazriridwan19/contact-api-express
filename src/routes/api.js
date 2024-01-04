import express from "express";
import userController from "../controllers/user-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";
import contactController from "../controllers/contact-controller.js";

export const router = express.Router();
router.use(authMiddleware);

// USER ROUTER
router.get("/api/users/current", userController.get);
router.patch("/api/users/current", userController.update);
router.delete("/api/users/logout", userController.logout);

// CONTACT ROUTER
router.post("/api/contacts", contactController.create);
