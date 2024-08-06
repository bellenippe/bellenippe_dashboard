import UserAdmin from "@/lib/models/UserAdmin";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";

export const options = {
  providers: [
    GoogleProvider({
      profile(profile) {
        console.log("Profile Google", profile);

        let userRole = "Google User";

        if (profile?.email == "inthegleam01@gmail.com") {
          userRole = "admin";
        }

        return {
          ...profile,
          id: profile.sub,
          role: userRole,
        };
      },
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),

    // Credentials({
    //   name: "Credentials",
    //   credentials: {
    //     email: { label: "email", type: "email", placeholder: "Email" },
    //     password: { label: "password", type: "password" },
    //   },
    //   async authorize(credentials) {
    //     try {
    //       const foundUser = await UserAdmin.findOne({
    //         email: credentials.email,
    //       })
    //         .lean()
    //         .exec();

    //       if (foundUser) {
    //         console.log("User Exist", foundUser);
    //         const match = await bcrypt.compare(
    //           credentials.password,
    //           foundUser.password
    //         );

    //         if (match) {
    //           console.log("Good password");
    //           delete foundUser.password;

    //           foundUser["role"] = "Unverified Email";
    //           return foundUser;
    //         }
    //       }
    //     } catch (error) {
    //       console.log("Error_credential_option", error);
    //     }
    //     return null;
    //   },
    // }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // console.log("jwt user:", user);
      if (user) token.role = user.role;
      // console.log("jwt token:", token);
      return token;
    },
    async session({ session, token }) {
      // console.log("session token:", token);
      console.log("Session", session);
      if (token?.role) {
        session.user.role = token.role;
      }
      return session;
    },
  },
};
