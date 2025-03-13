import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.SECRET_KEY_RT!, {
    expiresIn: "30d",
  });
};

export const generateAccessToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.SECRET_KEY_AT!, {
    expiresIn: "15m",
  });
};
