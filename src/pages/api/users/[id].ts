import { NextApiRequest, NextApiResponse } from "next/types";
import dbConnect from "../../../../server/mongodb";
import User, {
  UserData,
  userValidator,
} from "../../../../server/mongodb/models/User";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  const userId = req.query.id as string;
  const user = await User.findById(userId);
  if (!user)
    return res
      .status(404)
      .json({ message: `User with id ${userId} not found` });

  switch (req.method) {
    case "GET": {
      return res.status(200).json({ user });
    }
    case "PUT": {
      if (userValidator.partial().safeParse(req.body).success) {
        await user.updateOne(req.body as Partial<UserData>);
        return res.status(200).json({ user });
      }
      return res.status(400).json({ message: "Invalid user data format" });
    }
    case "DELETE": {
      await user.deleteOne();
      return res.status(200);
    }
  }
};
