import { NextAuthOptions } from "next-auth";
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from './prisma';

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        session: async ({ session, token }) => {
            if (session?.user && token?.sub) {
                session.user.id = token.sub;
                // avatar_urlもセッションに含める
                if (token.avatar_url) {
                    session.user.avatar_url = token.avatar_url as string;
                }
            }
            return session;
        },
        jwt: async ({ user, token }) => {
            if (user) {
                token.uid = user.id;
                // avatar_urlをトークンに保存
                if (user.avatar_url) {
                    token.avatar_url = user.avatar_url;
                }
            }
            return token;
        },
        // ユーザー作成時にimageをavatar_urlにマッピング
        signIn: async ({ user, account, profile }) => {
            if (user.image) {
                user.avatar_url = user.image;
                delete user.image;
            }
            return true;
        },
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30日
    },
    jwt: {
        maxAge: 30 * 24 * 60 * 60, // 30日
    },
    pages: {
        signIn: '/auth/login',
    },
    debug: process.env.NODE_ENV === 'development',
};