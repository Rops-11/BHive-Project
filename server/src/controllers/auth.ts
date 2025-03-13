import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../utils/tokenGen";

const router = express.Router();
const prisma = new PrismaClient();

class AuthController {
  public authLogin = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        user.hashedPassword
      );

      if (!isPasswordValid) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
      }

      const accessToken = generateAccessToken(user.id);
      const refreshToken = generateRefreshToken(user.id);

      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken },
      });

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.status(200).json({ accessToken, isAdmin: user.isAdmin, id: user.id });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
}

export default AuthController;
