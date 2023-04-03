import { Types } from "mongoose";
import { agenda } from "./index";

export const scheduler = {
  // Schedules relevant jobs when a new event is created, such as scheduling a survey email for when the event ends
  scheduleNewEventJobs: async (
    eventId: Types.ObjectId,
    date: Date,
    endTime: string
  ): Promise<void> => {
    // Get the end date and time of the event
    const endTimeSplit = endTime.split(":");
    const eventEndTime = new Date(
      date.getTime() +
        parseInt(endTimeSplit[0]) * 3_600_000 +
        parseInt(endTimeSplit[1]) * 60_000 +
        new Date().getTimezoneOffset() * 60_000
    );

    // Schedule job for sending survey email when the event ends
    await agenda.schedule(eventEndTime, "send-survey-email", eventId);
  },
};
