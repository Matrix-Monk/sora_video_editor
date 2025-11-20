import NextAuth, { NextAuthOptions, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@sora/db/client";
import { JWT } from "next-auth/jwt";
import bcrypt from "bcryptjs";

type ExtendedUser = User & { role?: string | null };
type ExtendedToken = JWT & { id?: string; role?: string | null };

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text"},
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                
                if (!credentials?.username || !credentials?.password) {
                    throw new Error("Missing email or password");
                }
                const user = await prisma.user.findUnique({
                    where: { email: credentials.username }
                });
                
                if (!user) {
                    throw new Error("Invalid email! Please check your email");
                }
                
                if (!user.password) throw new Error("Password is missing for the user");

              const isValid = await bcrypt.compare(credentials.password, user.password);
              
                if (!isValid) {
                    throw new Error("Incorrect password");
                }

                
                const normalizedUser: ExtendedUser = {
                    ...user,
                    id: user.id.toString(),
                };

                return normalizedUser;
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        })
    ],
     session: {
    strategy: "jwt",
    },
     
    callbacks: {
    async jwt({ token, user }) {
      const extendedToken = token as ExtendedToken;

      if (user) {
        const extendedUser = user as ExtendedUser;
        extendedToken.id = extendedUser.id ?? extendedToken.id;
        extendedToken.role = extendedUser.role ?? "user";
      } else if (!extendedToken.role && extendedToken.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: Number(extendedToken.id) },
        });
        extendedToken.role = dbUser?.role ?? extendedToken.role;
      }

      return extendedToken;
    },
    async session({ session, token }) {
      const extendedToken = token as ExtendedToken;

      if (session.user) {
        const sessionUser = session.user as typeof session.user & {
          id?: string | null;
          role?: string | null;
        };
        sessionUser.id = extendedToken.id ?? sessionUser.id ?? null;
        sessionUser.role = extendedToken.role ?? sessionUser.role ?? null;
      }

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
    
}


const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };