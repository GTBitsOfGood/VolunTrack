import { NextApiRequest, NextApiResponse } from "next/types";
import dbConnect from "../../../../../server/mongodb";
import User, {
  userInputServerValidator,
} from "../../../../../server/mongodb/models/User";
import Attendance, {
  attendanceInputServerValidator,
} from "../../../../../server/mongodb/models/Attendance";
import Registration, {
  registrationInputServerValidator,
} from "../../../../../server/mongodb/models/Registration";
import { checkEventCapacity } from "../../../../../server/actions/registrationCapacity";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();
  const userInput = req.body.userInput;
  const eventIdParam = req.query.id;
  const eventId = Array.isArray(eventIdParam) ? eventIdParam[0] : eventIdParam;
  const eventName: string = req.body.eventName;

  if (!eventId) {
    return res.status(400).json({ error: "Event id is required." });
  }

  const userValid = userInputServerValidator.safeParse(userInput);
  if (!userValid.success)
    return res.status(400).json({ error: userValid.error });

  const userExists = await User.exists({ email: userValid.data.email });

  const user = userExists
    ? await User.findOne({
        email: userValid.data.email,
        organizationId: userValid.data.organizationId,
      })
    : await User.create({
        email: userValid.data.email,
        firstName: userValid.data.firstName,
        lastName: userValid.data.lastName,
        organizationId: userValid.data.organizationId,
      });

  const registrationInput = {
    userId: user?._id.toString(),
    eventId,
    organizationId: user?.organizationId?.toString(),
  };

  const registrationValid =
    registrationInputServerValidator.safeParse(registrationInput);
  if (!registrationValid.success)
    return res.status(400).json({ error: registrationValid.error });

  const capacityResult = await checkEventCapacity(eventId, 1);
  if (capacityResult.status === "not_found") {
    return res.status(404).json({ error: "Event not found." });
  }
  if (capacityResult.status === "full") {
    return res.status(400).json({
      error:
        capacityResult.remainingSpots <= 0
          ? "This event has reached capacity."
          : `Only ${capacityResult.remainingSpots} spot${
              capacityResult.remainingSpots === 1 ? "" : "s"
            } remain for this event.`,
    });
  }

  await Registration.create(registrationValid.data);

  const attendanceInput = {
    userId: user?._id.toString(),
    eventId,
    organizationId: user?.organizationId?.toString(),
    eventName,
    volunteerName: String(user?.firstName) + " " + String(user?.lastName),
    volunteerEmail: user?.email,
    checkinTime: new Date().toISOString(),
  };

  const attendanceValid =
    attendanceInputServerValidator.safeParse(attendanceInput);
  if (!attendanceValid.success)
    return res.status(400).json({ error: attendanceValid.error });

  const attendance = await Attendance.create(attendanceValid.data);

  return res.status(200).json({ attendance, createdUser: !userExists });
};
