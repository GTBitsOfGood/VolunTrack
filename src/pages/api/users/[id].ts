import { HydratedDocument, Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next/types";
import { getUser } from "../../../../server/actions/users";
import { UserData } from "../../../../server/mongodb/models/User";

export default async (
  req: NextApiRequest,
  res: NextApiResponse<
    { user?: HydratedDocument<UserData> } | { userId?: Types.ObjectId }
  >
) => {
  const id = req.query.id as string;
  const user = await getUser(new Types.ObjectId(id));
  if (!user) return res.status(404);

  switch (req.method) {
    case "GET": {
      return res.status(200).json({ user });
    }
    case "PUT": {
      const userData = req.body as Partial<UserData>;
      await user.updateOne(userData);
      return res.status(200).json({ userId: user._id });
    }
    case "DELETE": {
      await user.deleteOne();
      return res.status(200).json({ userId: user._id });
    }
  }
};
