import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import { User } from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import CredentialsProvider from "next-auth/providers/credentials"


import bcrypt from "bcryptjs";


export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "email", type: "text", },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        await dbConnect();
        // const res = await fetch("/auth/login", {
        //   method: 'POST',
        //   body: JSON.stringify(credentials),
        //   headers: { "Content-Type": "application/json" }
        // })
        // const result = await res.json()

        const user = await User.findOne({ email: credentials.email });

        if (!user) throw new Error("User not found");

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) throw new Error("Invalid password");





        // If no error and we have user data, return it

        return user
        // return {
        //   id: user._id.toString(),
        //   email: user.email,
        //   username: user.username,
        // };
        // Return null if user data could not be retrieved
        return null
      }
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    // ...add more providers here
  ],

  // pages: {
  //   signIn: "/login", // custom login page
  // },
  callbacks: {
    async signIn({ user, account }) {
      await dbConnect();

      // if OAuth user logs in, make sure they exist in DB
      let existing = await User.findOne({ email: user.email });

      if (!existing) {
        // await User.create({
        //   username: user.name || user.email.split("@")[0], // fallback username
        //   email: user.email,
        //   provider: account.provider,
        // });
        await User.create({
          username: user.username || user.email.split("@")[0], // fallback username
          email: user.email,
          provider: account.provider,
        });
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email; // save DB username

      }
      await dbConnect();
      const dbUser = await User.findOne({ email: token.email });
      if (dbUser) {
        token.name = dbUser.username; // from your DB
      }
      return token;
    },
    async session({ session, token }) {
      // you can attach DB user data to session if needed
      session.user.id = token.id;
      session.user.name = token.name; // now client gets this

      return session;
    },

  },
  secret: process.env.NEXTAUTH_SECRET,
}
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }