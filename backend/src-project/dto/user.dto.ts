export interface CreateUserDto {
  email: string;
  password: string;
}

export interface LoginUserDto {
  email: string;
  password: string;
}

export interface UserDto {
  id: string;
  email: string;
  createdAt: Date;
}
