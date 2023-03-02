import { ErrorMessage, Field } from "formik";
import PropTypes from "prop-types";
import { Label, Button, Time } from "flowbite-react";
import "flowbite-react";
import { useState } from "react";
import { getHours } from "../screens/Stats/User/hourParsing";
import DateDisplayComponent from "../components/DateDisplay";
import Link from "next/link";
import ManageAttendanceButton from "../screens/Events/Admin/ManageAttendanceButton";

const Event = (props) => {
  let level = "Bronze";
  let num = 0;
  let outOf = 1;
  let event = props.eventObj;

  return (
    <div className="border-2 rounded-xl mr-18 ml-18 px-10 py-4 bg-white">
      <div className="flex">
        <DateDisplayComponent date={props.eventObj.date} color={"Primary"} />
        <Link href={`events/${props.eventObj._id}`}>
          <div>
            <Label class="text-xl font-bold">{event.title}</Label>
            <div className="mx-10 flex justify-end">
              {props.role === "admin" && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    props.functions.onEditClicked(event);
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
                  onClick={(e) => {
                    e.stopPropagation();
                    props.functions.onDeleteClicked(event);
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
              {props.role === "volunteer" && (
                <>
                  {event.volunteers.includes(props.user._id) ? (
                    <>
                      <div>
                        <p>Registered!</p>
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
                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    </>
                  ) : (
                    <>
                      <Button
                        class="rounded-lg border-2"
                        onClick={() => props.functions.onRegisterClicked(event)}
                      >
                        <p>Register</p>
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
              <Label>{`${props.functions.convertTime(
                event.startTime
              )} - ${props.functions.convertTime(event.endTime)} EST`}</Label>
            </div>
          </div>
        </Link>
        {Date.parse(new Date(new Date().setHours(0, 0, 0, 0))) - 14400000 ===
          Date.parse(event.date) &&
          props.role === "admin" && (
            <ManageAttendanceButton eventId={event._id} />
          )}
      </div>
    </div>
  );
};

Event.propTypes = {
  key: PropTypes.object.isRequired,
  eventObj: PropTypes.object.isRequired,
  role: PropTypes.object.isRequired,
  isHomePage: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
  onRegisterClicked: PropTypes.func.isRequired,
  functions: PropTypes.object.isRequired,
};

export default Event;

{
  /* <Styled.EventContainer key={event._id}>
              <Styled.EventGrid>
                
                <Link href={`events/${event._id}`}>
                  <Styled.EventContent>
                    <Styled.EventContentRow>
                      <Styled.EventTitle>{event.title}</Styled.EventTitle>
                      {role === "admin" && (
                        <Styled.EditButton
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditClicked(event);
                          }}
                        >
                          <Icon color="grey3" name="create" />
                        </Styled.EditButton>
                      )}
                      {role === "admin" && (
                        <Styled.DeleteButton
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteClicked(event);
                          }}
                        >
                          <Icon color="grey3" name="delete" />
                        </Styled.DeleteButton>
                      )}
                      {role === "volunteer" && (
                        <>
                          {event.volunteers.includes(user._id) ? (
                            <>
                              <Styled.EventSpace>
                                <Icon name="check" viewBox={"0 0 96 96"} />
                                <span>Registered!</span>
                              </Styled.EventSpace>
                            </>
                          ) : (
                            <>
                              <Styled.Button
                                onClick={() => onRegisterClicked(event)}
                              >
                                <Icon color="grey3" name="add" />
                                <span>Register</span>
                              </Styled.Button>
                            </>
                          )}
                        </>
                      )}
                    </Styled.EventContentRow>
                    <Styled.EventContentRow>
                      <Styled.Time>{`${convertTime(
                        event.startTime
                      )} - ${convertTime(event.endTime)} EST`}</Styled.Time>
                      <Styled.EventSlots>
                        {event.max_volunteers - event.volunteers.length} slots
                        available
                      </Styled.EventSlots>
                    </Styled.EventContentRow>
                  </Styled.EventContent>
                </Link>
                {Date.parse(new Date(new Date().setHours(0, 0, 0, 0))) -
                  14400000 ===
                  Date.parse(event.date) &&
                  role === "admin" && (
                    <ManageAttendanceButton eventId={event._id} />
                  )}
              </Styled.EventGrid>
            </Styled.EventContainer> */
}
