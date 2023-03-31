import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { Col, Row } from "reactstrap";
import styled from "styled-components";
import BoGButton from "../../../components/BoGButton";
import EventUnregisterModal from "../../../components/EventUnregisterModal";
import variables from "../../../design-tokens/_variables.module.scss";
import { RequestContext } from "../../../providers/RequestProvider";
import { getEvent } from "../../../queries/events";

const Styled = {
  EventTableAll: styled.div`
    display: flex;
    flex-direction: column;
    background-color: ${variables["gray-100"]};
    padding-top: 2rem;
    padding-bottom: 4rem;
  `,
  EventTable: styled.div`
    display: flex;
    flex-direction: row;
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
    width: 250px;
  `,
  InfoTableText: styled.p`
    font-size: 16px;
    margin: 20px;
  `,
  ButtonCol: styled.div`
    display: flex;
    flex-direction: column;
    background-color: white;
    padding-bottom: 1.5rem;
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
  const context = useContext(RequestContext);

  const [showUnregisterModal, setUnregisterModal] = useState(false);

  const onRefresh = () => {
    getEvent(eventId).then((result) => {
      setEvent(result.data.event);
    });
  };

  useEffect(() => {
    onRefresh();
  }, []);

  if (!event || !event.date) {
    return <div />;
  }

  const goBackToCal = () => {
    router.replace(`/events`);
  };

  const onRegisterClicked = () => {
    router.replace(`${eventId}/register`);
  };

  const routeToRegisteredVolunteers = () => {
    router.push(`${eventId}/attendance`);
  };

  const routeToStats = () => {
    router.push(`${eventId}/statistics`);
  };

  const onUnregisterClicked = () => {
    setUnregisterModal(true);
  };

  const toggleUnregisterModal = () => {
    setUnregisterModal((prev) => !prev);

    onRefresh();
  };

  const copyPrivateLink = () => {
    window.navigator.clipboard.writeText(window.location.href);
    context.startLoading();
    context.success("Successfully copied the event private link!");
  };
  let lastUpdated =
    "Last updated " +
    new Date(Date.parse(event.updatedAt)).toLocaleString().replace(",", " at");
  lastUpdated =
    lastUpdated.substring(0, lastUpdated.lastIndexOf(":")) +
    lastUpdated.substring(lastUpdated.lastIndexOf(":") + 3);
  const futureorTodaysDate =
    Date.parse(new Date(new Date().setHours(0, 0, 0, 0))) - 86400000 <=
    Date.parse(event.date);

  return (
    <>
      <Styled.EventTableAll>
        <BoGButton text="Back" onClick={() => goBackToCal()} />
        <Styled.EventTable>
          <Col>
            <Styled.EventCol>
              <Styled.EventName>{event.title}</Styled.EventName>
              <Styled.EventSubhead>
                <Styled.Slots>
                  {" "}
                  {event.max_volunteers - event.volunteers.length} Slots
                  Remaining
                </Styled.Slots>
                <Styled.Date>{lastUpdated}</Styled.Date>
              </Styled.EventSubhead>
              <Styled.Info>
                {event.isValidForCourtHours && (
                  <span style={{ fontWeight: "bold" }}>
                    {"This event can count toward court required hours"}
                  </span>
                )}
              </Styled.Info>
              <Styled.Info>
                {" "}
                <div dangerouslySetInnerHTML={{ __html: event.description }} />
              </Styled.Info>
            </Styled.EventCol>
          </Col>
          <Col>
            <Row>
              {user.role === "admin" && (
                <>
                  <BoGButton
                    text="Manage Attendance"
                    onClick={routeToRegisteredVolunteers}
                  />
                  <BoGButton
                    text="View Participation Statistics"
                    onClick={routeToStats}
                  />
                </>
              )}
              {user.role === "volunteer" &&
                event.volunteers.includes(user._id) &&
                futureorTodaysDate && (
                  <BoGButton
                    text="Unregister"
                    onClick={() => onUnregisterClicked(event)}
                  />
                )}
            </Row>
            <Row>
              <Styled.EventCol2 style={{ "margin-right": "auto" }}>
                <Styled.InfoHead>Event Information</Styled.InfoHead>
                <Styled.InfoTable>
                  <Styled.InfoTableCol>
                    <Styled.InfoTableText>
                      <b>Date:</b>
                      <br></br>
                      {event.date.slice(0, 10)}
                    </Styled.InfoTableText>
                    <Styled.InfoTableText>
                      <b>Event Contact:</b>
                      <br></br>
                      {event.eventContactPhone}
                      <br></br>
                      {event.eventContactEmail}
                    </Styled.InfoTableText>
                  </Styled.InfoTableCol>
                  <Styled.InfoTableCol>
                    <Styled.InfoTableText>
                      <b>Time:</b>
                      <br></br>
                      {convertTime(event.startTime)} -{" "}
                      {convertTime(event.endTime)} {event.localTime}
                    </Styled.InfoTableText>
                    <Styled.InfoTableText>
                      <b>Location:</b>
                      <br></br>
                      {event.address}
                      <br></br>
                      {event.city}, {event.state}
                      <br></br>
                      {event.zip}
                      <br></br>
                    </Styled.InfoTableText>
                  </Styled.InfoTableCol>
                </Styled.InfoTable>
              </Styled.EventCol2>
            </Row>
            <br></br>
            <br></br>
            {event.orgName !== "" && (
              <Row>
                <Styled.EventCol2>
                  <Styled.InfoHead>Organization</Styled.InfoHead>
                  <Styled.InfoTable>
                    <Styled.InfoTableCol>
                      <Styled.InfoTableText>
                        <b>Point of Contact Name</b>
                        <br></br>
                        {event.pocName}
                      </Styled.InfoTableText>
                      <Styled.InfoTableText>
                        <b>Point of Contact Email</b>
                        <br></br>
                        {event.pocEmail}
                      </Styled.InfoTableText>
                      <Styled.InfoTableText>
                        <b>Point of Contact Phone</b>
                        <br></br>
                        {event.pocPhone}
                      </Styled.InfoTableText>
                    </Styled.InfoTableCol>
                    <Styled.InfoTableCol>
                      <Styled.InfoTableText>
                        <b>Organization Name</b>
                        <br></br>
                        {event.orgName}
                      </Styled.InfoTableText>
                      <Styled.InfoTableText>
                        <b>Location</b>
                        <br></br>
                        {event.orgAddress}
                        <br></br>
                        {event.orgCity}, {event.orgState}
                        <br></br>
                        {event.orgZip}
                      </Styled.InfoTableText>
                    </Styled.InfoTableCol>
                  </Styled.InfoTable>
                  {user.role === "volunteer" && (
                    <Styled.ButtonCol>
                      <BoGButton
                        text="Share Private Event Link"
                        onClick={copyPrivateLink}
                      />
                    </Styled.ButtonCol>
                  )}
                </Styled.EventCol2>
              </Row>
            )}
          </Col>
        </Styled.EventTable>
        {user.role === "volunteer" &&
          event.max_volunteers - event.volunteers.length !== 0 &&
          !event.volunteers.includes(user._id) &&
          futureorTodaysDate && (
            <BoGButton
              text="Register"
              onClick={() => onRegisterClicked(event)}
            />
          )}
        {user.role === "volunteer" &&
          event.max_volunteers - event.volunteers.length === 0 &&
          !event.volunteers.includes(user._id) &&
          futureorTodaysDate && (
            <BoGButton
              disabled={true}
              text="Registration Closed"
              onClick={null}
            />
          )}
        {user.role === "volunteer" &&
          event.volunteers.includes(user._id) &&
          futureorTodaysDate && (
            <BoGButton
              text="You are registered for this event!"
              disabled={true}
            />
          )}
        <EventUnregisterModal
          open={showUnregisterModal}
          toggle={toggleUnregisterModal}
          eventData={event}
          userId={user._id}
        />
      </Styled.EventTableAll>
    </>
  );
};

export default EventInfo;
