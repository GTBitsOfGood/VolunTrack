import React, { useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import {
  Modal,
  ModalHeader,
  ModalFooter,
  Button,
  Input,
  FormGroup,
} from "reactstrap";
import PropTypes from "prop-types";
import { Col, Row, Container } from "reactstrap";
import variables from "../../../../design-tokens/_variables.module.scss";
import IconSpecial from "../../../../components/IconSpecial";

const Styled = {
  ModalHeader: styled(ModalHeader)`
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  MainText: styled.p`
    color: ${variables["yiq-text-dark"]};
    font-size: 1.5rem;
    font-weight: 900;
    margin-bottom: 0rem;
  `,
  HighlightText: styled.p`
    color: ${variables["dark"]};
  `,
  MainButton: styled(Button)`
    background-color: ${variables["primary"]};
    color: ${variables["white"]};
    width: 100%;
  `,
  Col: styled(Col)``,
  Row: styled(Row)`
    margin: 0.5rem 2rem 0.5rem 1rem;
  `,
  Text: styled.p`
    color: ${variables["yiq-text-dark"]};
  `,
  PrimaryText: styled.p`
    color: ${variables["primary"]};
    text-align: center;
    padding: 0.1rem;
  `,
  SecondaryTab: styled(Row)`
    margin-left: 0.7rem;
    border-bottom: 0.1rem solid ${variables["gray-200"]};
    bottom: 0;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    padding-top: 0.5rem;
    height: 5%;
  `,
  Tab: styled(Row)`
    margin-left: 0.7rem;
    border: 0.1rem solid ${variables["gray-200"]};
    border-bottom: 0;
    bottom: 0;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    padding-top: 0.5rem;
    margin-bottom: -1rem;
    height: 5%;
  `,
  Container: styled(Container)`
    background-color: ${variables["success"]};
  `,
  Button: styled(Button)`
    margin-left: 1rem;
  `,
};

const EventWaiverModal = ({
  open,
  toggle,
  hasMinor,
  onRegisterAfterWaiverClicked,
  eventId,
  isRegistered,
}) => {
  const [showGuardian, setShowGuardian] = useState(true);

  const [waiverCheckboxSelected, setWaiverCheckboxSelected] = useState(false);
  const [waiverMinorCheckboxSelected, setMinorWaiverCheckboxSelected] =
    useState(false);

  const onGuardianClicked = () => {
    setShowGuardian(true);
  };

  const onMinorsClicked = () => {
    setShowGuardian(false);
  };

  const onNextClicked = () => {
    onMinorsClicked();
  };

  const onPrevClicked = () => {
    onGuardianClicked();
  };

  const onWaiverCheckboxClicked = (e) => {
    setWaiverCheckboxSelected(e.target.checked);
  };

  const onWaiverMinorCheckboxClicked = (e) => {
    setMinorWaiverCheckboxSelected(e.target.checked);
  };

  const [showMe, setShowMe] = useState(false);
  const togglePdf = () => {
    setShowMe((prev) => !prev);
  };

  return (
    <Modal isOpen={open} toggle={toggle} size="lg" centered="true">
      <Styled.ModalHeader>
        {!isRegistered ? (
          <Styled.MainText>Complete Registration</Styled.MainText>
        ) : (
          <Styled.MainText>View Waivers</Styled.MainText>
        )}
      </Styled.ModalHeader>
      <Styled.Row />
      {hasMinor && isRegistered && (
        <React.Fragment>
          <Styled.Row>
            {showGuardian && (
              <React.Fragment>
                <Link href={`/events/${eventId}/register`}>
                  <Styled.Tab>
                    <Styled.PrimaryText onClick={onGuardianClicked}>
                      Guardian
                    </Styled.PrimaryText>
                    <IconSpecial
                      width="8"
                      height="8"
                      viewBox="0 0 8 8"
                      name="highlightTab"
                    />
                  </Styled.Tab>
                </Link>
                <Link href={`/events/${eventId}/register`}>
                  <Styled.SecondaryTab>
                    <Styled.PrimaryText onClick={onMinorsClicked}>
                      Minors
                    </Styled.PrimaryText>
                    <IconSpecial
                      width="8"
                      height="8"
                      viewBox="0 0 8 8"
                      name="highlightTab"
                    />
                  </Styled.SecondaryTab>
                </Link>
              </React.Fragment>
            )}
            {!showGuardian && isRegistered && (
              <React.Fragment>
                <Link href={`/events/${eventId}/register`}>
                  <Styled.SecondaryTab>
                    <Styled.PrimaryText onClick={onGuardianClicked}>
                      Guardian
                    </Styled.PrimaryText>
                    <IconSpecial
                      width="8"
                      height="8"
                      viewBox="0 0 8 8"
                      name="highlightTab"
                    />
                  </Styled.SecondaryTab>
                </Link>
                <Link href={`/events/${eventId}/register`}>
                  <Styled.Tab>
                    <Styled.PrimaryText onClick={onMinorsClicked}>
                      Minors
                    </Styled.PrimaryText>
                    <IconSpecial
                      width="8"
                      height="8"
                      viewBox="0 0 8 8"
                      name="highlightTab"
                    />
                  </Styled.Tab>
                </Link>
              </React.Fragment>
            )}
          </Styled.Row>
        </React.Fragment>
      )}
      {hasMinor && !isRegistered && (
        <React.Fragment>
          <Styled.Row>
            <Styled.HighlightText>
              Before you can finish registration. Please review the following
              waivers for yourself and your accompanying minors.
            </Styled.HighlightText>
          </Styled.Row>
          <Styled.Row>
            {showGuardian && (
              <React.Fragment>
                <Link href={`/events/${eventId}/register`}>
                  <Styled.Tab>
                    <Styled.PrimaryText onClick={onGuardianClicked}>
                      Guardian
                    </Styled.PrimaryText>
                    <IconSpecial
                      width="8"
                      height="8"
                      viewBox="0 0 8 8"
                      name="highlightTab"
                    />
                  </Styled.Tab>
                </Link>
                <Link href={`/events/${eventId}/register`}>
                  <Styled.SecondaryTab>
                    <Styled.PrimaryText onClick={onMinorsClicked}>
                      Minors
                    </Styled.PrimaryText>
                    <IconSpecial
                      width="8"
                      height="8"
                      viewBox="0 0 8 8"
                      name="highlightTab"
                    />
                  </Styled.SecondaryTab>
                </Link>
              </React.Fragment>
            )}
            {!showGuardian && !isRegistered && (
              <React.Fragment>
                <Link href={`/events/${eventId}/register`}>
                  <Styled.SecondaryTab>
                    <Styled.PrimaryText onClick={onGuardianClicked}>
                      Guardian
                    </Styled.PrimaryText>
                    <IconSpecial
                      width="8"
                      height="8"
                      viewBox="0 0 8 8"
                      name="highlightTab"
                    />
                  </Styled.SecondaryTab>
                </Link>
                <Link href={`/events/${eventId}/register`}>
                  <Styled.Tab>
                    <Styled.PrimaryText onClick={onMinorsClicked}>
                      Minors
                    </Styled.PrimaryText>
                    <IconSpecial
                      width="8"
                      height="8"
                      viewBox="0 0 8 8"
                      name="highlightTab"
                    />
                  </Styled.Tab>
                </Link>
              </React.Fragment>
            )}
          </Styled.Row>
        </React.Fragment>
      )}
      {!hasMinor && !isRegistered && (
        <Styled.Row>
          <Styled.HighlightText>
            Before you can finish registration. Please review the following
            waiver. <br></br>If you are under 18, the waiver must be signed by
            your parent.
          </Styled.HighlightText>
        </Styled.Row>
      )}

      <Styled.Row>
        <Styled.MainButton onClick={togglePdf}>
          <IconSpecial width="25" height="24" viewBox="0 0 25 24" name="link" />
          Read Waiver
        </Styled.MainButton>
        <Styled.Row
          style={{
            display: showMe ? "block" : "none",
          }}
        >
          <iframe
            style={{ width: "563px", height: "666px" }}
            src={e.target.name}
            src={showGuardian ? "/files/adult.pdf" : "/files/minor.pdf"}
            type="application/pdf"
            title="title"
          />
        </Styled.Row>
      </Styled.Row>
      {showGuardian && !isRegistered && (
        <Styled.Row>
          <FormGroup check>
            <Input
              type="checkbox"
              onChange={onWaiverCheckboxClicked}
              checked={waiverCheckboxSelected}
            />{" "}
          </FormGroup>
          <Styled.Text>
            I have read the waiver and agree to its terms and conditions
          </Styled.Text>
        </Styled.Row>
      )}

      {!showGuardian && !isRegistered && (
        <Styled.Row>
          <FormGroup check>
            <Input
              type="checkbox"
              onChange={onWaiverMinorCheckboxClicked}
              checked={waiverMinorCheckboxSelected}
            />{" "}
          </FormGroup>
          <Styled.Text>
            I have read the waiver and agree to its terms and conditions
          </Styled.Text>
        </Styled.Row>
      )}
      <ModalFooter>
        {!hasMinor && !isRegistered && (
          <Button
            color="primary"
            disabled={!waiverCheckboxSelected}
            onClick={() => onRegisterAfterWaiverClicked()}
          >
            Register
          </Button>
        )}
        {hasMinor && !isRegistered && showGuardian && (
          <Button
            color="primary"
            onClick={onNextClicked}
            disabled={!waiverCheckboxSelected}
          >
            Next
          </Button>
        )}
        {hasMinor && !isRegistered && !showGuardian && (
          <React.Fragment>
            <Styled.Button color="primary" onClick={onPrevClicked}>
              Previous
            </Styled.Button>
            <Styled.Button
              color="primary"
              disabled={!waiverMinorCheckboxSelected || !waiverCheckboxSelected}
              onClick={() => onRegisterAfterWaiverClicked()}
            >
              Register
            </Styled.Button>
          </React.Fragment>
        )}
      </ModalFooter>
    </Modal>
  );
};

EventWaiverModal.propTypes = {
  open: PropTypes.bool,
  toggle: PropTypes.func,
};
export default EventWaiverModal;
