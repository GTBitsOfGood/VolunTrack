import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { MongoClient, ObjectId } from "mongodb";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "../../../../server/mongodb/index";
import User from "../../../../server/mongodb/models/User";
import CredentialsProvider from "next-auth/providers/credentials";

const uri = process.env.MONGO_DB;
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

let currRole = "admin";

const testAdminUser = {
  _id: {
    $oid: "6233855faf0f4550501b60e4",
  },
  employment: {
    occupation: [],
  },
  role: "admin",
  status: "new",
  mandated: "not_mandated",
  mandatedHours: 0,
  imageUrl:
    "https://lh3.googleusercontent.com/a-/AFdZucq8x07XKdgm8QTglypFQbHY3vDuFP4sDHIQ7-Hw5w=s83-c-mo",
  bio: {
    first_name: "Test",
    last_name: "User",
    phone_number: "",
    email: "test.user@gmail.com",
  },
  createdAt: "2022-03-17T19:00:47.571Z",
  updatedAt: "2022-04-12T23:08:32.167Z",
  __v: 0,
};

const testVolunteerUser = {
  _id: {
    $oid: "6233855faf0f4550501b60e4",
  },
  employment: {
    occupation: [],
  },
  role: "volunteer",
  status: "new",
  mandated: "not_mandated",
  mandatedHours: 0,
  imageUrl:
    "https://lh3.googleusercontent.com/a-/AOh14GhVmAI6HfcFLXc1pXoRW2bd58WSgTPDjqeu7SjqDA=s96-c",
  bio: {
    first_name: "Test",
    last_name: "User",
    phone_number: "",
    email: "test.user@gmail.com",
  },
  createdAt: "2022-03-17T19:00:47.571Z",
  updatedAt: "2022-04-12T23:08:32.167Z",
  __v: 0,
};
//
// function adapterWrapper(clientPromise) {
//   console.log("wrapper");
//   return MongoDBAdapter(clientPromise);
// }

const client = new MongoClient(uri, options);
const clientPromise = client.connect();

export default NextAuth({
  providers: [
    process.env.VERCEL_ENV === "preview"
      ? CredentialsProvider({
          name: "Credentials",
          credentials: {
            username: {
              label: "Username",
              type: "text",
            },
            password: { label: "Password", type: "password" },
          },
          async authorize(credentials) {
            console.log("authorize");
            console.log(credentials);
            console.log(credentials.username);
            console.log("---");

            if (credentials.username === "admin") {
              console.log("admin");
              currRole = "admin";
              return testAdminUser;
            } else {
              console.log("volunteer");
              currRole = "volunteer";
              return testVolunteerUser;
            }
          },
        })
      : GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
  ],
  secret: process.env.SECRET,
  adapter:
    process.env.VERCEL_ENV === "preview" ? null : MongoDBAdapter(clientPromise),
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
      if (process.env.VERCEL_ENV === "preview") {
        console.log("preview session");
        return {
          ...session,
          user: (currRole === "admin") ? testAdminUser : testVolunteerUser,
        };
      }

      console.log("regular session");
      await dbConnect();

      const _id = new ObjectId(user.id);
      const currentUser = await User.findOne({ _id });

      return {
        ...session,
        user: currentUser,
      };
    },
    async redirect({ baseUrl }) {
      return baseUrl;
    },
  },
});
