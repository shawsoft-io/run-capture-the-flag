// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AdapterUser } from "next-auth/adapters";

declare module "next-auth" {
  interface User {
    createdAt?: Date; // Optional field during creation
    lastLoginAt?: Date;
    role?: "admin" | "athlete"
    verified?: boolean;
  }

  interface Session {
    user: User; 
  }
}