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
    { users: HydratedDocument<UserData>[] } | { userId?: Types.ObjectId }
  >
) => {
  switch (req.method) {
    case "GET": {
      const { organizationId, role, eventId, isCheckedIn } = req.query as {
        organizationId?: Types.ObjectId;
        role?: "admin" | "volunteer" | "manager";
        eventId?: Types.ObjectId;
        isCheckedIn?: boolean;
      };

      const users = await getUsers(organizationId, role, eventId, isCheckedIn);
      return res.status(200).json({ users });
    }
    case "POST": {
      const userData = req.body as UserData & { password: string };

      const userId = await createUserFromCredentials(userData);
      if (!userId) return res.status(400);
      return res.status(200).json({ userId });
    }
  }
};
