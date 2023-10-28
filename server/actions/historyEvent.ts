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
) => {
  if (user.organizationId)
    return createHistoryEvent({
      keyword: "CREATED",
      description: `${user.firstName} ${user.lastName} created event ${eventParent.title}`,
      userId: user._id,
      organizationId: eventParent.organizationId,
      eventId: event._id,
    });
};
export const createHistoryEventEditEvent = (
  user: UserDocument,
  event: EventDocument,
  eventParent: EventParentDocument
) => {
  if (user.organizationId)
    return createHistoryEvent({
      keyword: "EDITED",
      description: `${user.firstName} ${user.lastName} edited event ${eventParent.title}`,
      userId: user._id,
      organizationId: eventParent.organizationId,
      eventId: event._id,
    });
};

export const createHistoryEventDeleteEvent = (
  user: UserDocument,
  event: EventDocument,
  eventParent: EventParentDocument
) => {
  if (user.organizationId)
    return createHistoryEvent({
      keyword: "DELETED",
      description: `${user.firstName} ${
        user.lastName
      } deleted event with id ${event._id.toString()}`,
      userId: user._id,
      organizationId: eventParent.organizationId,
      eventId: event._id,
    });
};

export const createHistoryEventEditProfile = (user: UserDocument) => {
  if (user.organizationId)
    return createHistoryEvent({
      keyword: "EDITED",
      description: `Edited profile of user ${user.email}`,
      userId: user._id,
      organizationId: user.organizationId,
    });
};

export const createHistoryEventDeleteProfile = (user: UserDocument) => {
  if (user.organizationId)
    return createHistoryEvent({
      keyword: "DELETED",
      description: `Deleted profile of userId ${user._id.toString()}`,
      userId: user._id,
      organizationId: user.organizationId,
    });
};

export const createHistoryEventInviteAdmin = (user: UserDocument) => {
  if (user.organizationId)
    return createHistoryEvent({
      keyword: "CREATED",
      description: `Invited admin to ${user.email}`,
      userId: user._id,
      organizationId: user.organizationId,
    });
};

export const createHistoryEventAttendanceEdited = (
  user: UserDocument,
  event: EventDocument
) => {
  if (user.organizationId)
    return createHistoryEvent({
      keyword: "EDITED",
      description: `${user._id.toString()} ${
        user.lastName
      } edited attendance for event with id ${event._id.toString()}`,
      userId: user._id,
      organizationId: user.organizationId,
      eventId: event._id,
    });
};

export const createHistoryEventAttendanceDeleted = (
  user: UserDocument,
  event: EventDocument
) => {
  if (user.organizationId)
    return createHistoryEvent({
      keyword: "DELETED",
      description: `${
        user.firstName
      } attendance editted for event with id ${event._id.toString()}`,
      userId: user._id,
      organizationId: user.organizationId,
      eventId: event._id,
    });
};

export const createHistoryEventWaiverEdited = (
  user: UserDocument,
  waiverType: string
) => {
  if (user.organizationId)
    return createHistoryEvent({
      keyword: "EDITED",
      description: `User with id ${user._id.toString()} edited ${waiverType.toLowerCase()} waiver for event with id ${user.organizationId.toString()}`,
      userId: user._id,
      organizationId: user.organizationId,
    });
};

export const createHistoryEventOrganizationSettingsUpdated = (
  user: UserDocument,
  organizationId: Types.ObjectId
) => {
  if (user.organizationId)
    return createHistoryEvent({
      keyword: "UPDATED",
      description: `User with id ${user._id.toString()} ${user.firstName} ${
        user.lastName
      } updated organization settings for organization with id ${organizationId.toString()}`,
      userId: user._id,
      organizationId: organizationId,
    });
};
