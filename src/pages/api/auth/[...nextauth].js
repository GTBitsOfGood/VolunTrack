import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { MongoClient, ObjectId } from "mongodb";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "../../../../server/mongodb/index";
import User from "../../../../server/mongodb/models/User";

const uri = process.env.MONGO_DB;
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

const client = new MongoClient(uri, options);
const clientPromise = client.connect();

export default (req, res) => {
  /* next-auth prioritizes x-forwarded-host over NEXTAUTH_URL
    when running in Vercel https://github.com/nextauthjs/next-auth/pull/4509 .
    We need that to not happen, since the actual domain from *our* nginx proxy will differ
    from x-forwarded-host set by Vercel's proxy. E.g.:
      1. Our Nginx listening on example.dev proxies staging.example.com
      2. Vercel's Nginx listening at staging.example.com sets x-forwarded-host to staging.example.com
      3. next-auth will now set redirect_uri to staging.example.com instead of example.dev
  */
  // prefer NEXTAUTH_URL, fallback to x-forwarded-host
  req.headers["x-forwarded-host"] =
    process.env.BASE_URL || req.headers["x-forwarded-host"];
  return NextAuth({
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }),
    ],
    secret: process.env.SECRET,
    adapter: MongoDBAdapter(clientPromise),
    events: {
      // NextJS creates a default user with name, email, and user fields
      // We can delete this and then add a new User from the defined User schema
      createUser: async (message) => {
        await dbConnect();

        const _id = new ObjectId(message.user.id);

        await User.deleteOne({ _id });

        const userData = {
          _id,
          imageUrl: message.user.image,
          bio: {
            first_name: message.user.name.split(" ")[0],
            last_name: message.user.name.split(" ")[1],
            phone_number: "",
            email: message.user.email,
          },
        };

        const user = new User(userData);

        await user.save();
      },
    },
    callbacks: {
      // This determines what is returned from useSession and getSession calls
      async session({ session, user }) {
        await dbConnect();

        const _id = new ObjectId(user.id);
        const currentUser = await User.findOne({ _id });

        return {
          ...session,
          user: currentUser,
        };
      },
      async redirect() {
        return process.env.NEXTAUTH_URL;
      },
    },
  });
};
