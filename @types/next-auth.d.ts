import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      firstname?: string;
      lastname?: string;
      token?: string;
      accessToken?: string;
      apiToken?: string;
      role?: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    accessToken?: string;
    apiToken?: string;
    role?: string;
    tokenType?: string;
    expiresIn?: number;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    apiToken?: string;
    role?: string;
    id?: string;
  }
}
