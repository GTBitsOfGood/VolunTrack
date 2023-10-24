import { isValidObjectId, Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next/types";
import dbConnect from "../../../../../server/mongodb";
import User, {
  userInputServerValidator,
} from "../../../../../server/mongodb/models/User";
import { attendanceInputServerValidator } from "../../../../../server/mongodb/models/Attendance";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    await dbConnect();
    const userInput = req.body;
    const eventId = req.query.id;

    const result = userInputServerValidator.safeParse(userInput);
    if (!result.success) return res.status(400).json(result);
    
    if (await User.exists({ email: userInput.email }))
    const user = await User.create();

    const attendance = attendanceInputServerValidator.safeParse();
    if (!attendance.success) return res.status(400).json({ error: attendance.error });

    return res
        .status(201)
        .json({ attendance: await Attendance.create(result.data) });

    return res.status(200).json({ user });
};
