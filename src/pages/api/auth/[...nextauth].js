import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGO_DB;
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

const client = new MongoClient(uri, options);
const clientPromise = client.connect();

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.SECRET,
  adapter: MongoDBAdapter(clientPromise),
  events: {
    signIn: async (message) => {
      const usersCollection = client
        .db(process.env.DATABASE_NAME)
        .collection("users");

      usersCollection.updateOne(
        { _id: new ObjectId(message.user.id) },
        {
          $set: {
            username: "username1",
          },
        }
      );
    },
  },
});
