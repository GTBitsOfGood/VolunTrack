import { ErrorMessage, Field } from "formik";
import PropTypes from "prop-types";
import { Label, Progress } from "flowbite-react";
import "flowbite-react";
import { useState } from "react";
import { getHours } from "../screens/Stats/User/hourParsing";

const Event = (props) => {
  let level = "Bronze";
  let num = 0;
  let outOf = 1;

  //   if (props.type == "Events") {
  //     if (props.attendance.length > 1) {
  //       level = "Silver";
  //       outOf = 3;
  //     } else if (props.attendance.length > 3) {
  //       level = "Gold";
  //       outOf = 5;
  //     }
  //     num = props.attendance.length;
  //   } else {
  //     let add = 0;
  //     outOf = 10;
  //     for (let i = 0; i < props.attendance.length; i++) {
  //       if (props.attendance[i].timeCheckedOut != null) {
  //         add += getHours(
  //           props.attendance[i].timeCheckedIn.slice(11, 16),
  //           props.attendance[i].timeCheckedOut.slice(11, 16)
  //         );
  //       }
  //     }
  //     if (add >= 15) {
  //       level = "Gold";
  //       outOf = 20;
  //     } else if (add >= 10) {
  //       level = "Silver";
  //       outOf = 15;
  //     }
  //     num = Math.round(add * 10) / 10;
  //   }

  return (
    <div className="border-2 rounded-md mr-8 ml-18 px-10 py-4 bg-white">
      {/* <Label class="text-black-800 text-xl font-semibold">{props.header}</Label>
      <div className="flex flex-nowrap items-end">
        <img src={"/images/Hours Earned - " + level + ".png"}></img>
        <div className="flex flex-nowrap font-semibold items-center">
          <p className="pl-12 text-2xl">{num}</p>
          <p className="pl-2 text-md font-semibold text-slate-600">/ {outOf}</p>
          <p className="pl-2 text-md font-semibold text-slate-600">
            {props.type}
          </p>
        </div>
      </div>
      <div className="mt-4 w-full h-2.5 dark:bg-slate-300 rounded-full">
        <div
          className={`bg-green-600 h-2.5 rounded-full w-[${
            (num * 100) / outOf
          }%]`}
        ></div>
      </div>
      <Progress progress={45} /> */}
    </div>
  );
};

Event.propTypes = {
  event: PropTypes.object.isRequired,
  role: PropTypes.object.isRequired,
  isHomePage: PropTypes.bool.isRequired,
};

export default Event;

{
  /* <Styled.EventContainer key={event._id}>
              <Styled.EventGrid>
                <DateDisplayComponent date={event.date} color={"Primary"} />
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
