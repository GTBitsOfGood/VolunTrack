import { useEffect, useState } from "react";
import { MapPinIcon } from "@heroicons/react/20/solid";
import {
  ClockIcon,
  CalendarIcon,
  EnvelopeIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import PropTypes from "prop-types";
import Text from "../../../components/Text";
import { getRegistrations } from "../../../queries/registrations";

const convertTime = (time) => {
  let [hour, min] = time.split(":");
  let hours = parseInt(hour);
  let suffix = time[-2];
  if (!(suffix in ["pm", "am", "PM", "AM"])) {
    suffix = hours > 11 ? "pm" : "am";
  }
  hours = ((hours + 11) % 12) + 1;
  return hours.toString() + ":" + min + suffix;
};

const EventRegisterInfoContainer = ({
  event,
  user,
  eventId,
  refreshTrigger = 0,
}) => {
  // const { email = "", phone_number = "" } = user?.bio ?? {};

  const [approvalStatus, setApprovalStatus] = useState(null);

  useEffect(() => {
    if (eventId && user?._id) {
      getRegistrations({ eventId: eventId, userId: user._id })
        .then((response) => {
          if (response?.data?.registrations?.length > 0) {
            setApprovalStatus(response.data.registrations[0].approved);
          }
        })
        .catch((error) => {
          console.error("Error fetching registration:", error);
          setApprovalStatus("Unknown");
        });
    }
  }, [eventId, user, refreshTrigger]);

  if (!event || !event.date) {
    return <div />;
  }

  return (
    <div className="flex w-11/12 flex-col space-y-2 rounded-md">
      <div className="flex flex-row items-center justify-between">
        <Text text={event.eventParent.title} type="header" />
      </div>

      {event.eventParent.description && (
        <div
          className="w-[75vw]"
          dangerouslySetInnerHTML={{ __html: event.eventParent.description }}
        />
        // <Text text={event.eventParent.description} type="helper"></Text>
      )}

      <div className="flex flex-col">
        {event.eventParent.isValidForCourtHours && (
          <Text
            text="This event can count toward court required hours"
            type="helper"
          />
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <div className="flex w-64 items-center rounded-md bg-[#F8F8FA] p-2">
          <CalendarIcon class="h-6 w-6" />
          <Text
            text={new Date(event.date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              timeZone: "UTC",
            })}
            className="ml-2 font-bold text-primaryColor"
            type="subheader"
          />
        </div>
        <div className="flex w-64 items-center rounded-md bg-[#F8F8FA] p-2">
          <ClockIcon class="h-6 w-6 text-black" />
          <div className="ml-2 flex flex-col items-start">
            <Text
              text={
                convertTime(event.eventParent.startTime) +
                " - " +
                convertTime(event.eventParent.endTime)
              }
              className="font-bold text-primaryColor"
              type="subheader"
            />
            <Text text={event.eventParent.localTime} type="helper" />
          </div>
        </div>
        <div className="flex w-64 min-w-max items-center rounded-md bg-[#F8F8FA] p-2">
          <MapPinIcon class="h-6 w-6" />
          <div className="item-center flex flex-col">
            <Text
              text={event.eventParent.address}
              className="ml-2 font-bold text-primaryColor"
              type="subheader"
            />
            <Text
              text={`${event.eventParent.city}, ${event.eventParent.state}, ${event.eventParent.zip}`}
              className="ml-2 font-bold"
              type="helper"
            />
          </div>
        </div>
      </div>
      <Text text="Contact Us" type="subheader" className="mt-4" />
      <div className="flex flex-wrap gap-2">
        <div className="flex w-64 items-center rounded-md bg-white p-2">
          <EnvelopeIcon class="h-6 w-6 text-primaryColor" />
          <Text
            text={event.eventParent.eventContactEmail}
            className="ml-2 font-bold text-primaryColor"
          />
        </div>
        <div className="flex w-64 items-center rounded-md bg-white p-2">
          <PhoneIcon class="h-6 w-6 text-primaryColor" />
          <Text
            text={event.eventParent.eventContactPhone}
            className="ml-2 font-bold text-primaryColor"
          />
        </div>
      </div>
    </div>
  );
};

EventRegisterInfoContainer.propTypes = {
  event: PropTypes.object,
  user: PropTypes.object,
  eventId: PropTypes.string,
  confirmRegPage: PropTypes.bool,
};

export default EventRegisterInfoContainer;
