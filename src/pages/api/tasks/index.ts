import { NextApiRequest, NextApiResponse } from "next/types";
// import {
//   createUserFromCredentials,
//   getUsers,
// } from "../../../../server/actions/users_new";
import dbConnect from "../../../../server/mongodb";
import {
  UserInputClient,
  userInputServerValidator,
} from "../../../../server/mongodb/models/User";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  switch (req.method) {
    case "GET": {
      // if (
      //   req.query.organizationId &&
      //   !isValidObjectId(req.query.organizationId as string)
      // )
      //   return res.status(400).json({ message: "Invalid organization id" });
      // if (
      //   req.query.role &&
      //   !["admin", "volunteer", "manager"].includes(req.query.role as string)
      // )
      //   return res.status(400).json({ message: "Invalid role" });
      // if (req.query.eventId && !isValidObjectId(req.query.eventId as string))
      //   return res.status(400).json({ message: "Invalid event id" });
      // const organizationId = req.query.organizationId
      //   ? new Types.ObjectId(req.query.organizationId as string)
      //   : undefined;
      // const role = req.query.role
      //   ? (req.query.role as "admin" | "volunteer" | "manager")
      //   : undefined;
      // const eventId = req.query.eventId
      //   ? new Types.ObjectId(req.query.eventId as string)
      //   : undefined;
      // const checkinStatus = req.query.checkinStatus
      //   ? (req.query.checkinStatus as "waiting" | "checkedIn" | "checkedOut")
      //   : undefined;
      //   const users = await getUsers(
      //     organizationId,
      //     role,
      //     eventId,
      //     checkinStatus
      //   );
      //   return res.status(200).json({ users });
      break;
    }
    case "POST": {
      const result = userInputServerValidator.safeParse(req.body);
      if (!result.success) return res.status(400).json(result);

      //   const user = await createUserFromCredentials(
      //     req.body as Omit<UserInputClient, "password"> & { password: string } & {
      //       orgCode: string;
      //     }
      //   );
      //   if (!user) return res.status(400).json({ error: "User already exists" });

      //   return res.status(200).json({ user });
    }
  }
};
