export interface UserProfile {
  id: number;
  username: string;
  email: string;
  role: "Admin" | "Staff" | "User";
  phoneNumber?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  role?: "Admin" | "Staff" | "User";
  phoneNumber?: string;
  address?: string;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  password?: string;
  role?: "Admin" | "Staff" | "User";
  phoneNumber?: string;
  address?: string;
}
