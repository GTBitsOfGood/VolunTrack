import { Types } from "mongoose";
import Event, { EventPopulatedDocument } from "../mongodb/models/Event";
import Registration, {
  RegistrationDocument,
} from "../mongodb/models/Registration";

export type CapacityCheckResult =
  | { status: "not_found" }
  | {
      status: "full";
      event: EventPopulatedDocument;
      remainingSpots: number;
    }
  | {
      status: "ok";
      event: EventPopulatedDocument;
      remainingSpots: number;
    };

const normalizeEventId = (eventId: string | Types.ObjectId) =>
  typeof eventId === "string" ? new Types.ObjectId(eventId) : eventId;

const countRegistrationSpots = (registrations: RegistrationDocument[]) =>
  registrations.reduce(
    (total, registration) => total + 1 + (registration.minors.length ?? 0),
    0
  );

export const checkEventCapacity = async (
  eventId: string | Types.ObjectId,
  requestedSpots: number
): Promise<CapacityCheckResult> => {
  const normalizedEventId = normalizeEventId(eventId);
  const event = await Event.findById(normalizedEventId)
    .populate("eventParent")
    .lean<EventPopulatedDocument | null>();

  if (!event?.eventParent.maxVolunteers) {
    return { status: "not_found" };
  }

  const registrations = await Registration.find({
    eventId: normalizedEventId,
    approved: { $ne: "denied" },
  });

  const occupiedSpots = countRegistrationSpots(registrations);
  const remainingSpotsBeforeRequest = Math.max(
    event.eventParent.maxVolunteers - occupiedSpots,
    0
  );

  if (remainingSpotsBeforeRequest < requestedSpots) {
    return {
      status: "full",
      event,
      remainingSpots: remainingSpotsBeforeRequest,
    };
  }

  return {
    status: "ok",
    event,
    remainingSpots: remainingSpotsBeforeRequest,
  };
};
