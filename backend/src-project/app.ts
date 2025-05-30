import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import productRoutes from "./routers/product.routes";
import userRoutes from "./routers/user.router";
import authRoutes from "./routers/auth.routes";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

// Routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

export default app;
