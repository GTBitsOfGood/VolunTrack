import { NextApiRequest, NextApiResponse } from "next/types";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import dbConnect from "../../../../../server/mongodb";
import { updateUserOrganizationId } from "../../../../../server/actions/users_new";
import { isAdmin } from "../../../../utils/routeProtection";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  const id = req.query.id as string;
  if (!id) {
    return res.status(404).json({
      error: `User with id ${id} not found`,
    });
  }
  const orgCode = req.body.orgCode as string;

  switch (req.method) {
    case "PUT": {
      const session = await getServerSession(req, res, authOptions);
      const isadmin = await isAdmin(req, res);

      // Allow if:
      // 1. User is an admin (can update any user's org code)
      // 2. User is updating their own account AND doesn't have an org yet
      const isOwnAccount = session?.user._id.toString() === id;
      const hasNoOrg = !session?.user.organizationId;

      if (!isadmin && !(isOwnAccount && hasNoOrg)) {
        return res
          .status(403)
          .json({ error: "Not authorized to modify organization code" });
      }

      const result = await updateUserOrganizationId(id, orgCode);

      return res.status(result.status).json({
        message: result.message,
        user: result.user,
      });
    }
  }
};
