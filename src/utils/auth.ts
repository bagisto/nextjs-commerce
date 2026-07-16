import NextAuth, { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { bagistoFetch } from "@/utils/bagisto";
import { CUSTOMER_LOGIN } from "@/graphql/customer/mutations";

interface CustomerLoginResponse {
  data?: {
    createCustomerLogin?: {
      customerLogin?: {
        id?: string;
        success?: boolean;
        token?: string;
        apiToken?: string;
        message?: string;
      };
    };
  };
  variables: Record<string, unknown>;
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },


      authorize: async (credentials): Promise<User | null> => {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Email and password are required.");
        }

        const input = {
          email: credentials.username,
          password: credentials.password,
        };


        const res = await bagistoFetch<CustomerLoginResponse>({
          query: CUSTOMER_LOGIN,
          variables: { input },
          cache: "no-store",
        });

        const data = res?.body?.data?.createCustomerLogin?.customerLogin;

        if (!data || !data.success || !data.token) {
          throw new Error(data?.message || "Invalid credentials.");
        }

        return {
          id: data.id ?? "",
          email: credentials.username,
          name: credentials.username,
          apiToken: data.apiToken ?? "",
          accessToken: data.token ?? "",
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

  secret: process.env.NEXTAUTH_SECRET,
};

export const handler = NextAuth(authOptions);