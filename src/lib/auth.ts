// src/lib/auth.ts
import { getServerSession, type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { db } from './prisma';

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });

        if (
          !user?.passwordHash ||
          !(await compare(credentials.password, user.passwordHash))
        ) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      const user = token.id
        ? await db.user.findUnique({
            where: { id: token.id as string },
            select: { name: true, email: true, role: true },
          })
        : null;

      if (user) {
        session.user.name = user.name;
        session.user.email = user.email;
        session.user.role = user.role;
      } else {
        session.user.role = token.role as string;
      }

      return session;
    },
  },
};

export const getAuthSession = () => getServerSession(authOptions);

export async function requireUser() {
  const session = await getAuthSession();
  if (!session?.user?.id) throw new Error('UNAUTHORIZED');
  return session.user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== 'ADMIN') throw new Error('FORBIDDEN');
  return user;
}
