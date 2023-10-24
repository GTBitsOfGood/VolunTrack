import { isValidObjectId, Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next/types";
import {
    createUserFromCheckIn,
} from "../../../../../server/actions/users_new";
import dbConnect from "../../../../../server/mongodb";
import {
  UserInputClient,
  userInputServerValidator,
} from "../../../../../server/mongodb/models/User";
import { attendanceInputServerValidator } from "../../../../../server/mongodb/models/Attendance";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    await dbConnect();
    const result = userInputServerValidator.safeParse(req.body);
    if (!result.success) return res.status(400).json(result);

    const user = await createUserFromCheckIn(
        req.body = 
    );
    if (!user) return res.status(400).json({ error: "User already exists" });

    const attendance = attendanceInputServerValidator.safeParse(req.body);
      if (!result.success) return res.status(400).json({ error: result.error });

      return res
        .status(201)
        .json({ attendance: await Attendance.create(result.data) });

    return res.status(200).json({ user });
};
