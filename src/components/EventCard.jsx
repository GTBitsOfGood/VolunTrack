import {
  CheckCircleIcon,
  PencilIcon,
  PlusCircleIcon,
  TrashIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";
import { Label, Tooltip } from "flowbite-react";
import router from "next/router";
import PropTypes from "prop-types";
import { useState } from "react";
import DateDisplayComponent from "../components/DateDisplay";
import Text from "../components/Text";
import EventDeleteModal from "../screens/Events/Admin/EventDeleteModal";
import EventEditModal from "../screens/Events/Admin/EventEditModal";

const EventCard = (props) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [collapse, setCollapse] = useState(false);
  const [event, setEvent] = useState(props.event);

  const open = () => {
    setCollapse(!collapse);
  };

  const registerOnClick = (e) => {
    router.push(`/events/${props.event._id}/register`);
    e.stopPropagation();
  };

  const manageAttendanceOnClick = (e) => {
    router.push(`/events/${props.event._id}/attendance`);
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

  return (
    <div
      className="mx-18 mb-2 flex flex-col rounded-xl border-2 bg-grey px-6 py-3"
      onClick={open}
    >
      <div className="flex justify-between">
        <div className="flex justify-start">
          <DateDisplayComponent
            date={props.event.date}
            version={props.version ?? "Primary"}
          />
          <div className="flex-column flex text-xl">
            <Label class="text-xl font-bold">
              {props.event.eventParent.title}
            </Label>
            <Label>{`${props.functions.convertTime(
              props.event.eventParent.startTime
            )} - ${props.functions.convertTime(
              props.event.eventParent.endTime
            )} EST`}</Label>
          </div>
        </div>
        <div className="flex-column justify-end">
          {props.user.role === "admin" && (
            <div className="flex justify-end">
              <Tooltip content="Edit" style="light">
                <button className="mx-1" onClick={editOnClick}>
                  <PencilIcon className="h-8 text-primaryColor" />
                </button>
              </Tooltip>
              <Tooltip content="Delete" style="light">
                <button className="mx-1" onClick={deleteOnClick}>
                  <TrashIcon className="h-8 text-primaryColor" />
                </button>
              </Tooltip>
              <Tooltip content="Manage Attendance" style="light">
                <button className="mx-1" onClick={manageAttendanceOnClick}>
                  <UsersIcon className="h-8 text-primaryColor" />
                </button>
              </Tooltip>
              <EventDeleteModal
                open={showDeleteModal}
                toggle={toggleDeleteModal}
                event={event}
              />
              <EventEditModal
                open={showEditModal}
                toggle={toggleEditModal}
                event={event}
                setEvent={setEvent}
              />
            </div>
          )}
          {props.user.role === "volunteer" && (
            <>
              {props.event.volunteers.includes(props.user._id) ? (
                <button
                  className="align-items-center mx-1 flex"
                  onClick={registerOnClick}
                >
                  <CheckCircleIcon className="h-8 text-primaryColor" />
                  <span>Registered!</span>
                </button>
              ) : (
                <button
                  className="align-items-center mx-1 flex"
                  onClick={registerOnClick}
                >
                  <PlusCircleIcon className="h-8 text-primaryColor" />
                  <span>Register</span>
                </button>
              )}
            </>
          )}
          <Label className="justify-end">
            {props.event.eventParent.maxVolunteers} slots available
          </Label>
        </div>
      </div>
      {collapse && (
        <div className="ml-16 mt-2 space-y-2 pl-2">
          <div className="flex-column flex">
            <Label class="text-md mb-0 mr-1 font-bold">Address: </Label>
            <p>{props.event.address}</p>
          </div>
          <div className="flex-column flex">
            <Label class="text-md mb-0 mr-1 font-bold">Description: </Label>
            <div
              className="h-12 overflow-hidden"
              dangerouslySetInnerHTML={{
                __html: props.event.eventParent.description,
              }}
            />
          </div>
          <Text
            className="mt-4"
            href={`events/${props.event._id}`}
            text="More Information"
          />
        </div>
      )}
    </div>
  );
};

EventCard.propTypes = {
  key: PropTypes.object.isRequired,
  event: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  functions: PropTypes.object.isRequired,
  onRegisterClicked: PropTypes.func.isRequired,
  version: PropTypes.string,
};

export default EventCard;
