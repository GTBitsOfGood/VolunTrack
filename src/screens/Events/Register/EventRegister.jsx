import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, ModalFooter, Row } from "reactstrap";
import styled from "styled-components";
import BoGButton from "../../../components/BoGButton";
import { Icon } from "../../../components/Icon";
import variables from "../../../design-tokens/_variables.module.scss";
import { getEvent } from "../../../queries/events";
import { registerForEvent } from "../eventHelpers";
import EventMinorModal from "./EventMinorModal";
import EventRegisterInfoContainer from "./EventRegisterInfoContainer";
import EventWaiverModal from "./EventWaiverModal";

const Styled = {
  Container: styled(Container)`
    background-color: ${variables["gray-100"]};
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
  Button: styled(Button)`
    background-color: ${variables["primary"]};
    color: ${variables["white"]};
    width: 90%;
    margin: auto;
  `,
  ModalFooter: styled(ModalFooter)`
    margin: 1rem -1rem 1rem -1rem;
    border: transparent;
  `,
  Title: styled.div`
    margin-top: 2rem;
  `,
  MainText: styled.p`
    color: ${variables["yiq-text-dark"]};
    font-size: 2rem;
    font-weight: 900;
    text-align: left;
    overflow-wrap: break-word;
  `,
  VolunteerNumberText: styled.p`
    color: ${variables["yiq-text-dark"]};
    font-size: 1.3rem;
    font-weight: 900;
    text-align: left;
    margin-left: 1rem;
    padding-top: 0.5rem;
    overflow-wrap: break-word;
  `,
  VolunteerText: styled.p`
    color: ${variables["yiq-text-dark"]};
    font-size: 1rem;
    font-weight: 500;
    text-align: left;
    margin-left: 0.3rem;
    padding-top: 0.8rem;
    overflow-wrap: break-word;
  `,
  SectionText: styled.p`
    color: ${variables["yiq-text-dark"]};
    font-size: 1.3rem;
    font-weight: 900;
    text-align: left;
    overflow-wrap: break-word;
    margin-right: 1rem;
  `,
  LinkedButton: styled(Button)`
    background-color: transparent;
  `,
  LinkedText: styled.p`
    color: ${variables["primary"]};
    font-size: 0.9rem;
    font-weight: 900;
    text-align: left;
    text-decoration: underline;
    padding-top: 0.4rem;
    overflow-wrap: break-word;
  `,
  LinkedTextRight: styled.p`
    color: ${variables["danger"]};
    font-size: 0.9rem;
    font-weight: 900;
    text-align: right;
    text-decoration: underline;
    padding-top: 0.4rem;
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
  VolunteerInfoText: styled(Row)`
    overflow-wrap: break-word;
  `,
  AccomodationRow: styled.div`
    margin-left: 2rem;
    margin-top: -1rem;
    margin-bottom: 1rem;
  `,
  VolunteerContainer: styled.div`
    background-color: ${variables["white"]};
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
  MinorButton: styled.button`
    background-color: ${variables["primary"]};
    color: ${variables["white"]};
    padding: 0.5rem;
    border: transparent;
    border-radius: 0.5rem;
  `,
  BottomContainer: styled.div`
    margin-left: 1rem;
    margin-top: 2rem;
  `,
  DeleteButton: styled(Button)`
    background: none;
    border: none;

    margin: 0 0 0 auto;
  `,
  MinorRow: styled.div`
    display: flex;
    flex-direction: row;
  `,
};

const EventRegister = (event) => {
  const router = useRouter();
  const { eventId } = router.query;
  const [events, setEvents] = useState({});
  const { data: session } = useSession();
  const user = session.user;
  const [showMinorModal, setShowMinorModal] = useState(false);
  const [showWaiverModal, setShowWaiverModal] = useState(false);
  const [hasMinor, setHasMinor] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    onLoadEvent();
  }, []);

  const onRefresh = () => {
    setIsLoading(true);
    getEvent(eventId)
      .then()
      .finally(() => {
        setTimeout(() => setIsLoading(false), 7000);
      });
  };

  const onLoadEvent = () => {
    getEvent(eventId).then((result) => {
      if (result && result.data && result.data.event) {
        setEvents(result.data.event);
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
    onRefresh();
    setIsRegistered(true);
    if (!events.volunteers.includes(user._id)) {
      events.volunteers.push(user._id);
    }
    let data = {
      event: events,
      user: user,
    };
    registerForEvent(data).then();
  };

  const toggleMinorModal = () => {
    setShowMinorModal((prev) => !prev);
  };

  const toggleWaiverModal = () => {
    setShowWaiverModal((prev) => !prev);
  };

  const setHasMinorTrue = (firstName, lastName) => {
    let added = false;
    for (let minor of events.minors) {
      if (minor.volunteer_id === user._id) {
        minor.minor.push(firstName + " " + lastName);
        added = true;
        break;
      }
    }
    if (!added) {
      let result = {
        minor: [firstName + " " + lastName],
        volunteer_id: user._id,
      };
      events.minors.push(result);
    }
    setHasMinor(true);
  };

  useEffect(() => {
    if (events.minors) {
      for (let minor of events.minors) {
        if (minor.volunteer_id === user._id) {
          setHasMinor(true);
          break;
        }
      }
    }
  }, [events]);

  // const onUnregister = async (event) => {
  //   const changedEvent = {
  //     // remove current user id from event volunteers
  //     ...event,
  //     minors: event.minors?.filter((minor) => minor.volunteer_id !== user._id),
  //     volunteers: event.volunteers?.filter(
  //       (volunteer) => volunteer !== user._id
  //     ),
  //   };
  //   const updatedEvent = await updateEvent(changedEvent);
  //   setEvents(events.map((e) => (e._id === event._id ? updatedEvent : e)));
  //
  //   onRefresh();
  // };

  const deleteMinor = async (event, deleteName) => {
    let allMinors = event.minors;
    let posMinor = 0;
    for (let i = 0; i < allMinors.length; i++) {
      if (allMinors[i].volunteer_id === user._id) {
        posMinor = i;
      }
    }

    event.minors[posMinor].minor = event.minors[posMinor].minor.filter(
      (name) => name !== deleteName
    );

    const changedEvent = {
      ...event,
    };

    setEvents(changedEvent);
  };

  const goBackToDetails = () => {
    router.replace(`/events/${eventId}`);
  };

  return (
    <Styled.Container fluid="md">
      <BoGButton text="Back" onClick={() => goBackToDetails()} />
      <Styled.Title />
      {!isRegistered && (
        <Styled.Row>
          <Col xs="12" lg="6">
            <Styled.MainText>Confirm Registration</Styled.MainText>
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
          </Styled.Row>
          <Styled.Row>
            <Col xs="12" lg="2">
              <Styled.CheckGif src="/images/check.gif" alt="check" loop="0" />
            </Col>
            <Col xs="12" lg="10">
              <Styled.EventContainer>
                <Styled.Row />
                <Styled.Row />
                <Styled.Row>
                  <Styled.MainText>
                    Please check your mailbox for a confirmation email.
                  </Styled.MainText>
                </Styled.Row>
                <Styled.Row style={{ flex: 1 }}>
                  {/*<Styled.LinkedText>Resend Confirmation</Styled.LinkedText>*/}
                  <Styled.SectionText />
                  <Styled.LinkedText
                    style={{ cursor: "pointer" }}
                    onClick={onCompleteRegistrationClicked}
                  >
                    View Waivers
                  </Styled.LinkedText>
                  <Styled.SectionText />
                  {/*<Styled.LinkedTextRight onClick={() => onUnregister(event)}>*/}
                  {/*  Cancel Registration*/}
                  {/*</Styled.LinkedTextRight>*/}
                </Styled.Row>
                <Styled.Row>
                  <BoGButton
                    text="Return to Home"
                    onClick={onReturnToHomeClicked}
                  />
                </Styled.Row>
                <Styled.Row></Styled.Row>
              </Styled.EventContainer>
            </Col>
          </Styled.Row>
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
      <Styled.Row />
      <Styled.Row>
        <EventRegisterInfoContainer
          event={events}
          user={user}
          eventId={eventId}
        />
      </Styled.Row>
      <Styled.BottomContainer>
        <Styled.Row>
          <Styled.SectionText>Your Group</Styled.SectionText>
        </Styled.Row>
        <Styled.AccomodationRow>
          If a minor below 13 years of age will volunteer with you, please add
          their information below. <br></br>
          <br></br>
          <em>
            Note: Minors at or above 13 years of age need to register using
            their own account.
          </em>
        </Styled.AccomodationRow>
        <Styled.Row>
          <Styled.VolunteerContainer>
            <Styled.VolunteerRow>
              <Styled.SectionHeaderText>
                {user.bio.first_name} {user.bio.last_name}
              </Styled.SectionHeaderText>
            </Styled.VolunteerRow>
            <Styled.VolunteerRow>
              <Styled.DetailText>{user.bio.email}</Styled.DetailText>
            </Styled.VolunteerRow>
          </Styled.VolunteerContainer>
          {events.minors &&
            events.minors.map((minor) => (
              <Styled.MinorRow key={minor}>
                {minor.volunteer_id === user._id &&
                  minor.minor.map((names) => (
                    <Styled.VolunteerContainer key={names}>
                      <Styled.VolunteerCol>
                        <div>
                          <Styled.VolunteerRow>
                            <Styled.SectionHeaderText>
                              {names}
                            </Styled.SectionHeaderText>
                            <Styled.DetailText>
                              Minor with {user.bio.first_name}{" "}
                              {user.bio.last_name}
                            </Styled.DetailText>
                          </Styled.VolunteerRow>
                        </div>
                        {!isRegistered && (
                          <div>
                            <Styled.DeleteButton
                              onClick={() => {
                                deleteMinor(events, names);
                              }}
                            >
                              <Icon color="grey3" name="delete" />
                            </Styled.DeleteButton>
                          </div>
                        )}
                      </Styled.VolunteerCol>
                    </Styled.VolunteerContainer>
                  ))}
              </Styled.MinorRow>
            ))}
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
        event={events}
        setHasMinorTrue={setHasMinorTrue}
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
