import { cookies, headers } from 'next/headers';

import NextAuth from 'next-auth';
import type { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

async function refreshAccessToken(token: any) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/refresh`,
      {
        method: 'POST',
        headers: await headers(),
        body: JSON.stringify({ userID: token.userId })
      }
    );

    const { success, data } = await res.json();

    if (!success) {
      throw data;
    }

    const decodedAccessToken = JSON.parse(
      Buffer.from(data.accessToken.split('.')[1], 'base64').toString()
    );

    return {
      ...token,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken ?? token.refreshToken,
      idToken: data.idToken,
      accessTokenExpires: decodedAccessToken['exp'] * 1000,
      error: ''
    };
  } catch (error) {
    return {
      ...token,
      error: 'RefreshAccessTokenError'
    };
  }
}

export const config = {
  trustHost: true,
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' }
      },
      async authorize(credentials, req) {
        const payload = {
          email: credentials.email,
          password: credentials.password
        };

        const res = await fetch(`${process.env.API_BASE_URL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify(payload)
        });

        const jsonResult = await res.json();

        if (!res.ok) {
          return null;
        }

        if (res.ok && jsonResult) {
          const prefix = process.env.NODE_ENV === 'development' ? '__Dev-' : '';

          // we set http only cookie here to store refresh token information as we will not append it to our session to avoid maximum size warning
          // for the session cookie (4096 bytes)
          const cookieStore = await cookies();
          cookieStore.set({
            name: `${prefix}xxx.refresh-token`,
            value: jsonResult.refreshToken,
            httpOnly: true,
            sameSite: 'strict',
            secure: true
          } as any);

          return jsonResult;
        }

        return null;
      }
    })
  ],
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/login'
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // initial login
      if (account && user) {
        token.id = user.id;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.role = 'Unknown'; // the user role

        const decodedAccessToken = JSON.parse(
          Buffer.from(user.accessToken.split('.')[1], 'base64').toString()
        );

        if (decodedAccessToken) {
          token.userId = decodedAccessToken.userId;
          token.accessTokenExpires = decodedAccessToken['exp'] * 1000;
          token.email = decodedAccessToken.email;
          token.name = decodedAccessToken.name;
        }
      }

      // if our access token has not expired yet, return all information except the refresh token
      if (
        (token.accessTokenExpires &&
          Date.now() < Number(token.accessTokenExpires)) ||
        token.error == 'RefreshAccessTokenError'
      ) {
        const { refreshToken, ...rest } = token;
        return rest;
      }

      // if our access token has expired, refresh it and return the result
      return await refreshAccessToken(token);
    },

    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.userId as string,
          email: token.email as string,
          cognitoGroups: token.cognitoGroups as string[],
          accessToken: token.accessToken as string,
          accessTokenExpires: token.accessTokenExpires as number,
          role: token.role as string
        },
        error: token.error
      };
    }
  },
  debug: process.env.NODE_ENV === 'development'
} satisfies NextAuthConfig;

export const { auth, handlers } = NextAuth(config);
