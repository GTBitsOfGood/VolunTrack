import PropTypes from "prop-types";
import { Label, Button, Tooltip } from "flowbite-react";
import "flowbite-react";
import DateDisplayComponent from "../components/DateDisplay";
import { useState } from "react";
import {
  UsersIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/solid";
import router from "next/router";

const EventCard = (props) => {
  const [collapse, setCollapse] = useState(false);

  const open = () => {
    setCollapse(!collapse);
  };

  const manageAttendanceOnClick = (e) => {
    router.push(`/events/${props.event._id}/attendance`);
    e.stopPropagation();
  };

  const registerOnClick = (e) => {
    router.push(`/events/${props.event._id}/register`);
    e.stopPropagation();
  };

  return (
    <div
      className="mx-18 mb-2 flex flex-col rounded-xl border-2 bg-white px-6 py-3"
      onClick={open}
    >
      <div className="flex justify-between">
        <div className="flex justify-start">
          <DateDisplayComponent date={props.event.date} color={"Primary"} />
          <div className="flex-column flex text-xl">
            <Label class="text-xl font-bold">{props.event.title}</Label>
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
                <button
                  className="mx-1"
                  onClick={(e) => {
                    props.functions.onEditClicked(props.event);
                    e.stopPropagation();
                  }}
                >
                  <PencilIcon className="h-8 text-primaryColor" />
                </button>
              </Tooltip>
              <Tooltip content="Delete" style="light">
                <button
                  className="mx-1"
                  onClick={(e) => {
                    props.functions.onDeleteClicked(props.event);
                    e.stopPropagation();
                  }}
                >
                  <TrashIcon className="h-8 text-primaryColor" />
                </button>
              </Tooltip>
              <Tooltip content="Manage Attendance" style="light">
                <button className="mx-1" onClick={manageAttendanceOnClick}>
                  <UsersIcon className="h-8 text-primaryColor" />
                </button>
              </Tooltip>
            </div>
          )}
          {props.user.role === "volunteer" && (
            <>
              {props.event.volunteers.includes(props.user._id) ? (
                <button className="mx-1 flex" onClick={registerOnClick}>
                  <CheckCircleIcon className="h-8 text-primaryColor" />
                  <span>Registered!</span>
                </button>
              ) : (
                <button className="mx-1 flex" onClick={registerOnClick}>
                  <PlusCircleIcon className="h-8 text-primaryColor" />
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
        <div>
          <div className="flex">
            <Label class="text-md mr-1 font-bold">Address: </Label>
            <p>{props.event.address}</p>
          </div>
          <div className="flex">
            <Label class="text-md mr-1 font-bold">Description: </Label>
            {props.event.description}
          </div>
          <Button class="black-600 text-xl" href={`events/${props.event._id}`}>
            <p>More Information</p>
          </Button>
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
};

export default EventCard;
