// src/services/user.service.ts
import { CreateUserDto, UserDto } from "../dto/user.dto";
import prisma from "../config/db";
import bcrypt from "bcrypt";

export const registerUser = async (data: CreateUserDto) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  return prisma.user.create({
    data: { email: data.email, password: hashedPassword },
  });
};

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

export const getAllUsers = async (): Promise<UserDto[]> => {
  const users = await prisma.user.findMany();
  return users;
};

export const verifyUserPassword = async (
  userPassword: string,
  inputPassword: string
) => {
  return bcrypt.compare(inputPassword, userPassword);
};
