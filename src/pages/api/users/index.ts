import { isValidObjectId, Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next/types";
import {
  createUserFromCredentials,
  getUsers,
} from "../../../../server/actions/users";
import dbConnect from "../../../../server/mongodb";
import {
  UserData,
  userValidator,
} from "../../../../server/mongodb/models/User";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  switch (req.method) {
    case "GET": {
      if (
        req.query.organizationId &&
        !isValidObjectId(req.query.organizationId as string)
      )
        return res.status(400).json({ message: "Invalid organization id" });
      if (
        req.query.role &&
        !["admin", "volunteer", "manager"].includes(req.query.role as string)
      )
        return res.status(400).json({ message: "Invalid role" });
      if (req.query.eventId && !isValidObjectId(req.query.eventId as string))
        return res.status(400).json({ message: "Invalid event id" });

      const organizationId = req.query.organizationId
        ? new Types.ObjectId(req.query.organizationId as string)
        : undefined;
      const role = req.query.role
        ? (req.query.role as "admin" | "volunteer" | "manager")
        : undefined;
      const eventId = req.query.eventId
        ? new Types.ObjectId(req.query.eventId as string)
        : undefined;
      const isCheckedIn = req.query.isCheckedIn
        ? req.query.isCheckedIn === "true"
        : undefined;

      const users = await getUsers(organizationId, role, eventId, isCheckedIn);
      return res.status(200).json({ users });
    }
    case "POST": {
      if (userValidator.safeParse(req.body).success) {
        const user = await createUserFromCredentials(
          req.body as Omit<UserData, "password"> & { password: string }
        );
        if (!user)
          return res.status(400).json({ message: "User already exists" });
        return res.status(200).json({ user });
      }
      return res.status(400).json({ message: "Invalid user data format" });
    }
  }
};
