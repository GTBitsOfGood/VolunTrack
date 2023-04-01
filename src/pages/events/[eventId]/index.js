import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { Col, Row } from "reactstrap";
import styled from "styled-components";
import BoGButton from "../../../components/BoGButton";
import EventUnregisterModal from "../../../components/EventUnregisterModal";
import Text from "../../../components/Text";
import variables from "../../../design-tokens/_variables.module.scss";
import BasicModal from "../../../components/BasicModal";
import { RequestContext } from "../../../providers/RequestProvider";
import { getEvent } from "../../../queries/events";
import { getRegistrations } from "../../../queries/registrations";

const Styled = {
  EventTableAll: styled.div`
    display: flex;
    flex-direction: column;
    padding-top: 2rem;
    padding-bottom: 4rem;
  `,
  EventTable: styled.div`
    display: flex;
    flex-direction: row;
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
  let [event, setEvent] = useState([]);

  const { data: session } = useSession();
  const user = session.user;
  const context = useContext(RequestContext);
  const [registrations, setRegistrations] = useState([]);
  const [regCount, setRegCount] = useState(0);

  const [showUnregisterModal, setUnregisterModal] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const onRefresh = () => {
    getEvent(eventId).then((result) => {
      setEvent(result.data.event);
    });
    getRegistrations({ eventId }).then((result) => {
      setRegistrations(result.data.registrations);
      let count = 0;
      result.data.registrations.map((reg) => {
        count += 1 + reg.minors.length;
        if (user.role === "volunteer" && reg.userId === user._id)
          setIsRegistered(true);
      });
      setRegCount(count);
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

  const openUnregisterModal = () => {
    setUnregisterModal(true);
  };

  const toggleUnregisterModal = () => {
    setUnregisterModal((prev) => !prev);

    onRefresh();
  };

  const onUnregisterClicked = async (event) => {
    const changedEvent = {
      // remove current user id from event volunteers
      ...event,
      volunteers: event.volunteers.filter((volunteer) => volunteer !== user._id),
    };
    await updateEvent(changedEvent);
  };

  const onConfirmUnregisterModal = () => {
    onUnregisterClicked(event)
      .then(() => {
        toggleUnregisterModal();
      })
      .catch(console.log);
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
        <Text
          className="mb-4 ml-16"
          href={`/events`}
          onClick={() => goBackToCal()}
          text="← Back to home"
        />
        <Styled.EventTable>
          <Col>
            <Styled.EventCol>
              <Styled.EventName>{event.eventParent.title}</Styled.EventName>
              <Styled.EventSubhead>
                <Styled.Slots>
                  {" "}
                  {event.eventParent.maxVolunteers - regCount} Slots Remaining
                </Styled.Slots>
                <Styled.Date>{lastUpdated}</Styled.Date>
              </Styled.EventSubhead>
              <Styled.Info>
                {event.eventParent.isValidForCourtHours && (
                  <span style={{ fontWeight: "bold" }}>
                    {"This event can count toward court required hours"}
                  </span>
                )}
              </Styled.Info>
              <Styled.Info>
                {" "}
                <div
                  dangerouslySetInnerHTML={{
                    __html: event.eventParent.description,
                  }}
                />
              </Styled.Info>
            </Styled.EventCol>
          </Col>
          <Col>
            <Row>
              {user.role === "admin" && (
                <>
                  <div className="mb-4 ml-3 mr-4">
                    <BoGButton
                      text="Manage Attendance"
                      onClick={routeToRegisteredVolunteers}
                    />
                  </div>
                  <div className="mb-4 ml-4 mr-3">
                    <BoGButton
                      text="View Participation Statistics"
                      onClick={routeToStats}
                    />
                  </div>
                </>
              )}
              {/*It should only ever display one of the following buttons*/}
              {user.role === "volunteer" &&
                isRegistered &&
                futureorTodaysDate && (
                  <BoGButton
                    text="Unregister"
                    onClick={() => openUnregisterModal(event)}
                  />
                )}
              {user.role === "volunteer" &&
                event.eventParent.maxVolunteers - regCount > 0 &&
                !isRegistered &&
                futureorTodaysDate && (
                  <BoGButton
                    text="Register"
                    onClick={() => onRegisterClicked(event)}
                  />
                )}
              {user.role === "volunteer" &&
                event.eventParent.maxVolunteers - regCount <= 0 &&
                !isRegistered &&
                futureorTodaysDate && (
                  <BoGButton
                    disabled={true}
                    text="Registration Closed"
                    onClick={null}
                  />
                )}
            </Row>
            <Row>
              <Styled.EventCol2 style={{ "margin-right": "auto" }}>
                <Styled.InfoHead>Event Information</Styled.InfoHead>
                <Styled.InfoTable>
                  <Styled.InfoTableCol className="bg-grey">
                    <Styled.InfoTableText>
                      <b>Date:</b>
                      <br></br>
                      {event.date.slice(0, 10)}
                    </Styled.InfoTableText>
                    <Styled.InfoTableText>
                      <b>Event Contact:</b>
                      <br></br>
                      {event.eventParent.eventContactPhone}
                      <br></br>
                      {event.eventParent.eventContactEmail}
                    </Styled.InfoTableText>
                  </Styled.InfoTableCol>
                  <Styled.InfoTableCol className="bg-grey">
                    <Styled.InfoTableText>
                      <b>Time:</b>
                      <br></br>
                      {convertTime(event.eventParent.startTime)} -{" "}
                      {convertTime(event.eventParent.endTime)}{" "}
                      {event.eventParent.localTime}
                    </Styled.InfoTableText>
                    <Styled.InfoTableText>
                      <b>Location:</b>
                      <br></br>
                      {event.eventParent.address}
                      <br></br>
                      {event.eventParent.city}, {event.eventParent.state}
                      <br></br>
                      {event.eventParent.zip}
                      <br></br>
                    </Styled.InfoTableText>
                  </Styled.InfoTableCol>
                </Styled.InfoTable>
              </Styled.EventCol2>
            </Row>
            <br></br>
            <br></br>
            {event.eventParent.orgName !== "" && (
              <Row>
                <Styled.EventCol2>
                  <Styled.InfoHead>Organization</Styled.InfoHead>
                  <Styled.InfoTable>
                    <Styled.InfoTableCol>
                      <Styled.InfoTableText>
                        <b>Point of Contact Name</b>
                        <br></br>
                        {event.eventParent.pocName}
                      </Styled.InfoTableText>
                      <Styled.InfoTableText>
                        <b>Point of Contact Email</b>
                        <br></br>
                        {event.eventParent.pocEmail}
                      </Styled.InfoTableText>
                      <Styled.InfoTableText>
                        <b>Point of Contact Phone</b>
                        <br></br>
                        {event.eventParent.pocPhone}
                      </Styled.InfoTableText>
                    </Styled.InfoTableCol>
                    <Styled.InfoTableCol>
                      <Styled.InfoTableText>
                        <b>Organization Name</b>
                        <br></br>
                        {event.eventParent.orgName}
                      </Styled.InfoTableText>
                      <Styled.InfoTableText>
                        <b>Location</b>
                        <br></br>
                        {event.eventParent.orgAddress}
                        <br></br>
                        {event.eventParent.orgCity},{" "}
                        {event.eventParent.orgState}
                        <br></br>
                        {event.eventParent.orgZip}
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
        <BasicModal 
          open={showUnregisterModal}
          title={"Are you sure you want to cancel your registration for this event?"}
          onConfirm={onConfirmUnregisterModal}
          onCancel={toggleUnregisterModal}
          confirmText={"Yes, cancel it"}
          cancelText={"No, keep it"}
        />
      </Styled.EventTableAll>
    </>
  );
};

export default EventInfo;
