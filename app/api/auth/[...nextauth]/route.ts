//! SECOND TEST WITH NEXT-AUTH

import NextAuth from "next-auth";
import { options } from "./options";

const handler = NextAuth(options);

export { handler as GET, handler as POST };

// import CredentialsProvider from "next-auth/providers/credentials";
// import { Account, User as AuthUser } from "next-auth";
// import NextAuth from "next-auth/next"; // Replace <path_to_login_module> with the actual path to the login module
// import { connectToDB } from "@/lib/mongoDB";
// import UserAdmin from "@/lib/models/UserAdmin";
// import bcrypt from "bcrypt";

// interface CredentialsInterface {
//   email: string;
//   password: string;
// }

// // async function login(credentials: CredentialsInterface) {
// //   try {
// //     connectToDB();
// //     const user = await UserAdmin.findOne({ email: credentials.email });
// //     if (!user) {
// //       throw new Error("Email ou Mot de passe incorrect");
// //     }
// //     const isCorrect = await bcrypt.compare(credentials.password, user.password);
// //     if (!isCorrect) {
// //       throw new Error("Email ou Mot de passe incorrect");
// //     }
// //     return user;
// //   } catch (error) {
// //     console.error("[login]", error);
// //   }
// // }

// export const authOptions = {
//   pages: {
//     signIn: "/login",
//     signup: "/register",
//     signOut: "/",
//   },
//   providers: [
//     CredentialsProvider({
//       id: "credentials",
//       name: "Credentials",
//       credentials: {
//         email: { label: "email", type: "email" },
//         password: { label: "password", type: "password" },
//       },
//       async authorize(credentials) {
//         try {
//           await connectToDB();
//           try {
//             const user = await UserAdmin.findOne({ email: credentials?.email });
//             if (user) {
//               const isPasswordCorrect = await bcrypt.compare(
//                 credentials?.password || "",
//                 user.password
//               );

//               if (isPasswordCorrect) {
//                 return user;
//               } else {
//                 throw new Error("Email ou Mot de passe incorrect");
//               }
//             }
//           } catch (error) {
//             throw new Error("Email ou Mot de passe incorrect");
//           }
//           // const user = await login(credentials as CredentialsInterface);
//           // Add your authorization logic here// Replace null with the appropriate user object
//         } catch (error) {
//           throw new Error("Email ou Mot de passe incorrect");
//           // return Promise.resolve(null);
//         }
//       },
//     }),
//   ],
//   secret: process.env.NEXTAUTH_SECRET,
//   callbacks: {
//     async jwt({ token, user }: { token: any; user: any }) {
//       if (user) {
//         token.accessToken = user.access_token;
//       }
//       return token;
//     },
//     async session({
//       session,
//       user,
//       token,
//     }: {
//       session: any;
//       user: any;
//       token: any;
//     }) {
//       if (user) {
//         session.user.email = user.email;
//         session.user.isAdmin = token.isAdmin;
//       }
//       // return Promise.resolve(session);

//       return session;
//     },
//   },
// };

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };
