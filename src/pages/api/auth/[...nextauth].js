import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { MongoClient, ObjectId } from "mongodb";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { verifyUserWithCredentials } from "../../../../server/actions/users";
import dbConnect from "../../../../server/mongodb";
import Organization from "../../../../server/mongodb/models/Organization";
import User from "../../../../server/mongodb/models/User";

const uri = process.env.MONGO_DB;
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

const client = new MongoClient(uri, options);
const clientPromise = client.connect();

export default NextAuth({
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
            bio: response.message.bio,
            role: response.message.role,
            status: response.message.status,
            imageUrl: response.message.imageUrl,
          };
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
          // TODO: reject this callback with an error with the message as response.error
          return Error(response.message);
        }
      },
      credentials: {
        first_name: { label: "First Name", type: "text" },
        last_name: { label: "Last Name", type: "text" },
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
      console.log(message);

      await User.deleteOne({ _id });

      const user_data = {
        _id,
        imageUrl: message.user.image,
        firstName: message.user.name.split(" ")[0],
        lastName: message.user.name.split(" ")[1],
        phone: "",
        email: message.user.email,
      };
      await User.create(user_data);
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

      const id = token.id;
      console.log(id);

      const user = (await User.findById(id))._doc;
      const organization = (await Organization.findById(user?.organizationId))
        ._doc;

      if (!user || !organization) return {};

      if (organization?.invitedAdmins?.includes(user.email)) {
        await user.updateOne({ role: "admin" });
        await organization.updateOne(
          { $pull: { invitedAdmins: user.email } },
          { new: true }
        );
      }
      return {
        ...session,
        user: user,
        theme: organization.theme,
      };
    },
    redirect({ baseUrl }) {
      if (baseUrl.includes("bitsofgood.org")) return process.env.BASE_URL;
      return baseUrl;
    },
  },
});
