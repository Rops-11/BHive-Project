import express, { Request, Response } from "express";
import AuthController from "../controllers/auth";
const router = express.Router();

const authController = new AuthController();

router.post("/login", authController.authLogin);

export default router;
