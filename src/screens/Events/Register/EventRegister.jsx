import { TrashIcon } from "@heroicons/react/24/solid";
import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/solid";
import { Tooltip } from "flowbite-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Col, Container, ModalFooter, Row } from "reactstrap";
import styled from "styled-components";
import BoGButton from "../../../components/BoGButton";
import Text from "../../../components/Text";
import variables from "../../../design-tokens/_variables.module.scss";
import { getEvent } from "../../../queries/events";
import {
  getRegistrations,
  registerForEvent,
  unregisterForEvent,
} from "../../../queries/registrations";
import EventMinorModal from "./EventMinorModal";
import EventRegisterInfoContainer from "./EventRegisterInfoContainer";
import EventWaiverModal from "./EventWaiverModal";
import EventTasksContainer from "./EventTasksContainer";

import EventUnregisterModal from "../../../components/EventUnregisterModal";

const Styled = {
  Container: styled(Container)`
    overflow-y: scroll;
    overflow-x: hidden;
    padding-top: 2rem;
  `,
  Row: styled(Row)`
    margin: 0 2rem 0.5rem 2rem;
    display: flex;
    flex-direction: row;
    align-items: center;
  `,
  ModalFooter: styled(ModalFooter)`
    margin: 1rem -1rem 1rem -1rem;
    border: transparent;
  `,
  MainText: styled.p`
    color: ${variables["yiq-text-dark"]};
    font-size: 2rem;
    font-weight: 900;
    text-align: left;
    overflow-wrap: break-word;
  `,
  DetailText: styled.p`
    color: ${variables["gray-400"]};
    font-size: 0.8rem;
    overflow-wrap: break-word;
  `,
  SectionHeaderText: styled.p`
    color: ${variables["yiq-text-dark"]};
    text-align: left;
    font-weight: 900;
    margin-top: 0.8rem;
    overflow-wrap: break-word;
  `,
  VolunteerContainer: styled.div`
    border-radius: 0.5rem;
    margin-bottom: 0.5rem;
    margin-right: 2rem;
    width: 16rem;
  `,
  VolunteerCol: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin: 0;
  `,
  VolunteerRow: styled.div`
    margin: 1rem;
  `,
  CheckGif: styled.img`
    width: 10rem;
    height: 10rem;
  `,
  LoadGif: styled.img`
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 15rem;
    height: 15rem;
    margin-top: -3rem;
  `,
  EventContainer: styled.div`
    background-color: ${variables["white"]};
    border-radius: 0.5rem;
    height: 100%;
    width: 90%;
  `,
  BottomContainer: styled.div`
    margin-left: 1rem;
    margin-top: 2rem;
  `,
};

const EventRegister = () => {
  const {
    data: { user },
  } = useSession();
  const router = useRouter();

  const { eventId } = router.query;

  const [event, setEvent] = useState({});
  const [showMinorModal, setShowMinorModal] = useState(false);
  const [showWaiverModal, setShowWaiverModal] = useState(false);
  const [hasMinor, setHasMinor] = useState(false);
  const [minors, setMinors] = useState([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [registrations, setRegistrations] = useState([]);
  const [regCount, setRegCount] = useState(0);
  const [showUnregisterModal, setShowUnregisterModal] = useState(false);

  useEffect(() => {
    onLoadEvent();
  }, [refreshTrigger]);

  const onLoadEvent = () => {
    getEvent(eventId)
      .then((eventResult) => {
        if (eventResult?.data?.event) {
          setEvent(eventResult.data.event);
        }
        // Fetch user registrations
        return getRegistrations({ eventId, userId: user._id });
      })
      .then((registrationsResult) => {
        if (registrationsResult?.data?.registrations?.length > 0) {
          setIsRegistered(true);
          setMinors(registrationsResult.data.registrations[0].minors);
          if (registrationsResult.data.registrations[0].minors.length > 0)
            setHasMinor(true);
          setRegistrations(registrationsResult.data.registrations);

          let count = 0;
          registrationsResult.data.registrations.forEach((reg) => {
            count += 1 + reg.minors.length;
          });

          // get registered tasks
          const userTasks =
            registrationsResult.data.registrations[0]?.tasks || [];
          setTasks(userTasks);
        }
        // Fetch all registrations for the event
        return getRegistrations({ eventId });
      })
      .then((allRegistrationsResult) => {
        let approvedCount = 0;
        allRegistrationsResult.data.registrations.forEach((reg) => {
          if (reg.approved === "approved") {
            approvedCount += 1 + reg.minors.length;
          }
        });

        // Ensure event is loaded before setting count to prevent displaying incorrect
        // "Spots Remaining" due to undefined maxVolunteers.
        setEvent((prevEvent) => {
          if (!prevEvent || !prevEvent.eventParent) {
            console.warn("Event or eventParent is undefined.");
            return prevEvent;
          }

          // Avoid displaying negative slots left
          setRegCount(
            Math.min(approvedCount, prevEvent.eventParent.maxVolunteers)
          );

          return prevEvent;
        });
      })
      .catch((error) => {
        console.error("Error loading event data:", error);
      });
  };

  const onCompleteRegistrationClicked = () => {
    setShowWaiverModal(true);
  };

  const onAddMinorClicked = () => {
    setShowMinorModal(true);
  };

  const onRegisterAfterWaiverClicked = () => {
    toggleWaiverModal();
    setIsLoading(true);
    registerForEvent({
      eventId: event._id,
      userId: user._id,
      organizationId: user.organizationId,
      minors,
      approved: event.eventParent.requiresApproval ? "pending" : "approved",
      tasks: tasks,
    }).then(() => {
      setIsRegistered(true);
      setIsLoading(false);
      setRefreshTrigger((prev) => prev + 1);
    });
  };

  const toggleMinorModal = () => {
    setShowMinorModal((prev) => !prev);
  };

  const toggleWaiverModal = () => {
    setShowWaiverModal((prev) => !prev);
  };

  const addMinor = (firstName, lastName) => {
    minors.push(firstName + " " + lastName);
    setMinors(minors);
    setHasMinor(true);
  };

  const removeMinor = (minorName) => {
    let newMinors = minors.filter((minor) => minor !== minorName);
    setMinors(newMinors);
    if (newMinors.length === 0) setHasMinor(false);
  };

  const onUnregister = () => {
    // Unregister Functionality is handled in the UnregisterModal
    router.push("/events");
  };

  const goBackToDetails = () => {
    router.replace(`/events/${eventId}`);
  };

  const [tasks, setTasks] = useState([]);

  return (
    <Styled.Container fluid="md" className="mx-20 w-4/5 overflow-y-hidden">
      <div className="flex flex-row justify-between">
        <Text type="header" text="Confirm Registration"></Text>
        <div className="flex items-end">
          <Text
            type="header"
            text={event?.eventParent?.maxVolunteers - regCount}
          ></Text>
          <Text
            className="min-w-max"
            type="subheader"
            text={`/${event?.eventParent?.maxVolunteers} Spots Remaining`}
          ></Text>
        </div>
      </div>
      <div className="mt-8 flex flex-row items-center">
        <Text text="Event Information" type="subheader" />
        <Text
          className="ml-3 font-bold"
          href={`/events`}
          onClick={() => goBackToDetails()}
          text="Visit Event Page"
        />
      </div>
      {isLoading && (
        <React.Fragment>
          <Styled.Row>
            <Col xs="12" lg="6">
              <Styled.MainText>Confirming...</Styled.MainText>
            </Col>
          </Styled.Row>
          <Col xs="12">
            <Styled.LoadGif src="/images/loading.gif" alt="loading" />
          </Col>
        </React.Fragment>
      )}
      <div className="h-6" />
      <EventRegisterInfoContainer
        event={event}
        user={user}
        eventId={eventId}
        refreshTrigger={refreshTrigger}
      />
      <Styled.BottomContainer>
        <div className="flex flex-row items-center">
          <Text text={`Your Group (${minors.length + 1})`} type="subheader" />
          <div
            onClick={(e) => {
              e.preventDefault();
              onAddMinorClicked();
            }}
            className="cursor-pointer"
          >
            <Text
              text="Add Minor (under 16 years old)"
              type="subheader"
              className="ml-4 text-primaryColor"
            />
          </div>
        </div>
        <div className="flex flex-row flex-wrap pr-10 pt-2">
          <Styled.VolunteerContainer className="mt-2 bg-transparent ring-2 ring-primaryColor">
            <Styled.VolunteerRow>
              <Styled.SectionHeaderText>
                {user.firstName} {user.lastName}
              </Styled.SectionHeaderText>
            </Styled.VolunteerRow>
            <Styled.VolunteerRow>
              <Styled.DetailText>{user.email}</Styled.DetailText>
            </Styled.VolunteerRow>
          </Styled.VolunteerContainer>
          {minors &&
            minors.map((minor) => (
              <Styled.VolunteerContainer
                className="mt-2 bg-transparent ring-2 ring-primaryColor"
                key={minor}
              >
                <Styled.VolunteerCol>
                  <div>
                    <Styled.VolunteerRow>
                      <Styled.SectionHeaderText>
                        {minor}
                      </Styled.SectionHeaderText>
                      <Styled.DetailText>Minor</Styled.DetailText>
                    </Styled.VolunteerRow>
                  </div>
                  {!isRegistered && (
                    <Tooltip content="Delete" style="light">
                      <button
                        className="mx-1"
                        onClick={() => {
                          removeMinor(minor);
                        }}
                      >
                        <TrashIcon className="h-8 text-primaryColor" />
                      </button>
                    </Tooltip>
                  )}
                </Styled.VolunteerCol>
              </Styled.VolunteerContainer>
            ))}
          <div className="flex flex-col items-center justify-center">
            {!isRegistered && (
              <Link href={`/events/${eventId}/register`}>
                <BoGButton text={"Add a Minor"} onClick={onAddMinorClicked} />
              </Link>
            )}
          </div>
        </div>
      </Styled.BottomContainer>

      {isRegistered !== undefined && (
        <EventTasksContainer
          event={event}
          user={user}
          eventId={eventId}
          setTasks={setTasks}
          isRegistered={isRegistered}
          tasks={tasks}
        />
      )}

      {event?.eventParent?.requiresApproval && (
        <div className="mt-3 flex flex-row pl-3">
          <Text text="*" className="text-primaryColor" />
          <Text
            text="This event requires approval to confirm your participation"
            className="text-black-500 text-left text-sm font-semibold"
          />
        </div>
      )}

      {!isRegistered && (
        <div className="my-3">
          <BoGButton
            text="Complete Registration"
            onClick={onCompleteRegistrationClicked}
            className="w-full bg-primaryColor font-semibold hover:bg-hoverColor"
          />
        </div>
      )}

      {isRegistered && registrations[0]?.approved == "approved" ? (
        <div className="flex gap-2">
          <BoGButton
            text={
              <>
                <ClipboardDocumentCheckIcon className="mr-2 inline h-5 w-5" />
                Registered!
              </>
            }
            className="flex-1 bg-secondaryColor font-semibold !text-black hover:bg-secondaryColor"
          />
          <BoGButton
            text="Cancel Registration"
            onClick={() => {
              setShowUnregisterModal(true);
            }}
            className="w-48 flex-none bg-secondaryColor font-semibold !text-black hover:bg-secondaryColor"
          />
        </div>
      ) : isRegistered && registrations[0]?.approved == "pending" ? (
        <div className="flex gap-2">
          <BoGButton
            text={
              <>
                <ClipboardDocumentCheckIcon className="mr-2 inline h-5 w-5" />
                Pending Approval
              </>
            }
            className="flex-1 bg-secondaryColor font-semibold !text-black hover:bg-secondaryColor"
          />
          <BoGButton
            text="Cancel Registration"
            onClick={() => {
              setShowUnregisterModal(true);
            }}
            className="w-48 flex-none bg-secondaryColor font-semibold !text-black hover:bg-secondaryColor"
          />
        </div>
      ) : isRegistered && registrations[0]?.approved == "denied" ? (
        <div className="my-3">
          <BoGButton
            text={
              <>
                <ClipboardDocumentCheckIcon className="mr-2 inline h-5 w-5" />
                Denied
              </>
            }
            className="w-full bg-secondaryColor font-semibold !text-black hover:bg-secondaryColor"
          />
        </div>
      ) : null}

      <EventMinorModal
        open={showMinorModal}
        toggle={toggleMinorModal}
        event={event}
        addMinor={addMinor}
      />
      <EventWaiverModal
        open={showWaiverModal}
        toggle={toggleWaiverModal}
        hasMinor={hasMinor}
        onRegisterAfterWaiverClicked={onRegisterAfterWaiverClicked}
        eventId={eventId}
        isRegistered={isRegistered}
      />
      <EventUnregisterModal
        open={showUnregisterModal}
        toggle={() => {
          setShowUnregisterModal(!showUnregisterModal);
        }}
        eventData={event}
        userId={user._id}
        callback={() => {
          onUnregister();
        }}
      />
    </Styled.Container>
  );
};

EventRegister.propTypes = {
  event: PropTypes.object,
};

export default EventRegister;
