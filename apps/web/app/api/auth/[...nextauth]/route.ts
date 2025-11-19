import NextAuth from "next-auth";
import Google from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@sora/db/client";
import { config } from "@sora/config/config";
import { NextAuthOptions } from "next-auth";


export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    return null;
                }
                
                // TODO: Implement actual password validation
                // For now, this is a placeholder that satisfies TypeScript requirements
                const user = await prisma.user.findUnique({
                    where: { email: credentials.username }
                });
                
                if (!user) {
                    return null;
                }
                
                // TODO: Add password hashing and comparison logic here
                // Example: const isValid = await bcrypt.compare(credentials.password, user.password);
                
                return {
                    id: user.id.toString(),
                    email: user.email,
                    name: user.name || undefined,
                };
            }
        }),
        Google({
            clientId: config.GOOGLE.GOOGLE_CLIENT_ID,
            clientSecret: config.GOOGLE.GOOGLE_CLIENT_SECRET,
        })
    ],
     session: {
    strategy: "jwt",
    },
     
    callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role || "user";
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).user.id = token.id;
      (session as any).user.role = token.role;
      return session;
    },
  },

  secret: config.NEXTAUTH_SECRET,
    
}


const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };