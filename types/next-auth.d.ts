import { DefaultSession } from "next-auth";

// Extend the default session type
declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      firstName: string;
      lastName: string;
      accessToken?: string;
      role?: string;
    } & DefaultSession["user"];
  }
}

// Extend the default JWT type
declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    role?: string;
    firstName: string;
    lastName: string;
    image?: string;
  }
}

// Custom User object returned by `authorize`
export interface ExtendedUser {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  image: string;
  email: string;
  token: string;
  tokenLifeTime: number;
  role: string;
}

export interface userdatataInfo {
  user: ExtendedUser;
}
