import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"
import connectToDatabase from "@/lib/db"
import { User } from "@/lib/models"
import bcrypt from "bcryptjs"

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
 
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          
          await connectToDatabase();
          
          const user = await User.findOne({ email }).select("+password");
          
          if (!user || !user.password) return null;
          
          const passwordsMatch = await bcrypt.compare(password, user.password);
 
          if (passwordsMatch) {
             // Return a plain object, not a Mongoose document
             return {
                 id: user._id.toString(),
                 name: user.name,
                 email: user.email,
                 image: user.image,
             };
          }
        }
 
        return null;
      },
    }),
  ],
})

