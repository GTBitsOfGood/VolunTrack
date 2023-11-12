/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck

import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { MongoClient, ObjectId } from "mongodb";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { verifyUserWithCredentials } from "../../../../server/actions/users_new";
import dbConnect from "../../../../server/mongodb/index";
import Organization from "../../../../server/mongodb/models/Organization";
import User from "../../../../server/mongodb/models/User";

const uri = process.env.MONGO_DB ?? "mongodb://localhost:27017";
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  dbName: process.env.DB_NAME ?? "test",
};

const client = new MongoClient(uri, options);
const clientPromise = client.connect();

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Login with Username and Password",
      async authorize(credentials) {
        const response = await verifyUserWithCredentials(
          credentials.email,
          credentials.password
        );

        if (response.status === 200) {
          // this is the user object of the JWT
          return {
            id: response.message._id,
            ...response.message,
          };
        } else {
          return null; //Error(response.message);
        }
      },
      credentials: {
        firstName: { label: "First Name", type: "text" },
        lastName: { label: "Last Name", type: "text" },
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
    }),
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
      // this is only called for google auth
      await dbConnect();

      const _id = new ObjectId(message.user.id);

      await User.deleteOne({ _id });

      const user_data = {
        _id,
        imageUrl: message.user.image,
        firstName: message.user.name.split(" ")[0] ?? "first",
        lastName: message.user.name.split(" ")[1] ?? "last",
        phone: "",
        email: message.user.email,
      };

      const user = new User(user_data);
      await user.save();
    },
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    // This determines what is returned from useSession and getSession calls
    async session({ session, token }) {
      await dbConnect();

      const id = new ObjectId(token.id);
      const user = await User.findById(id);

      if (!user?.organizationId) {
        return {
          ...session,
          user,
          theme: null,
          medalDefaults: {
            eventSilver: null,
            eventGold: null,
            hoursSilver: null,
            hoursGold: null,
          },
        };
      }

      const organization = await Organization.findById(user.organizationId);

      if (organization?.invitedAdmins.includes(user.email)) {
        await user.updateOne({ role: "admin" });
        await organization.updateOne({ $pull: { invitedAdmins: user.email } });
        user.role = "admin";
      }
      return {
        ...session,
        user,
        theme: organization.theme,
        medalDefaults: {
          eventSilver: organization.eventSilver,
          eventGold: organization.eventGold,
          hoursSilver: organization.hoursSilver,
          hoursGold: organization.hoursGold,
        },
      };
    },
    redirect({ baseUrl }) {
      if (baseUrl.includes("bitsofgood.org")) return process.env.BASE_URL;
      return baseUrl;
    },
  },
};

export default NextAuth(authOptions);
