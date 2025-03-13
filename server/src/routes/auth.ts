import express from "express";
import AuthController from "../controllers/auth";
const router = express.Router();

const authController = new AuthController();

router.post("/login", authController.authLogin);
router.post("/register", authController.authRegister);
router.post("/logout", authController.authLogout);

export default router;
