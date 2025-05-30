// src/routes/user.routes.ts
import express from "express";
import * as userController from "../controllers/user.controller";

const router = express.Router();

router.get("/", userController.getAllUsers);

export default router;
