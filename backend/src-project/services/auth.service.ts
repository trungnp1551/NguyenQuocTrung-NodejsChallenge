import bcrypt from "bcrypt";
import prisma from "../config/db";
import { CreateUserDto } from "../dto/user.dto";

export const registerUser = async (data: CreateUserDto) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  return prisma.user.create({
    data: { email: data.email, password: hashedPassword },
  });
};

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

export const verifyUserPassword = async (
  userPassword: string,
  inputPassword: string
) => {
  return bcrypt.compare(inputPassword, userPassword);
};