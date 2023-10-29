import { TrashIcon } from "@heroicons/react/24/solid";
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
  MinorRow: styled.div`
    display: flex;
    flex-direction: row;
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

  useEffect(() => {
    onLoadEvent();
  }, []);

  const onLoadEvent = () => {
    getEvent(eventId).then((result) => {
      if (result?.data?.event) {
        setEvent(result.data.event);
      }
    });
    getRegistrations({ eventId, userId: user._id }).then((result) => {
      if (result?.data?.registrations?.length > 0) {
        setIsRegistered(true);
        setMinors(result.data.registrations[0].minors);
        if (result.data.registrations[0].minors.length > 0) setHasMinor(true);
      }
    });
  };

  const onCompleteRegistrationClicked = () => {
    setShowWaiverModal(true);
  };

  const onAddMinorClicked = () => {
    setShowMinorModal(true);
  };

  const onReturnToHomeClicked = () => {
    router.replace("/");
  };

  const onRegisterAfterWaiverClicked = () => {
    toggleWaiverModal();
    setIsLoading(true);

    registerForEvent({
      eventId: event._id,
      userId: user._id,
      organizationId: user.organizationId,
      minors,
    }).then(() => {
      setIsRegistered(true);
      setIsLoading(false);
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
    unregisterForEvent(event._id, user._id);
    setIsRegistered(false);
    setMinors([]);
    setHasMinor(false);
  };

  const goBackToDetails = () => {
    router.replace(`/events/${eventId}`);
  };

  return (
    <Styled.Container fluid="md">
      <Text
        className="ml-12"
        href={`/events`}
        onClick={() => goBackToDetails()}
        text="← Back to home"
      />
      {!isRegistered && (
        <Styled.Row>
          <Col xs="12" lg="6" className="mt-2">
            <Styled.MainText>Complete Your Registration</Styled.MainText>
          </Col>
          <Col xs="12" lg={{ size: 4, offset: 2 }}></Col>
        </Styled.Row>
      )}
      {isRegistered && !isLoading && (
        <React.Fragment>
          <Styled.Row>
            <Col xs="12" lg="6">
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              <Styled.MainText>You've registered successfully!</Styled.MainText>
            </Col>
            <Col xs="12" lg="2">
              <Styled.CheckGif src="/images/check.gif" alt="check" loop="0" />
            </Col>
          </Styled.Row>

          <div className="flex w-11/12 flex-col space-y-2 rounded-md bg-white p-4">
            <Text
              text="Please check your mailbox for a confirmation email"
              type="subheader"
              className="pl-2"
            />
            <div className="flex flex-wrap justify-start gap-2 p-2">
              <BoGButton
                text="View Waivers"
                onClick={onCompleteRegistrationClicked}
              />
              <BoGButton text="Cancel Registration" onClick={onUnregister} />
            </div>
          </div>
        </React.Fragment>
      )}
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
      <EventRegisterInfoContainer event={event} user={user} eventId={eventId} />
      <Styled.BottomContainer>
        <Text text="Your Group" type="subheader" className="py-2" />
        <Text
          text="If a minor below 13 years of age will volunteer with you, please add
          their information below."
        />
        <Text
          text="Note: Minors at or above 13 years of age need to register using
            their own account."
          className="py-2"
        />
        <Styled.Row>
          <Styled.VolunteerContainer className="bg-grey">
            <Styled.VolunteerRow>
              <Styled.SectionHeaderText>
                {user.firstName} {user.lastName}
              </Styled.SectionHeaderText>
            </Styled.VolunteerRow>
            <Styled.VolunteerRow>
              <Styled.DetailText>{user.email}</Styled.DetailText>
            </Styled.VolunteerRow>
          </Styled.VolunteerContainer>
          <Styled.MinorRow>
            {minors &&
              minors.map((minor) => (
                <Styled.VolunteerContainer className="bg-grey" key={minor}>
                  <Styled.VolunteerCol>
                    <div>
                      <Styled.VolunteerRow>
                        <Styled.SectionHeaderText>
                          {minor}
                        </Styled.SectionHeaderText>
                        <Styled.DetailText>
                          Minor with {user.firstName} {user.lastName}
                        </Styled.DetailText>
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
          </Styled.MinorRow>
          <Col>
            {!isRegistered && (
              <Link href={`/events/${eventId}/register`}>
                <BoGButton text={"Add a Minor"} onClick={onAddMinorClicked} />
              </Link>
            )}
          </Col>
        </Styled.Row>
      </Styled.BottomContainer>
      {!isRegistered && (
        <Styled.ModalFooter>
          <BoGButton text="Register" onClick={onCompleteRegistrationClicked} />
        </Styled.ModalFooter>
      )}
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
    </Styled.Container>
  );
};

EventRegister.propTypes = {
  event: PropTypes.object,
};

export default EventRegister;
