import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

// 环境变量检查
const requiredEnvVars = {
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  GITHUB_ID: process.env.GITHUB_ID,
  GITHUB_SECRET: process.env.GITHUB_SECRET,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
};

// 在开发环境下检查缺失的环境变量
if (process.env.NODE_ENV === "development") {
  const missing = Object.entries(requiredEnvVars)
    .filter(([, value]) => !value)
    .map(([key]) => key);
  
  if (missing.length > 0) {
    console.warn(
      `[NextAuth] 缺少以下环境变量: ${missing.join(", ")}。请在 .env.local 中配置它们。`
    );
  }
}

export const authOptions: NextAuthOptions = {
  // 使用 JWT session，不使用 adapter（避免冲突）
  providers: [
    // GitHub 登录
    ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET
      ? [
          GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
          }),
        ]
      : []),
    // Google 登录
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 天
  },
  callbacks: {
    // JWT 回调：存储用户信息到 token
    async jwt({ token, account, profile }) {
      // 首次登录时，存储用户信息
      if (account && profile) {
        token.id = account.providerAccountId;
        token.provider = account.provider;
        // 存储头像和名称
        if (profile) {
          token.name = profile.name || token.name;
          token.picture = (profile as any).avatar_url || (profile as any).picture || token.picture;
        }
      }
      return token;
    },
    // Session 回调：把 token 信息传给 session
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id || token.sub;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  debug: process.env.NODE_ENV === "development",
};
