import { NextApiRequest, NextApiResponse } from "next/types";
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
      const isadmin = await isAdmin(req, res);
      // this is only used when creating a new organization in Voluntrack
      if (!isadmin) {
        return res
          .status(403)
          .json({ error: "Only Admins can modify organization code" });
      }

      const result = await updateUserOrganizationId(id, orgCode);

      return res.status(result.status).json({
        message: result.message,
        user: result.user,
      });
    }
  }
};
