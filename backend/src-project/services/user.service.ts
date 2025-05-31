import { UserDto } from "../dto/user.dto";
import prisma from "../config/db";

export const getAllUsers = async (): Promise<UserDto[]> => {
  const users = await prisma.user.findMany();
  return users;
};