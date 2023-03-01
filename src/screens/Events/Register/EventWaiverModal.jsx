import React, { useState } from "react";
import styled from "styled-components";
import { Modal, ModalHeader, ModalFooter, Input, FormGroup } from "reactstrap";
import { Button, Tabs } from "flowbite-react";
import PropTypes from "prop-types";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { getWaivers } from "../../../actions/queries";
import { Col, Row, Container } from "reactstrap";
import variables from "../../../design-tokens/_variables.module.scss";

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
  WaiverBox: styled.p`
    border: 0.1rem solid ${variables["gray-200"]};
    border-radius: 5px;
    padding: 1rem;
    margin-left: 10px;
    margin-right: 10px;
    margin-bottom: 1rem;
    font-size: 0.7rem;
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
  const {
    data: { user },
  } = useSession();

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

  const [adultContent, setAdultContent] = useState("");
  const [minorContent, setMinorContent] = useState("");

  const loadWaivers = async () => {
    const adult = await getWaivers("adult", user.organizationId);

    if (adult.data.waiver.length > 0) {
      setAdultContent(adult.data.waiver[0].text);
    }

    const minor = await getWaivers("minor", user.organizationId);

    if (minor.data.waiver.length > 0) {
      setMinorContent(minor.data.waiver[0].text);
    }
  };

  useEffect(() => {
    loadWaivers();
  }, []);

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

      {hasMinor ? (
        <>
          {!isRegistered && (
            <Styled.Row>
              <Styled.HighlightText>
                Before you can finish registration. Please review the following
                waivers for yourself and your accompanying minors.
              </Styled.HighlightText>
            </Styled.Row>
          )}
          <Tabs.Group style="underline">
            <Tabs.Item
              title="Guardian Waiver"
              className="overflow-auto"
              onClick={onGuardianClicked}
              active={showGuardian}
            >
              <Styled.WaiverBox>
                <div dangerouslySetInnerHTML={{ __html: adultContent }} />
              </Styled.WaiverBox>
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
            </Tabs.Item>
            <Tabs.Item
              title="Minor Waiver"
              className="overflow-auto"
              onClick={onMinorsClicked}
              active={!showGuardian}
            >
              <Styled.WaiverBox>
                <div dangerouslySetInnerHTML={{ __html: minorContent }} />
              </Styled.WaiverBox>
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
            </Tabs.Item>
          </Tabs.Group>
        </>
      ) : (
        <>
          {!isRegistered && (
            <Styled.Row>
              <Styled.HighlightText>
                Before you can finish registration. Please review the following
                waiver.
              </Styled.HighlightText>
            </Styled.Row>
          )}

          <Styled.WaiverBox>
            <div dangerouslySetInnerHTML={{ __html: adultContent }} />
          </Styled.WaiverBox>
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
        </>
      )}
      <ModalFooter>
        {!hasMinor && !isRegistered && (
          <Button
            gradientMonochrome="pink"
            disabled={!waiverCheckboxSelected}
            onClick={() => onRegisterAfterWaiverClicked()}
          >
            Register
          </Button>
        )}
        {hasMinor && !isRegistered && showGuardian && (
          <Button
            gradientMonochrome="pink"
            onClick={onNextClicked}
            disabled={!waiverCheckboxSelected}
          >
            Next
          </Button>
        )}
        {hasMinor && !isRegistered && !showGuardian && (
          <React.Fragment>
            <Button gradientMonochrome="pink" onClick={onPrevClicked}>
              Previous
            </Button>
            <Button
              gradientMonochrome="pink"
              disabled={!waiverMinorCheckboxSelected || !waiverCheckboxSelected}
              onClick={() => onRegisterAfterWaiverClicked()}
            >
              Register
            </Button>
          </React.Fragment>
        )}
      </ModalFooter>
    </Modal>
  );
};

EventWaiverModal.propTypes = {
  open: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  hasMinor: PropTypes.bool.isRequired,
  onRegisterAfterWaiverClicked: PropTypes.func.isRequired,
  eventId: PropTypes.object.isRequired,
  isRegistered: PropTypes.bool.isRequired,
};
export default EventWaiverModal;
