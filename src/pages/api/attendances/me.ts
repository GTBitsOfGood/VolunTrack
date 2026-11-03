import { createVolunteerClockHandler } from "../../../../server/actions/volunteerClock";
import { volunteerClockDependencies } from "../../../../server/actions/volunteerClockDependencies";

export default createVolunteerClockHandler(
  "status",
  volunteerClockDependencies
);
