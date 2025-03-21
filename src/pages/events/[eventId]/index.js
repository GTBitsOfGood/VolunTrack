import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import BoGButton from "../../../components/BoGButton";
import EventUnregisterModal from "../../../components/EventUnregisterModal";
import Text from "../../../components/Text";
import { RequestContext } from "../../../providers/RequestProvider";
import { getEvent } from "../../../queries/events";
import { getRegistrations } from "../../../queries/registrations";
import { QRCodeCanvas } from "qrcode.react";
import { Modal } from "flowbite-react";

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
  const [showQRCode, setShowQRCode] = useState(false);

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

  const onUnregisterClicked = () => {
    setUnregisterModal(true);
  };

  const toggleUnregisterModal = () => {
    setUnregisterModal((prev) => !prev);

    onRefresh();
  };

  const toggleQRCode = () => {
    setShowQRCode((prev) => !prev);

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
      <div className="flex flex-col pb-16 pt-8">
        <Text
          className="mb-4 ml-16"
          href={`/events`}
          onClick={() => goBackToCal()}
          text="← Back to home"
        />
        <div className="flex flex-col md:flex-row">
          <div className="ml-4 mr-4 flex-1">
            <div className="flex flex-col md:ml-12 md:mr-4">
              <h1 className="mb-1 text-4xl font-bold text-black">
                {event.eventParent.title}
              </h1>
              <div className="flex flex-col md:flex-row">
                <p className="mb-0 font-semibold md:mb-4 md:mr-3">
                  {" "}
                  {event.eventParent.maxVolunteers - regCount} Slots Remaining
                </p>
                <p className="font-extralight">{lastUpdated}</p>
              </div>
            </div>
          </div>
          <div className="ml-4 mr-4 flex-1">
            <div className="flex flex-col md:flex-row">
              {user.role === "admin" && (
                <>
                  <BoGButton
                    className="mb-2 w-full bg-primaryColor hover:bg-hoverColor md:mb-4 md:mr-2 md:w-auto"
                    text="Manage Attendance"
                    onClick={routeToRegisteredVolunteers}
                  />
                  <BoGButton
                    className="mb-2 w-full bg-primaryColor hover:bg-hoverColor md:mb-4 md:ml-2 md:mr-2 md:w-auto"
                    text="Participation Statistics"
                    onClick={routeToStats}
                  />
                  <BoGButton
                    className="mb-2 w-full bg-primaryColor hover:bg-hoverColor md:mb-4 md:ml-2 md:mr-2 md:w-auto"
                    text="Check In QR Code"
                    onClick={toggleQRCode}
                  />
                </>
              )}
              {user.role === "volunteer" && (
                // It should only ever display one of the following buttons
                <div className="mb-4 w-full md:mb-4 md:w-auto">
                  {event.eventParent.maxVolunteers - regCount > 0 &&
                    !isRegistered &&
                    futureorTodaysDate && (
                      <BoGButton
                        className="w-full bg-primaryColor hover:bg-hoverColor"
                        text="Register"
                        onClick={() => onRegisterClicked(event)}
                      />
                    )}
                  {event.eventParent.maxVolunteers - regCount <= 0 &&
                    !isRegistered &&
                    futureorTodaysDate && (
                      <BoGButton
                        className="w-full bg-primaryColor hover:bg-hoverColor"
                        disabled={true}
                        text="Registration Closed"
                        onClick={null}
                      />
                    )}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row">
          <div className="mb-4 ml-4 mr-4 flex-1">
            <div className="flex flex-col md:ml-12 md:mr-4">
              <div className="text-lg">
                {event.eventParent.isValidForCourtHours && (
                  <span className="font-bold">
                    {"This event can count toward court required hours"}
                  </span>
                )}
              </div>
              <div className="text-lg">
                {" "}
                <div
                  dangerouslySetInnerHTML={{
                    __html: event.eventParent.description,
                  }}
                />
              </div>
            </div>
          </div>
          <div className="ml-4 mr-4 flex-1 md:-mt-4">
            <div className="mb-12 flex w-full flex-col md:mr-auto">
              <h1 className="text-2xl font-bold">Event Information</h1>
              <div className="flex flex-col md:flex-row">
                <div className="flex flex-col bg-grey md:w-80">
                  <p className="m-4 text-base">
                    <b>Date:</b>
                    <br></br>
                    {event.date.slice(0, 10)}
                  </p>
                  <p className="m-4 text-base">
                    <b>Event Contact:</b>
                    <br></br>
                    {event.eventParent.eventContactPhone}
                    <br></br>
                    {event.eventParent.eventContactEmail}
                  </p>
                </div>
                <div className="flex w-full flex-col bg-grey md:w-64">
                  <p className="m-4 text-base">
                    <b>Time:</b>
                    <br></br>
                    {convertTime(event.eventParent.startTime)} -{" "}
                    {convertTime(event.eventParent.endTime)}{" "}
                    {event.eventParent.localTime}
                  </p>
                  <p className="m-4 text-base">
                    <b>Location:</b>
                    <br></br>
                    {event.eventParent.address}
                    <br></br>
                    {event.eventParent.city}, {event.eventParent.state}
                    <br></br>
                    {event.eventParent.zip}
                    <br></br>
                  </p>
                </div>
              </div>
              {user.role === "admin" && showQRCode === true && (
                <Modal
                  dismissible
                  size="2xl"
                  show={showQRCode}
                  onClose={() => setShowQRCode(false)}
                >
                  <Modal.Header className="!pb-2">
                    <Text
                      className="mb-2"
                      type="header"
                      text="Day of Check In"
                    ></Text>
                    <Text
                      type="subtitle"
                      text="Volunteers can scan the QR code below to quickly check in to the event. Even if they don't have an account!"
                    ></Text>
                  </Modal.Header>
                  <Modal.Body className="flex justify-center">
                    <QRCodeCanvas
                      size={400}
                      value={window.location.href + "/day-of-check-in"}
                    />
                  </Modal.Body>
                </Modal>
              )}
            </div>
            {event.eventParent.orgName !== "" && (
              <div className="flex w-full flex-col md:mr-auto">
                <h1 className="text-2xl font-bold">Organization</h1>
                <div className="mb-4 flex flex-col md:flex-row">
                  <div className="flex flex-col bg-grey md:w-80">
                    <p className="m-4 text-base">
                      <b>Point of Contact Name</b>
                      <br></br>
                      {event.eventParent.pocName}
                    </p>
                    <p className="m-4 text-base">
                      <b>Point of Contact Email</b>
                      <br></br>
                      {event.eventParent.pocEmail}
                    </p>
                    <p className="m-4 text-base">
                      <b>Point of Contact Phone</b>
                      <br></br>
                      {event.eventParent.pocPhone}
                    </p>
                  </div>
                  <div className="flex flex-col bg-grey md:w-64">
                    <p className="font-base m-4">
                      <b>Organization Name</b>
                      <br></br>
                      {event.eventParent.orgName}
                    </p>
                    <p className="font-base m-4">
                      <b>Location</b>
                      <br></br>
                      {event.eventParent.orgAddress}
                      <br></br>
                      {event.eventParent.orgCity}, {event.eventParent.orgState}
                      <br></br>
                      {event.eventParent.orgZip}
                    </p>
                  </div>
                </div>
                {user.role === "admin" && (
                  <div className="flex flex-col bg-white pb-6 md:w-64">
                    <BoGButton
                      text="Share Private Event Link"
                      onClick={copyPrivateLink}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <EventUnregisterModal
          open={showUnregisterModal}
          toggle={toggleUnregisterModal}
          eventData={event}
          userId={user._id}
        />
      </div>
    </>
  );
};

export default EventInfo;
