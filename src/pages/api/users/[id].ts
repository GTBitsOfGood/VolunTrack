import { NextApiRequest, NextApiResponse } from "next/types";
import dbConnect from "../../../../server/mongodb";
import { hash } from "bcrypt";
import User, {
  userInputServerValidator,
} from "../../../../server/mongodb/models/User";
import {
  isAdmin,
  isOwnUser,
  isOriginalOrgAdmin,
} from "../../../utils/routeProtection";

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
      const isadmin = await isAdmin(req, res);
      const isownuser = await isOwnUser(req, res);
      const isogadmin = await isOriginalOrgAdmin(req, res);
      if (user.role === "admin" && !isogadmin) {
        return res.status(403).json({
          error: "Only the original organization Admin can modify other admins",
        });
      }

      if (!isadmin && !isownuser) {
        return res.status(403).json({
          error:
            "Only Admins can modify other users, and volunteers can only modify themselves",
        });
      }

      const result = userInputServerValidator.partial().safeParse(req.body);
      if (!result.success) return res.status(400).json(result);

      if (result.data.password) {
        result.data.passwordHash = await hash(
          `${user.email}${result.data.password}`,
          10
        );
      }

      await user.updateOne(result.data);
      return res.status(200).json({ user });
    }
    case "POST": {
      const isadmin = await isAdmin(req, res);
      const isownuser = await isOwnUser(req, res);
      const isogadmin = await isOriginalOrgAdmin(req, res);
      if (user.role === "admin" && !isogadmin) {
        return res.status(403).json({
          error: "Only the origianl organization Admin can modify other admins",
        });
      }
      // only admins can modify other users, and volunteers can only modify themselves
      if (!isadmin && !isownuser) {
        return res.status(403).json({
          error:
            "Only Admins can modify other users, and volunteers can only modify themselves",
        });
      }

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
