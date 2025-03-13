import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
dotenv.config({ path: ".env" });

const server = express();

server.use(express.json());

server.use(cors());

server.use("/auth", authRoutes);

// For PORT
const PORT = Number(process.env.PORT) || 3000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(
    `The Server for CodeGreen has Started at http://localhost:${PORT}`
  );
});
