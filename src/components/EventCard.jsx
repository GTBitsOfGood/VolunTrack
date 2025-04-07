import { PencilIcon, TrashIcon, UsersIcon } from "@heroicons/react/24/solid";
import {
  ExclamationCircleIcon as OutlineExclamationCircleIcon,
  ChevronRightIcon as OutlineChevronRightIcon,
} from "@heroicons/react/24/outline";
import { Label, Tooltip, Badge } from "flowbite-react";
import router from "next/router";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import DateDisplayComponent from "../components/DateDisplay";
import Text from "../components/Text";
import { getRegistrations } from "../queries/registrations";
import EventDeleteModal from "../screens/Events/Admin/EventDeleteModal";
import EventEditModal from "../screens/Events/Admin/EventEditModal";

const EventCard = (props) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [collapse, setCollapse] = useState(false);
  const [event, setEvent] = useState(props.event);
  const [registrations, setRegistrations] = useState([]);
  const [regCount, setRegCount] = useState(0);
  const isRegistered = props.isRegistered;
  const onEventDelete = props.onEventDelete;
  const onEventEdit = props.onEventEdit;

  useEffect(() => {
    getRegistrations({ eventId: event._id }).then((res) => {
      let count = 0;
      res.data.registrations.map((reg) => {
        if (reg.approved == "approved") {
          count += 1 + reg.minors.length;
        }
      });
      setRegCount(count);
    });
  }, []);

  const open = () => {
    router.push(`/events/${event._id}/register`);
  };

  const registerOnClick = (e) => {
    router.push(`/events/${event._id}/register`);
    e.stopPropagation();
  };

  const manageAttendanceOnClick = (e) => {
    router.push(`/events/${event._id}/attendance`);
    e.stopPropagation();
  };

  const deleteOnClick = (event) => {
    setShowDeleteModal(true);
    event.stopPropagation();
  };

  const editOnClick = (event) => {
    setShowEditModal(true);
    event.stopPropagation();
  };

  const toggleDeleteModal = () => {
    setShowDeleteModal((prev) => !prev);
  };

  const toggleEditModal = () => {
    setShowEditModal((prev) => !prev);
  };

  const pastEvent = (event) => {
    let currentDate = new Date();
    let utcNow = new Date(
      Date.UTC(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        currentDate.getHours(),
        currentDate.getMinutes()
      )
    );
    let eventDate = new Date(event.date);
    const [hours, minutes] = event.eventParent.endTime.split(":").map(Number);
    eventDate.setUTCHours(hours, minutes);

    return eventDate < utcNow;
  };

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

  return (
    <div
      className={`mx-18 mb-2 mr-2 flex cursor-pointer flex-col rounded-xl bg-grey px-[0.75rem] py-3 md:px-6`}
      onClick={() => {
        if (!showEditModal) open();
      }}
    >
      <div className="flex w-full items-center justify-between gap-10">
        <div className="flex items-center justify-start">
          <DateDisplayComponent
            key={event.date}
            date={event.date}
            version={pastEvent(event) ? "Past" : props.version ?? "Primary"}
          />
          <div className="flex-column flex flex-1 text-xl">
            <div className="mb-1 flex items-center">
              <Label class="mb-0 line-clamp-1 text-xl font-bold">
                {event.eventParent.title}
              </Label>
              {event.eventParent.isPrivate && (
                <Badge className="ml-2 mr-1 flex items-center bg-secondaryColor text-primaryColor">
                  <span className="hidden md:inline">Private Event</span>
                  <span className="inline md:hidden">Private</span>
                </Badge>
              )}
            </div>
            <Label className="mb-0">{`${convertTime(
              event.eventParent.startTime
            )} - ${convertTime(event.eventParent.endTime)} EST`}</Label>
            {pastEvent(event) ? (
              <div className="flex items-center space-x-2">
                <OutlineExclamationCircleIcon className="mr-1 h-6 w-6 text-red-500" />
                <Label className="m-0 text-red-500">Event has passed</Label>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="flex h-full flex-col items-end justify-center">
          {props.user.role === "admin" && (
            <div className="flex justify-end">
              {pastEvent(event) ? (
                <div>
                  <button
                    className="mx-1 cursor-not-allowed text-gray-400"
                    disabled
                  >
                    <PencilIcon className="h-4 md:h-8" />
                  </button>
                </div>
              ) : (
                <Tooltip content="Edit" style="light">
                  <button className="mx-1" onClick={editOnClick}>
                    <PencilIcon className="h-4 text-primaryColor md:h-8" />
                  </button>
                </Tooltip>
              )}
              {pastEvent(event) ? (
                <div>
                  <button
                    className="mx-1 cursor-not-allowed text-gray-400"
                    disabled
                  >
                    <TrashIcon className="h-4 md:h-8" />
                  </button>
                </div>
              ) : (
                <Tooltip content="Delete" style="light">
                  <button className="mx-1" onClick={deleteOnClick}>
                    <TrashIcon className="h-4 text-primaryColor md:h-8" />
                  </button>
                </Tooltip>
              )}
              <Tooltip content="Manage Attendance" style="light">
                <button className="mx-1" onClick={manageAttendanceOnClick}>
                  <UsersIcon className="h-4 text-primaryColor md:h-8" />
                </button>
              </Tooltip>
              <div className="w-fits">
                <button className="mx-1" onClick={open}>
                  <OutlineChevronRightIcon className="h-5 w-5 text-primaryColor md:h-8" />
                </button>
              </div>
              <EventDeleteModal
                open={showDeleteModal}
                toggle={toggleDeleteModal}
                event={event}
                onEventDelete={onEventDelete}
              />
              <EventEditModal
                open={showEditModal}
                toggle={toggleEditModal}
                event={event}
                setEvent={(e, id, eventParentId, recurringEvent) => {
                  setEvent(e);
                  onEventEdit(id, eventParentId, recurringEvent);
                }}
                regCount={regCount}
                setEventEdit={props?.setEventEdit}
              />
            </div>
          )}
          {/* {props.user.role === "volunteer" && isRegistered === "approved" && (
            <button
              className="mx-1 flex items-center justify-end"
              onClick={registerOnClick}
            >
              <CheckCircleIcon className="h-8 text-primaryColor" />
              <span>Registered!</span>
            </button>
          )}
          {props.user.role === "volunteer" && isRegistered === "pending" && (
            <button
              className="mx-1 flex items-center justify-end"
              onClick={registerOnClick}
            >
              <ClockIcon className="h-8 text-primaryColor" />
              <span>Pending</span>
            </button>
          )}
          {props.user.role === "volunteer" && isRegistered === "denied" && (
            <button
              className="mx-1 flex items-center justify-end"
              onClick={registerOnClick}
            >
              <ExclamationCircleIcon className="h-8 text-primaryColor" />
              <span>Denied</span>
            </button>
          )} */}
          {props.user.role === "volunteer" ? (
            <div className="flex h-16 flex-grow flex-col justify-around">
              <div className="flex w-full justify-end">
                <OutlineChevronRightIcon className="h-5 w-5 text-primaryColor" />
              </div>
              <Label className="mb-0 text-end">
                {Math.max(event.eventParent.maxVolunteers - regCount, 0)}/
                {event.eventParent.maxVolunteers} slots available
              </Label>
            </div>
          ) : (
            <div className="flex h-full flex-col justify-center">
              <Label className="mb-0 text-end text-darkGrey">
                {Math.max(event.eventParent.maxVolunteers - regCount, 0)}/
                {event.eventParent.maxVolunteers} slots available
              </Label>
            </div>
          )}
        </div>
      </div>
      {/* {collapse && (
        <div className="ml-16 mt-2 space-y-2 pl-2">
          <div className="flex-column flex">
            <Label className="text-md mb-0 mr-1 font-bold">Address: </Label>
            <p className="line-clamp-1">{event.eventParent.address}</p>
          </div>
          <div className="flex-column flex">
            <Label class="text-md mb-0 mr-1 font-bold">Description: </Label>
            <div
              className="h-12 overflow-hidden"
              dangerouslySetInnerHTML={{
                __html: event.eventParent.description,
              }}
            />
          </div>
          <Text
            className="mt-4"
            href={`events/${event._id}`}
            text="More Information"
          />
        </div>
      )} */}
    </div>
  );
};

EventCard.propTypes = {
  key: PropTypes.object.isRequired,
  event: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  version: PropTypes.string,
  setEventEdit: PropTypes.func,
  onEventEdit: PropTypes.func.isRequired,
};

export default EventCard;
