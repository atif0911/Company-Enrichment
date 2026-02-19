import type { NextAuthConfig } from "next-auth"
 
export const authConfig = {
  pages: {
    signIn: '/login',
    newUser: '/register',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAuthPage = nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/register');
      
      if (isAuthPage) {
        if (isLoggedIn) return Response.redirect(new URL('/', nextUrl));
        return true;
      }
      
      return isLoggedIn; // Redirect unauthenticated users to login page
    },
     session({ session, token }) {
       if (session.user && token.sub) {
         session.user.id = token.sub;
       }
       return session;
     },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig
