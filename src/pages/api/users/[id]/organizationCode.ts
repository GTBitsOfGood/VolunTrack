import { NextApiRequest, NextApiResponse } from "next/types";
import dbConnect from "../../../../../server/mongodb";
import { updateUserOrganizationId } from "../../../../../server/actions/users_new";

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
      const result = await updateUserOrganizationId(id, orgCode);

      return res.status(result.status).json({
        message: result.message,
        user: result.user,
      });
    }
  }
};
