import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { Col, Row } from "reactstrap";
import BoGButton from "../../../components/BoGButton";
import { fetchEventsById } from "../../../actions/queries";
import { RequestContext } from "../../../providers/RequestProvider";
import Text from "../../../components/Text";
import BasicModal from "../../../components/BasicModal";
import { updateEvent } from "../../../screens/Events/eventHelpers";

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
      volunteers: event.volunteers.filter(
        (volunteer) => volunteer !== user._id
      ),
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
      <div className="flex flex-col bg-gray-100 pb-16 pt-8">
        <Text
          className="ml-16 mb-4"
          href={`/events`}
          onClick={() => goBackToCal()}
          text="< Back to home"
        />
        <Styled.EventTable>
          <Col>
            <div className="ml-6 mr-2 flex flex-col">
              <div className="mb-1 text-4xl font-bold text-black">
                {event.title}
              </div>
              <div className="flex flex-row">
                <p className="mr-5 font-semibold">
                  {" "}
                  {event.max_volunteers - event.volunteers.length} Slots
                  Remaining
                </p>
                <p className="font-extralight">{lastUpdated}</p>
              </div>
              <p className="text-lg">
                {event.isValidForCourtHours && (
                  <span style={{ fontWeight: "bold" }}>
                    {"This event can count toward court required hours"}
                  </span>
                )}
              </p>
              <p className="text-lg">
                {" "}
                <div dangerouslySetInnerHTML={{ __html: event.description }} />
              </p>
            </div>
          </Col>
          <Col>
            <Row>
              {user.role === "admin" && (
                <>
                  <div className="mr-4 mb-4 ml-3">
                    <BoGButton
                      text="Manage Attendance"
                      onClick={routeToRegisteredVolunteers}
                    />
                  </div>
                  <div className="mr-3 mb-4 ml-4">
                    <BoGButton
                      text="View Participation Statistics"
                      onClick={routeToStats}
                    />
                  </div>
                </>
              )}
              {user.role === "volunteer" &&
                event.volunteers.includes(user._id) &&
                futureorTodaysDate && (
                  <BoGButton
                    text="Unregister"
                    onClick={() => openUnregisterModal(event)}
                  />
                )}
            </Row>
            <Row>
              <div className="ml-4 mr-auto flex flex-col">
                <h1 className="text-2xl font-bold">Event Information</h1>
                <div className="flex flex-row">
                  <div className="flex w-5 flex-col bg-white">
                    <p className="m-5 text-base">
                      <b>Date:</b>
                      <br></br>
                      {event.date.slice(0, 10)}
                    </p>
                    <p className="m-5 text-base">
                      <b>Event Contact:</b>
                      <br></br>
                      {event.eventContactPhone}
                      <br></br>
                      {event.eventContactEmail}
                    </p>
                  </div>
                  <div className="flex w-5 flex-col bg-white">
                    <p className="m-5 text-base">
                      <b>Time:</b>
                      <br></br>
                      {convertTime(event.startTime)} -{" "}
                      {convertTime(event.endTime)} {event.localTime}
                    </p>
                    <p className="m-5 text-base">
                      <b>Location:</b>
                      <br></br>
                      {event.address}
                      <br></br>
                      {event.city}, {event.state}
                      <br></br>
                      {event.zip}
                      <br></br>
                    </p>
                  </div>
                </div>
              </div>
            </Row>
            <br></br>
            <br></br>
            {event.orgName !== "" && (
              <Row>
                <div className="ml-4 flex flex-col">
                  <h1 className="text-2xl font-bold">Organization</h1>
                  <div className="flex flex-row">
                    <div className="flex w-5 flex-col bg-white">
                      <p className="m-5 text-base">
                        <b>Point of Contact Name</b>
                        <br></br>
                        {event.pocName}
                      </p>
                      <p className="m-5 text-base">
                        <b>Point of Contact Email</b>
                        <br></br>
                        {event.pocEmail}
                      </p>
                      <p className="m-5 text-base">
                        <b>Point of Contact Phone</b>
                        <br></br>
                        {event.pocPhone}
                      </p>
                    </div>
                    <div className="flex w-5 flex-col bg-white">
                      <p className="m-5 text-base">
                        <b>Organization Name</b>
                        <br></br>
                        {event.orgName}
                      </p>
                      <p className="m-5 text-base">
                        <b>Location</b>
                        <br></br>
                        {event.orgAddress}
                        <br></br>
                        {event.orgCity}, {event.orgState}
                        <br></br>
                        {event.orgZip}
                      </p>
                    </div>
                  </div>
                  {user.role === "volunteer" && (
                    <div className="flex flex-col bg-white pb-6">
                      <BoGButton
                        text="Share Private Event Link"
                        onClick={copyPrivateLink}
                      />
                    </div>
                  )}
                </div>
              </Row>
            )}
          </Col>
        </div>
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
        <BasicModal
          open={showUnregisterModal}
          title={
            "Are you sure you want to cancel your registration for this event?"
          }
          onConfirm={onConfirmUnregisterModal}
          onCancel={toggleUnregisterModal}
          confirmText={"Yes, cancel it"}
          cancelText={"No, keep it"}
        />
      </div>
    </>
  );
};

export default EventInfo;
