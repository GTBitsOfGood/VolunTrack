import { NextApiRequest, NextApiResponse } from "next/types";
import { getServerSession } from "next-auth/next";
import dbConnect from "../../../../server/mongodb";
import { hash } from "bcrypt";
import User, {
  UserDocument,
  UserInputServer,
  userInputServerValidator,
} from "../../../../server/mongodb/models/User";
import { isAdmin, isOriginalOrgAdmin } from "../../../utils/routeProtection";
import { authOptions } from "../auth/[...nextauth]";

// What anyone may change on their own account (the Profile page). Role,
// organization, email, admin flags and password are left out on purpose.
const SELF_EDITABLE_FIELDS = [
  "firstName",
  "lastName",
  "phone",
  "dob",
  "address",
  "city",
  "state",
  "zip",
  "imageUrl",
] as const;

// Shared by PUT and POST. Returns an error to send, or null once saved.
const saveUserChanges = async (
  req: NextApiRequest,
  res: NextApiResponse,
  user: UserDocument
): Promise<{ status: number; body: object } | null> => {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user)
    return { status: 401, body: { error: "Please sign in to continue." } };

  // Whose account this is comes from the login and the web address, never
  // from the request body.
  const editingSelf = session.user._id.toString() === user._id.toString();
  if (!editingSelf) {
    if (!(await isAdmin(req, res))) {
      return {
        status: 403,
        body: {
          error:
            "Only Admins can modify other users, and volunteers can only modify themselves",
        },
      };
    }
    if (user.role === "admin" && !(await isOriginalOrgAdmin(req, res))) {
      return {
        status: 403,
        body: {
          error: "Only the original organization Admin can modify other admins",
        },
      };
    }
  }

  const result = userInputServerValidator.partial().safeParse(req.body);
  if (!result.success) return { status: 400, body: result };

  let changes: Partial<UserInputServer>;
  if (editingSelf) {
    changes = {};
    for (const field of SELF_EDITABLE_FIELDS) {
      if (result.data[field] !== undefined) changes[field] = result.data[field];
    }
  } else {
    changes = result.data;
    if (result.data.password) {
      changes.passwordHash = await hash(
        `${user.email}${result.data.password}`,
        10
      );
    }
  }

  await user.updateOne(changes);
  return null;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  const userId = req.query.id as string;
  const user = await User.findById(userId);
  if (!user)
    return res.status(404).json({ error: `User with id ${userId} not found` });

  switch (req.method) {
    case "GET": {
      return res.status(200).json({ user });
    }
    case "PUT": {
      const refused = await saveUserChanges(req, res, user);
      if (refused) return res.status(refused.status).json(refused.body);
      return res.status(200).json({ user });
    }
    case "POST": {
      const refused = await saveUserChanges(req, res, user);
      if (refused) return res.status(refused.status).json(refused.body);
      return res.status(200).json({ success: true, user });
    }
    case "DELETE": {
      // TODO: should admins be able to delete other admins?
      const isadmin = await isAdmin(req, res);
      const isogadmin = await isOriginalOrgAdmin(req, res);

      if (user.role === "admin" && !isogadmin) {
        return res.status(403).json({
          error: "Only the original organization Admin can delete other admins",
        });
      }
      if (!isadmin) {
        return res.status(403).json({ error: "Only Admins can delete users" });
      }
      await user.deleteOne();
      return res.status(204).end();
    }
  }
};
