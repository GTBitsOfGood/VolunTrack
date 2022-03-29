import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import { Button } from "reactstrap";
import { fetchEventsById } from "../../../actions/queries";
import variables from "../../../design-tokens/_variables.module.scss";
import { useSession } from "next-auth/react";

const Styled = {
  Button: styled(Button)`
    background-color: ${variables["primary"]};
    color: white;
    margin-bottom: 2rem;
    margin-left: 4rem;
    margin-right: 4rem;
    font-size: 20px;
    position: fixed;
    bottom: 0;
    width: 90%;
  `,
  EventTable: styled.div`
    display: flex;
    flex-direction: row;
    padding-top: 2rem;
    padding-bottom: 4rem;
    background-color: ${variables["gray-100"]};
    height: 100vh;
  `,
  EventCol: styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 3rem;
    margin-right: 1rem;
  `,
  EventCol2: styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 1rem;
    margin-right: 3rem;
  `,
  EventName: styled.h1`
    color: black;
    font-weight: bold;
    margin-bottom: 4px;
    font-size: 40px;
  `,
  EventSubhead: styled.div`
    display: flex;
    flex-direction: row;
  `,
  Slots: styled.p`
    font-weight: 600;
    margin-right: 20px;
  `,
  Date: styled.p`
    font-weight: 200;
  `,
  Info: styled.p`
    font-size: 18px;
  `,
  InfoHead: styled.h1`
    font-size: 25px;
    font-weight: bold;
  `,
  InfoTable: styled.div`
    display: flex;
    flex-direction: row;
  `,
  InfoTableCol: styled.div`
    display: flex;
    flex-direction: column;
    background-color: white;
    width: 200px;
  `,
  InfoTableText: styled.p`
    font-size: 16px;
    margin: 20px;
  `,
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

const EventInfo = () => {
  const router = useRouter();
  const { eventId } = router.query;
  const [event, setEvent] = useState([]);

  const { data: session } = useSession();
  const user = session.user;

  const onRefresh = () => {
    fetchEventsById(eventId).then((result) => {
      setEvent(result.data.event);
    });
  };

  useEffect(() => {
    onRefresh();
  }, []);

  if (!event || !event.date) {
    return <div />;
  }

  const onRegisterClicked = () => {
    router.replace("/register");
  };

  return (
    <>
      <Styled.EventTable>
        <Styled.EventCol>
          <Styled.EventName>{event.title}</Styled.EventName>
          <Styled.EventSubhead>
            <Styled.Slots>
              {" "}
              {event.max_volunteers - event.volunteers.length} Slots Remaining
            </Styled.Slots>
            <Styled.Date>
              Updated {event.updatedAt.slice(0, 10)} @{" "}
              {convertTime(event.updatedAt.slice(11, 16))}
            </Styled.Date>
          </Styled.EventSubhead>
          <Styled.Info>{event.description}</Styled.Info>
        </Styled.EventCol>
        <Styled.EventCol2 style={{ "margin-left": "auto" }}>
          <Styled.InfoHead>Event Information</Styled.InfoHead>
          <Styled.InfoTable>
            <Styled.InfoTableCol>
              <Styled.InfoTableText>
                <b>Date:</b>
                <br></br>
                {event.date.slice(0, 10)}
              </Styled.InfoTableText>
              <Styled.InfoTableText>
                <b>Contact:</b>
                <br></br>
                Phone
                <br></br>
                Email
              </Styled.InfoTableText>
            </Styled.InfoTableCol>

            <Styled.InfoTableCol>
              <Styled.InfoTableText>
                <b>Time:</b>
                <br></br>
                {convertTime(event.startTime)} - {convertTime(event.endTime)}
              </Styled.InfoTableText>
              <Styled.InfoTableText>
                <b>Location:</b>
                <br></br>
                {event.address}
                <br></br>
              </Styled.InfoTableText>
            </Styled.InfoTableCol>
          </Styled.InfoTable>
        </Styled.EventCol2>
      </Styled.EventTable>
      {user.role == "volunteer" &&
        event.max_volunteers - event.volunteers.length != 0 && (
          <Styled.Button onClick={() => onRegisterClicked(event)}>
            Register
          </Styled.Button>
        )}
    </>
  );
};

export default EventInfo;
