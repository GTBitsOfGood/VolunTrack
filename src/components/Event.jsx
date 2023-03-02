import PropTypes from "prop-types";
import { Label, Button } from "flowbite-react";
import "flowbite-react";
import DateDisplayComponent from "../components/DateDisplay";
import { useState } from "react";
import ManageAttendanceButton from "../screens/Events/Admin/ManageAttendanceButton";

const Event = (props) => {
  const [collapse, setCollapse] = useState(false);

  const open = () => {
    setCollapse(!collapse);
  };

  return (
    <div className="border-2 rounded-xl mx-18 mb-2 px-10 py-4 bg-white flex flex-col">
      <div className="mb-4 flex justify-between">
        <div className="flex justify-start">
          <DateDisplayComponent date={props.eventObj.date} color={"Primary"} />
          <Button class="text-xl" onClick={open}>
            <div>
              <Label class="text-xl font-bold">{props.eventObj.title}</Label>
              {Date.parse(new Date(new Date().setHours(0, 0, 0, 0))) -
                14400000 ===
                Date.parse(props.eventObj.date) &&
                props.role === "admin" && (
                  <ManageAttendanceButton eventId={props.eventObj._id} />
                )}
            </div>
          </Button>
        </div>
        <div className="flex justify-end">
          {props.role === "admin" && (
            <Button
              class="border-2 rounded-lg h-12 mr-3"
              onClick={(e) => {
                e.stopPropagation();
                props.functions.onEditClicked(props.eventObj);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
            </Button>
          )}
          {props.role === "admin" && (
            <Button
              class="border-2 rounded-lg h-12"
              onClick={(e) => {
                e.stopPropagation();
                props.functions.onDeleteClicked(props.eventObj);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </Button>
          )}
        </div>
        {props.role === "volunteer" && (
          <>
            {props.eventObj.volunteers.includes(props.user._id) ? (
              <>
                <div>
                  <p>Registered!</p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="green"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 ml-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </>
            ) : (
              <>
                <Button
                  class="border-2 rounded-lg h-12"
                  onClick={() => {
                    console.log("hi");
                    props.onRegisterClicked(props.eventObj);
                  }}
                >
                  Register
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 ml-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </Button>
              </>
            )}
          </>
        )}
      </div>
      <div className="flex justify-between">
        <Label>{`${props.functions.convertTime(
          props.eventObj.startTime
        )} - ${props.functions.convertTime(
          props.eventObj.endTime
        )} EST`}</Label>
        <Label>
          {props.eventObj.max_volunteers - props.eventObj.volunteers.length}{" "}
          slots available
        </Label>
      </div>
      {collapse && (
        <div>
          <p>hi</p>
          <Button class="text-xl text-black-600" href={`events/${props.eventObj._id}`}> 
            More Information
          </Button>
        </div>
      )}
    </div>
  );
};

Event.propTypes = {
  key: PropTypes.object.isRequired,
  eventObj: PropTypes.object.isRequired,
  role: PropTypes.object.isRequired,
  isHomePage: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
  functions: PropTypes.object.isRequired,
  onRegisterClicked: PropTypes.func.isRequired,
};

export default Event;
