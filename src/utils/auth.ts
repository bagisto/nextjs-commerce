import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { bagistoFetch } from "@/utils/bagisto";
import { CUSTOMER_LOGIN } from "@/graphql/customer/mutations";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      authorize: async (credentials): Promise<any> => {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Email and password are required.");
        }

        const input = {
          email: credentials.username,
          password: credentials.password,
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res = await bagistoFetch<any>({
          query: CUSTOMER_LOGIN,
          variables: { input },
          cache: "no-store",
        });

        const login = res?.body?.data?.createLogin?.login;

        if (!login || !login.success) {
          throw new Error(login?.message || "Invalid credentials.");
        }

        return {
          id: credentials.username, // required by NextAuth
          email: credentials.username,
          name: credentials.username.split("@")[0],
          apiToken: login.apiToken,
          accessToken: login.token, // Sanctum token
          role: "customer",
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.apiToken = user.apiToken;
        token.accessToken = user.accessToken;
        token.role = "customer";
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id || "",
        apiToken: token.apiToken,
        accessToken: token.accessToken,
        role: token.role,
      };

      return session;
    },
  },

  pages: {
    signIn: "/customer/login",
    error: "/login",
  },

  secret: process.env.NEXT_PUBLIC_NEXT_AUTH_SECRET,
};

export const handler = NextAuth(authOptions);
