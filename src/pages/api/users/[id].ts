import { NextApiRequest, NextApiResponse } from "next/types";
import dbConnect from "../../../../server/mongodb";
import User from "../../../../server/mongodb/models/User";
import { userInputValidator } from "../../../validators/users";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  const userId = req.query.id as string;
  const user = await User.findById(userId);
  if (!user)
    return res
      .status(404)
      .json({ success: false, error: `User with id ${userId} not found` });

  switch (req.method) {
    case "GET": {
      return res.status(200).json({ success: true, user });
    }
    case "PUT": {
      const result = userInputValidator.partial().safeParse(req.body);
      if (!result.success) return res.status(400).json(result);

      await user.updateOne(result.data);
      return res.status(200).json({ success: true, user });
    }
    case "DELETE": {
      await user.deleteOne();
      return res.status(200).json({ success: true });
    }
  }
};
