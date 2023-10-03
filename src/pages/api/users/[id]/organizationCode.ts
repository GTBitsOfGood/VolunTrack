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
      const updatedUser = await updateUserOrganizationId(id, orgCode);
      if (!updatedUser) {
        return res.status(400).json({
          error: `Error has occurred`,
        });
      } else {
        return res.status(200).json({
          user: updatedUser,
        });
      }
    }
  }
};
