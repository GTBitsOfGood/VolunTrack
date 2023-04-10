import { Types } from "mongoose";
import dbConnect from "../mongodb";
import { EventDocument } from "../mongodb/models/Event";
import { EventParentDocument } from "../mongodb/models/EventParent";
import HistoryEvent, {
  HistoryEventDocument,
  HistoryEventInputClient,
} from "../mongodb/models/HistoryEvent";
import { UserDocument } from "../mongodb/models/User";

export const getHistoryEvents = async (
  userId: Types.ObjectId,
  organizationId: Types.ObjectId,
  eventId?: Types.ObjectId
): Promise<HistoryEventDocument[]> => {
  await dbConnect();

  const find: {
    userId: Types.ObjectId;
    organizationId: Types.ObjectId;
    eventId?: Types.ObjectId;
  } = {
    userId,
    organizationId,
  };
  if (eventId) find.eventId = eventId;
  return await HistoryEvent.find(find).sort("createdAt");
};

export const createHistoryEvent = async (
  historyEventInput: HistoryEventInputClient
): Promise<HistoryEventDocument> => {
  await dbConnect();

  return await HistoryEvent.create(historyEventInput);
};

export const createHistoryEventCreateEvent = (
  user: UserDocument,
  event: EventDocument,
  eventParent: EventParentDocument
) =>
  createHistoryEvent({
    keyword: "CREATED",
    description: `${user.firstName} ${user.lastName} created event ${eventParent.title}`,
    userId: user._id,
    organizationId: eventParent.organizationId,
    eventId: event._id,
  });

export const createHistoryEventEditEvent = (
  user: UserDocument,
  event: EventDocument,
  eventParent: EventParentDocument
) =>
  createHistoryEvent({
    keyword: "EDITED",
    description: `${user.firstName} ${user.lastName} edited event ${eventParent.title}}`,
    userId: user._id,
    organizationId: eventParent.organizationId,
    eventId: event._id,
  });

export const createHistoryEventDeleteEvent = (
  user: UserDocument,
  event: EventDocument,
  eventParent: EventParentDocument
) =>
  createHistoryEvent({
    keyword: "DELETED",
    description: `${user.firstName} ${
      user.lastName
    } deleted event with id ${event._id.toString()}`,
    userId: user._id,
    organizationId: eventParent.organizationId,
    eventId: event._id,
  });

export const createHistoryEventEditProfile = (user: UserDocument) =>
  createHistoryEvent({
    keyword: "EDITED",
    description: `Edited profile of user ${user.email}`,
    userId: user._id,
    organizationId: user.organizationId,
  });

export const createHistoryEventDeleteProfile = (user: UserDocument) =>
  createHistoryEvent({
    keyword: "DELETED",
    description: `Deleted profile of userId ${user._id.toString()}`,
    userId: user._id,
    organizationId: user.organizationId,
  });
