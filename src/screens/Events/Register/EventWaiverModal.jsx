import { Tabs } from "flowbite-react";
import { useSession } from "next-auth/react";
import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import {
  Col,
  Container,
  FormGroup,
  Input,
  Modal,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import styled from "styled-components";
import BoGButton from "../../../components/BoGButton";
import variables from "../../../design-tokens/_variables.module.scss";
import { getWaivers } from "../../../queries/waivers";

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
  Col: styled(Col)``,
  Row: styled(Row)`
    margin: 0.5rem 2rem 0.5rem 1rem;
  `,
  Text: styled.p`
    color: ${variables["yiq-text-dark"]};
  `,
  Container: styled(Container)`
    background-color: ${variables["success"]};
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
  const [waiverCheckboxSelected, setWaiverCheckboxSelected] = useState(false);
  const [waiverMinorCheckboxSelected, setMinorWaiverCheckboxSelected] =
    useState(false);

  const [activeTab, setActiveTab] = useState(0);
  const tabsRef = useRef(null);

  const onWaiverCheckboxClicked = (e) => {
    setWaiverCheckboxSelected(e.target.checked);
  };

  const onWaiverMinorCheckboxClicked = (e) => {
    setMinorWaiverCheckboxSelected(e.target.checked);
  };

  const [adultContent, setAdultContent] = useState("");
  const [minorContent, setMinorContent] = useState("");

  const loadWaivers = async () => {
    const adultWaiverResponse = await getWaivers("adult", user.organizationId);
    console.log(adultWaiverResponse);
    if (adultWaiverResponse.data.success) {
      setAdultContent(adultWaiverResponse.data.waivers[0].text);
    }

    const minorWaiverResponse = await getWaivers("minor", user.organizationId);
    if (minorWaiverResponse.data.success) {
      setMinorContent(minorWaiverResponse.data.waivers[0].text);
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
          <Tabs.Group
            style="underline"
            ref={tabsRef}
            onActiveTabChange={(tab) => setActiveTab(tab)}
          >
            <Tabs.Item title="Guardian Waiver" className="overflow-auto">
              <Styled.WaiverBox>
                <div dangerouslySetInnerHTML={{ __html: adultContent }} />
              </Styled.WaiverBox>
              {!isRegistered && (
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
            </Tabs.Item>
            <Tabs.Item title="Minor Waiver" className="overflow-auto">
              <Styled.WaiverBox>
                <div dangerouslySetInnerHTML={{ __html: minorContent }} />
              </Styled.WaiverBox>
              {!isRegistered && (
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
          {!isRegistered && (
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
        </>
      )}
      <ModalFooter>
        {!hasMinor && !isRegistered && (
          <BoGButton
            text="Register"
            disabled={!waiverCheckboxSelected}
            onClick={() => onRegisterAfterWaiverClicked()}
          />
        )}
        {hasMinor && !isRegistered && activeTab === 0 && (
          <BoGButton
            onClick={() => tabsRef.current?.setActiveTab(1)}
            disabled={!waiverCheckboxSelected}
            text="Next"
          />
        )}
        {hasMinor && !isRegistered && activeTab === 1 && (
          <React.Fragment>
            <BoGButton
              text="Previous"
              onClick={() => tabsRef.current?.setActiveTab(0)}
            />
            <BoGButton
              text="Register"
              disabled={!waiverMinorCheckboxSelected || !waiverCheckboxSelected}
              onClick={() => onRegisterAfterWaiverClicked()}
            />
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
