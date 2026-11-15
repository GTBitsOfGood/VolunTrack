import { NextApiRequest, NextApiResponse } from "next/types";
import dbConnect from "../../../../../server/mongodb";
import User, {
  userInputServerValidator,
} from "../../../../../server/mongodb/models/User";
import { checkEventCapacity } from "../../../../../server/actions/registrationCapacity";

import { createWalkInAttendance } from "../../../../../server/actions/attendancePersistence";
import { AttendanceCorrectionError } from "../../../../../server/actions/attendanceCorrections";
import { getClockWindow } from "../../../../../server/actions/volunteerClock";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }
  await dbConnect();
  const userInput = req.body.userInput;
  const eventIdParam = req.query.id;
  const eventId = Array.isArray(eventIdParam) ? eventIdParam[0] : eventIdParam;

  if (!eventId) {
    return res.status(400).json({ error: "Event id is required." });
  }

  const userValid = userInputServerValidator.safeParse(userInput);
  if (!userValid.success)
    return res.status(400).json({ error: userValid.error });

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

  const event = capacityResult.event;
  const parent = event.eventParent;
  const shift = {
    _id: event._id.toString(),
    date: event.date,
    organizationId: parent.organizationId.toString(),
    title: parent.title,
    startTime: parent.startTime,
    endTime: parent.endTime,
  };
  const now = new Date();
  try {
    const window = getClockWindow(shift);
    if (
      now < window.clockInOpensAt ||
      now > window.clockInClosesAt ||
      userValid.data.organizationId !== shift.organizationId
    ) {
      return res.status(403).json({
        error:
          "Check-in requires this organization and the shift's Atlanta check-in window.",
      });
    }
  } catch {
    return res
      .status(422)
      .json({ error: "Invalid or ambiguous shift times. Contact an admin." });
  }

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

  if (!user || user.organizationId?.toString() !== shift.organizationId) {
    return res.status(403).json({
      error: "Volunteer does not belong to the shift's organization.",
    });
  }
  try {
    const attendance = await createWalkInAttendance(
      shift,
      {
        _id: user._id.toString(),
        organizationId: user.organizationId.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      now
    );
    return res.status(200).json({ attendance, createdUser: !userExists });
  } catch (error) {
    if (error instanceof AttendanceCorrectionError) {
      return res.status(error.status).json({ error: error.message });
    }
    return res
      .status(500)
      .json({ error: "Check-in was not saved. Please try again." });
  }
};
