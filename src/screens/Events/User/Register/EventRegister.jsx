import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSession } from "next-auth/react";
import styled from "styled-components";
import {
  ModalFooter,
  Row,
  Col,
  Button,
  Container,
  FormGroup,
  UncontrolledTooltip,
  Input,
} from "reactstrap";
import EventRegisterInfoContainer from "./EventRegisterInfoContainer";
import EventMinorModal from "./EventMinorModal";
import EventWaiverModal from "./EventWaiverModal";
import IconSpecial from "../../../../components/IconSpecial";
import { fetchEvents } from "../../../../actions/queries";

import PropTypes from "prop-types";
import variables from "../../../../design-tokens/_variables.module.scss";

const Styled = {
  Container: styled(Container)`
    background-color: ${variables["gray-100"]};
    overflow-y: scroll;
    overflow-x: hidden;
    font-family: "Aktiv Grotesk";
  `,
  Row: styled(Row)`
    margin: 0 2rem 0.5rem 2rem;
  `,
  Button: styled(Button)`
    background-color: ${variables["primary"]};
    color: ${variables["white"]};
    width: 80%;
    margin: auto;
  `,
  ModalFooter: styled(ModalFooter)`
    background-color: ${variables["white"]};
    position: sticky;
    bottom: 0;
    margin: 0 -1rem 0 -1rem;
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
    margin-left: 1rem;
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
  AccomodationText: styled.p`
    color: ${variables["yiq-text-dark"]};
    font-size: 0.8rem;
  `,
  AccomodationRow: styled(Row)`
    margin: -1rem 1rem 0 3.2rem;
  `,
  VolunteerContainer: styled(Col)`
    background-color: ${variables["white"]};
    border-radius: 0.5rem;
    margin-bottom: 0.5rem;
  `,
  VolunteerRow: styled(Row)`
    margin-left: 1rem;
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
  EventContainer: styled(Container)`
    background-color: ${variables["white"]};
    border-radius: 0.5rem;
    height: 100%;
    width: 90%;
  `,
};

const EventRegister = (event) => {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session.user;
  const [showMinorModal, setShowMinorModal] = useState(false);
  const [showWaiverModal, setShowWaiverModal] = useState(false);
  const [hasMinor, setHasMinor] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onRefresh = () => {
    setIsLoading(true);
    fetchEvents()
      .then()
      .finally(() => {
        setTimeout(() => setIsLoading(false), 7000);
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
  };

  const toggleMinorModal = () => {
    setShowMinorModal((prev) => !prev);
  };

  const toggleWaiverModal = () => {
    setShowWaiverModal((prev) => !prev);
  };

  const toggleHasMinor = () => {
    setHasMinor((prev) => !prev);
  };

  return (
    <Styled.Container fluid="md">
      <Styled.Title />
      {!isRegistered && (
        <Styled.Row>
          <Col xs="12" lg="6">
            <Styled.MainText>Confirm Registration</Styled.MainText>
          </Col>
          <Col xs="12" lg={{ size: 4, offset: 2 }}>
            <Row>
              <Styled.VolunteerNumberText>30/100 </Styled.VolunteerNumberText>
              <Styled.VolunteerText> Spots Remaining</Styled.VolunteerText>
            </Row>
          </Col>
        </Styled.Row>
      )}
      {isRegistered && !isLoading && (
        <React.Fragment>
          <Styled.Row>
            <Col xs="12" lg="6">
              <Styled.MainText>Registration Confirmed</Styled.MainText>
            </Col>
          </Styled.Row>
          <Styled.Row>
            <Col xs="12" lg="2">
              <Styled.CheckGif src="/images/check.gif" alt="check" />
            </Col>
            <Col xs="12" lg="10">
              <Styled.EventContainer>
                <Styled.Row />
                <Styled.Row />
                <Styled.Row>
                  <Styled.MainText>
                    We’ve sent a confirmation email. See you soon!
                  </Styled.MainText>
                </Styled.Row>
                <Styled.Row>
                  <Button color="primary" onClick={onReturnToHomeClicked}>
                    Return to Home
                  </Button>
                </Styled.Row>
                <Styled.Row style={{ flex: 1 }}>
                  <Styled.LinkedText>Resend Confirmation</Styled.LinkedText>
                  <Styled.SectionText />
                  <Styled.LinkedText>View Waivers</Styled.LinkedText>
                  <Styled.SectionText />
                  <Styled.LinkedTextRight>
                    Cancel Registration
                  </Styled.LinkedTextRight>
                </Styled.Row>
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
        <Styled.SectionText>Event Information</Styled.SectionText>
        <Styled.LinkedText>Visit Event Page</Styled.LinkedText>
      </Styled.Row>
      <Styled.Row>
        <EventRegisterInfoContainer event={event} user={user} />
      </Styled.Row>
      <Styled.Row>
        <Styled.SectionText>Your Group</Styled.SectionText>
        <Link href="/register">
          <Styled.LinkedText onClick={onAddMinorClicked}>
            Add Minor (under 13 years old)
          </Styled.LinkedText>
        </Link>
      </Styled.Row>
      <Styled.AccomodationRow>
        <FormGroup check>
          <Input type="checkbox" onChange={toggleHasMinor} />{" "}
        </FormGroup>
        <Styled.AccomodationText>
          I require accomadation for my court required hours
        </Styled.AccomodationText>
        <IconSpecial
          width="20"
          height="20"
          viewBox="0 0 20 20"
          name="info"
          href="#"
          id="tooltipShow"
        />
        <UncontrolledTooltip placement="right" target="tooltipShow">
          Here is information about your required court hours.
        </UncontrolledTooltip>
      </Styled.AccomodationRow>
      <Styled.Row>
        <Col xs="12" lg="3">
          <Styled.VolunteerContainer>
            <Styled.VolunteerRow>
              <Styled.SectionHeaderText>Fred Burger</Styled.SectionHeaderText>
            </Styled.VolunteerRow>
            <Styled.VolunteerRow>
              <Styled.DetailText>fredfredburger@gmail.com</Styled.DetailText>
            </Styled.VolunteerRow>
          </Styled.VolunteerContainer>
        </Col>
        <Col xs="12" lg="3">
          <Styled.VolunteerContainer>
            <Styled.VolunteerRow>
              <Styled.SectionHeaderText>Carlos Burger</Styled.SectionHeaderText>
            </Styled.VolunteerRow>
            <Styled.VolunteerRow>
              <Styled.DetailText>Minor</Styled.DetailText>
            </Styled.VolunteerRow>
          </Styled.VolunteerContainer>
        </Col>
      </Styled.Row>
      {!isRegistered && (
        <Styled.ModalFooter>
          <Styled.Button onClick={onCompleteRegistrationClicked}>
            Complete Registration
          </Styled.Button>
        </Styled.ModalFooter>
      )}
      <EventMinorModal open={showMinorModal} toggle={toggleMinorModal} />
      <EventWaiverModal
        open={showWaiverModal}
        toggle={toggleWaiverModal}
        hasMinor={hasMinor}
        onRegisterAfterWaiverClicked={onRegisterAfterWaiverClicked}
      />
    </Styled.Container>
  );
};

EventRegister.propTypes = {
  event: PropTypes.object,
};

export default EventRegister;
