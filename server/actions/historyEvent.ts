import { HydratedDocument, Types } from "mongoose";
import { HistoryEventInputData } from "../../src/validators/historyEvents";
import dbConnect from "../mongodb";
import { EventData } from "../mongodb/models/Event";
import { EventParentData } from "../mongodb/models/EventParent";
import HistoryEvent, { HistoryEventData } from "../mongodb/models/HistoryEvent";
import { UserData } from "../mongodb/models/User";

export const getHistoryEvents = async (
  userId: string,
  organizationId: string,
  eventId?: string
): Promise<HydratedDocument<HistoryEventData>[]> => {
  await dbConnect();

  const find: { userId: string; organizationId: string; eventId?: string } = {
    userId,
    organizationId,
  };
  if (eventId) find.eventId = eventId;
  return await HistoryEvent.find(find).sort("createdAt");
};

export const createHistoryEvent = async (
  historyEventInputData: HistoryEventInputData
): Promise<HydratedDocument<HistoryEventData>> => {
  await dbConnect();

  return await HistoryEvent.create(historyEventInputData);
};

export const createHistoryEventCreateEvent = (
  userId: Types.ObjectId,
  event: HydratedDocument<EventData>,
  eventParent: HydratedDocument<EventParentData>
) =>
  createHistoryEvent({
    keyword: "CREATED",
    description: `Created event ${eventParent.title}`,
    userId,
    organizationId: eventParent.organizationId,
    eventId: event._id,
  });

export const createHistoryEventEditEvent = (
  userId: Types.ObjectId,
  event: HydratedDocument<EventData>,
  eventParent: HydratedDocument<EventParentData>
) =>
  createHistoryEvent({
    keyword: "EDITED",
    description: `Edited event ${eventParent.title}`,
    userId,
    organizationId: eventParent.organizationId,
    eventId: event._id,
  });

export const createHistoryEventDeleteEvent = (
  userId: Types.ObjectId,
  event: HydratedDocument<EventData>,
  eventParent: HydratedDocument<EventParentData>
) =>
  createHistoryEvent({
    keyword: "DELETED",
    description: `Deleted event with id ${event._id.toString()}`,
    userId,
    organizationId: eventParent.organizationId,
    eventId: event._id,
  });

export const createHistoryEventEditProfile = (
  user: HydratedDocument<UserData>
) =>
  createHistoryEvent({
    keyword: "EDITED",
    description: `Edited profile of user ${user.email}`,
    userId: user._id,
    organizationId: user.organizationId,
  });

export const createHistoryEventDeleteProfile = (
  user: HydratedDocument<UserData>
) =>
  createHistoryEvent({
    keyword: "DELETED",
    description: `Deleted profile of userId ${user._id.toString()}`,
    userId: user._id,
    organizationId: user.organizationId,
  });
