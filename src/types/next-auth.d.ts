import "next-auth";
import { UserDocument } from "../../server/mongodb/models/User";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the
   * `SessionProvider` React Context
   */
  type Session = {
    user: UserDocument;
  };
}
