import { NextApiRequest, NextApiResponse } from "next/types";
import dbConnect from "../../../../../server/mongodb";
import User, {
  userInputServerValidator,
} from "../../../../../server/mongodb/models/User";
import Attendance, {
  attendanceInputServerValidator,
} from "../../../../../server/mongodb/models/Attendance";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();
  const userInput = req.body.userInput;
  const eventId = req.query.id;
  const eventName = req.query.id;

  const userValid = userInputServerValidator.safeParse(userInput);
  if (!userValid.success)
    return res.status(400).json({ error: userValid.error });

  const user = (await User.exists({ email: userInput.email }))
    ? await User.findOne({ email: userInput.email })
    : await User.create(userValid);
  const createdUser = (await User.exists({ email: userInput.email }))
    ? false
    : true;

  const attendanceInput = {
    userId: user?._id.toString(),
    eventId,
    organizationId: user?.organizationId?.toString(),
    eventName,
    volunteerName: user?.firstName + ' ' + user?.lastName,
    volunteerEmail: user?.email,
    checkinTime: new Date().toISOString(),
  };

  const attendanceValid =
    attendanceInputServerValidator.safeParse(attendanceInput);
  if (!attendanceValid.success)
    return res.status(400).json({ error: attendanceValid.error });

  const attendance = await Attendance.create(attendanceValid.data);

  return res.status(200).json({ attendance, createdUser });
};
