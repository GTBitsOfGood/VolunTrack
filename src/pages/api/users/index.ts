import { HydratedDocument, Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next/types";
import {
  createUserFromCredentials,
  getUsers,
} from "../../../../server/actions/users";
import { UserData } from "../../../../server/mongodb/models/User";

export default async (
  req: NextApiRequest,
  res: NextApiResponse<
    | { users: HydratedDocument<UserData>[] }
    | { message: string }
    | { userId: Types.ObjectId }
  >
) => {
  switch (req.method) {
    case "GET": {
      const { organizationId, role } = req.query as {
        organizationId: Types.ObjectId | undefined;
        role: "admin" | "volunteer" | "manager" | undefined;
      };

      const users = await getUsers(organizationId, role);
      return res.status(200).json({ users });
    }
    case "POST": {
      const userData = req.body as UserData & { password: string };

      const userId = await createUserFromCredentials(userData);
      if (!userId)
        return res.status(400).json({
          message: `User already exists with email ${userData.email}`,
        });
      return res.status(200).json({ userId });
    }
  }
};
