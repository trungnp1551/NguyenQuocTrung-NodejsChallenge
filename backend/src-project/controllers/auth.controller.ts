import { Request, Response } from "express";
import * as userService from "../services/user.service";
import jwt from "jsonwebtoken";
import { sendResponse } from '../common/response';

const JWT_SECRET = process.env.JWT_KEY || "secret_key";

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      sendResponse(res, 400, false, "Missing email or password");
      return;
    }

    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) {
      sendResponse(res, 409, false, "Email already exists");
      return;
    }

    const user = await userService.registerUser({ email, password });
    sendResponse(res, 201, true, "Register successful", { id: user.id, email: user.email })
  } catch (error) {
    sendResponse(res, 500, false, "Server error");
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      sendResponse(res, 400, false, "Missing email or password");
      return;
    }

    const user = await userService.findUserByEmail(email);
    if (!user) {
      sendResponse(res, 401, false, "Invalid credentials");
      return;
    }

    const valid = await userService.verifyUserPassword(user.password, password);
    if (!valid) {
      sendResponse(res, 401, false, "Invalid credentials");
      return;
    }

    // Create JWT token
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1d" });
    sendResponse(res, 200, true, "Login successful", { token })
  } catch (error) {
    sendResponse(res, 500, false, "Server error");
  }
};
