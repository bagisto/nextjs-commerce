import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { bagistoFetch } from "@/lib/bagisto";
import { CustomerLogin } from "@/lib/bagisto/mutations/customer-login";
import { isObject } from "@/lib/type-guards";
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "username",
          type: "username",
          placeholder: "jsmith",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (
        credentials: Record<"password" | "username", string> | undefined
      ): Promise<any> => {
        /* Getting Token from generateCustomerToken */
        const input = {
          email: credentials?.username,
          password: credentials?.password,
        };

        try {
          const res = await bagistoFetch<any>({
            query: CustomerLogin,
            variables: {
              input,
            },
            cache: "no-store",
          });

          if (
            res?.status === 200 &&
            isObject(res?.body?.data) &&
            isObject(res?.body?.data?.customerLogin)
          ) {
            const customerInfo = res?.body?.data?.customerLogin;

            return {
              firstname: customerInfo.customer.firstName,
              lastname: customerInfo.customer.lastName,
              name: customerInfo.customer.name,
              token: customerInfo.accessToken,
              email: customerInfo.customer.email,
              tokenLifeTime: customerInfo.expiresIn,
            };
          } else {
            throw new Error("Something went wrong.");
          }
        } catch (error: any) {
          throw new Error(
            (error?.error?.message as string) || "Something went wrong!"
          );
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    jwt: async ({ token, user }) => {
      if (isObject(user) && user.token) {
        token.accessToken = user.token as string;
        token.role = "customer";
      }

      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          accessToken: token.accessToken as string,
          role: token.role,
        },
        error: token.error,
      };
    },
  },
  pages: {
    signIn: "/customer/login",
    error: "/login",
  },
};
export const handler = NextAuth(authOptions);
