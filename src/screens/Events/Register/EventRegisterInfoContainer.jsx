import PropTypes from "prop-types";
import Text from "../../../components/Text";
import {
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";
import { MapPinIcon } from "@heroicons/react/20/solid";

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

const EventRegisterInfoContainer = ({ event, user, eventId }) => {
  // const { email = "", phone_number = "" } = user?.bio ?? {};

  if (!event || !event.date) {
    return <div />;
  }

  return (
    <div className="flex w-11/12 flex-col space-y-2 rounded-md bg-white py-2">
      <div className="mx-6 mt-2 flex flex-row items-center justify-between">
        <Text text={event.title} className="text-primaryColor" type="header" />
        <Text text="See Full Event Information" href={`/events/${eventId}`} />
      </div>
      <div className="flex flex-col space-y-2 py-2">
        {event.isValidForCourtHours && (
          <Text
            text="This event can count toward court required hours"
            type="helper"
          />
        )}
      </div>
      <div className="space-4 flex flex-wrap">
        <div className="mx-4 my-2 flex w-64 items-center rounded-md bg-grey p-2">
          <CalendarIcon class="h-6 w-6 text-primaryColor" />
          <Text text={event.date.slice(0, 10)} className="ml-2 font-bold" />
        </div>
        <div className="mx-4 my-2 flex w-64 items-center rounded-md bg-grey p-2">
          <ClockIcon class="h-6 w-6 text-primaryColor" />
          <Text
            text={
              convertTime(event.startTime) + " - " + convertTime(event.endTime)
            }
            className="ml-2 font-bold"
          />
          <Text text={event.localTime} />
        </div>
        <div className="mx-4 my-2 flex w-64 items-center rounded-md bg-grey p-2">
          <MapPinIcon class="h-6 w-6 text-primaryColor" />
          <Text
            text={`${event.address}, ${event.city}, ${event.state}, ${event.zip}`}
            className="ml-2 font-bold"
          />
        </div>
      </div>
      <div className="ml-4 flex flex-col space-y-3 pb-4">
        <Text text="Contact Us" type="subheader" />
        <div className="flex items-center">
          <EnvelopeIcon class="h-6 w-6 text-primaryColor" />
          <Text text={event.eventContactEmail} className="ml-2" />
        </div>
        <div className="flex items-center">
          <PhoneIcon class="h-6 w-6 text-primaryColor" />
          <Text text={event.eventContactPhone} className="ml-2" />
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
