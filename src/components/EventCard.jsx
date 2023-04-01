import PropTypes from "prop-types";
import { Label, Tooltip } from "flowbite-react";
import DateDisplayComponent from "../components/DateDisplay";
import Text from "../components/Text";
import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  UsersIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/solid";
import router from "next/router";
import EventEditModal from "../screens/Events/Admin/EventEditModal";
import BasicModal from "./BasicModal";
import { deleteEvent } from "../actions/queries";

const EventCard = (props) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [collapse, setCollapse] = useState(false);
  const [event, setEvent] = useState(props.event);
  const {
    data: { user },
  } = useSession();

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

  const confirmDeleteModal = () => {
    deleteEvent(event._id, user._id)
      .then(() => {
        toggleDeleteModal();
      })
      .catch(console.log);
  };

  const toggleEditModal = () => {
    setShowEditModal((prev) => !prev);
  };

  return (
    <div
      className="mx-18 bg-grey mb-2 flex flex-col rounded-xl border-2 px-6 py-3"
      onClick={open}
    >
      <div className="flex justify-between">
        <div className="flex justify-start">
          <DateDisplayComponent
            date={props.event.date}
            version={props.version ?? "Primary"}
          />
          <div className="flex-column flex text-xl">
            <Text text={props.event.title} type="subheading" />
            <Label>{`${props.functions.convertTime(
              props.event.startTime
            )} - ${props.functions.convertTime(
              props.event.endTime
            )} EST`}</Label>
          </div>
        </div>
        <div className="flex-column justify-end">
          {props.user.role === "admin" && (
            <div className="flex justify-end">
              <Tooltip content="Edit" style="light">
                <button className="mx-1" onClick={editOnClick}>
                  <PencilIcon className="text-primaryColor h-8" />
                </button>
              </Tooltip>
              <Tooltip content="Delete" style="light">
                <button className="mx-1" onClick={deleteOnClick}>
                  <TrashIcon className="text-primaryColor h-8" />
                </button>
              </Tooltip>
              <Tooltip content="Manage Attendance" style="light">
                <button className="mx-1" onClick={manageAttendanceOnClick}>
                  <UsersIcon className="text-primaryColor h-8" />
                </button>
              </Tooltip>
              <BasicModal
                open={showDeleteModal}
                title={"Delete Event"}
                text={"Are you sure you want to delete this event?"}
                onConfirm={confirmDeleteModal}
                onCancel={toggleDeleteModal}
                confirmText={"Delete"}
                cancelText={"Cancel"}
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
                  <CheckCircleIcon className="text-primaryColor h-8" />
                  <span>Registered!</span>
                </button>
              ) : (
                <button
                  className="align-items-center mx-1 flex"
                  onClick={registerOnClick}
                >
                  <PlusCircleIcon className="text-primaryColor h-8" />
                  <span>Register</span>
                </button>
              )}
            </>
          )}
          <Label className="justify-end">
            {props.event.max_volunteers - props.event.volunteers.length} slots
            available
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
              dangerouslySetInnerHTML={{ __html: props.event.description }}
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
