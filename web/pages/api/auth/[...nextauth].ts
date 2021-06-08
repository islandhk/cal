import NextAuth from "next-auth";
import Providers from "next-auth/providers";

export default NextAuth({
  providers: [
    Providers.Discord({
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    }),
  ],

  session: {
    jwt: true,
  },

  callbacks: {
    jwt: async (token, user, account, profile) => {
      if (profile) {
        token.id = profile.id;
      }
      return token;
    },

    session: async (session, token) => {
      session.id = token.id;

      return session;
    },
  },

  database: process.env.DB,
});
