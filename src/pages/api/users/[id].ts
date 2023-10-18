import { NextApiRequest, NextApiResponse } from "next/types";
import dbConnect from "../../../../server/mongodb";
import bcrypt, { compare, hash } from "bcrypt";
import User, {
  userInputServerValidator,
} from "../../../../server/mongodb/models/User";

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
      const result = userInputServerValidator.partial().safeParse(req.body);
      if (!result.success) return res.status(400).json(result);

      await user.updateOne(result.data);
      return res.status(200).json({ user });
    }
    case "POST": {
      const result = userInputServerValidator.partial().safeParse(req.body);
      if (!result.success) return res.status(400).json(result);

      if (result.data.password)
        result.data.passwordHash = await hash(
          `${user.email}${result.data.password}`,
          10
        );

      await user.updateOne(result.data);
      return res.status(200).json({ success: true, user });
    }
    case "DELETE": {
      await user.deleteOne();
      return res.status(204).end();
    }
  }
};
