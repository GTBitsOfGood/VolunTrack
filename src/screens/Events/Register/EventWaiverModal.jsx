import { Tabs } from "flowbite-react";
import { useSession } from "next-auth/react";
import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import {
  Col,
  FormGroup,
  Input,
  Modal,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import styled from "styled-components";
import BoGButton from "../../../components/BoGButton";
import Text from "../../../components/Text";
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
  Col: styled(Col)``,
  Row: styled(Row)`
    margin: 0.5rem 2rem 0.5rem 1rem;
  `,
  WaiverBox: styled.p`
    border: 0.1rem solid ${variables["gray-200"]};
    border-radius: 5px;
    padding: 1rem;
    margin-left: 10px;
    margin-right: 10px;
    margin-bottom: 1rem;
    font-size: 0.7rem;
    height: 45vh;
    overflow-y: scroll;
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
    if (adultWaiverResponse.data.waivers.length > 0) {
      setAdultContent(adultWaiverResponse.data.waivers[0].text);
    } else {
      setAdultContent(null);
      setWaiverCheckboxSelected(true);
    }

    const minorWaiverResponse = await getWaivers("minor", user.organizationId);
    if (minorWaiverResponse.data.waivers.length > 0) {
      setMinorContent(minorWaiverResponse.data.waivers[0].text);
    } else {
      setMinorContent(null);
      setMinorWaiverCheckboxSelected(true);
    }
  };

  useEffect(() => {
    loadWaivers();
  }, []);

  return (
    <Modal isOpen={open} toggle={toggle} size="lg" centered="true">
      <Styled.ModalHeader>
        {!isRegistered && (
          <Styled.MainText>Complete Registration</Styled.MainText>
        )}
        {isRegistered && !(adultContent === null && minorContent === null) && (
          <Styled.MainText>View Waivers</Styled.MainText>
        )}
        {isRegistered && adultContent === null && minorContent === null && (
          <Styled.MainText>No Waivers to View</Styled.MainText>
        )}
      </Styled.ModalHeader>
      <Styled.Row />

      {hasMinor && !(minorContent === null && adultContent === null) ? (
        <>
          {!isRegistered && (
            <Styled.Row>
              <p>
                Before you can finish registration. Please review the following
                waivers for yourself and your accompanying minors.
              </p>
            </Styled.Row>
          )}
          <Tabs.Group
            style="underline"
            ref={tabsRef}
            onActiveTabChange={(tab) => setActiveTab(tab)}
          >
            <Tabs.Item title="Guardian Waiver" className="overflow-auto">
              {!(adultContent === null || adultContent === "") && (
                <Styled.WaiverBox>
                  <div dangerouslySetInnerHTML={{ __html: adultContent }} />
                </Styled.WaiverBox>
              )}
              {!isRegistered && !(adultContent === null) && (
                <Styled.Row>
                  <FormGroup check>
                    <Input
                      type="checkbox"
                      onChange={onWaiverCheckboxClicked}
                      checked={waiverCheckboxSelected}
                    />{" "}
                  </FormGroup>
                  <Text
                    text="I have read the waiver and agree to its terms and conditions"
                    className="ml-4"
                  />
                </Styled.Row>
              )}
              {adultContent === null && (
                <Text text="There is no adult waiver, please check the minor waiver." />
              )}
            </Tabs.Item>

            <Tabs.Item title="Minor Waiver" className="overflow-auto">
              {!(minorContent === null) && (
                <Styled.WaiverBox>
                  <div dangerouslySetInnerHTML={{ __html: minorContent }} />
                </Styled.WaiverBox>
              )}
              {!isRegistered && !(minorContent === null) && (
                <Styled.Row>
                  <FormGroup check>
                    <Input
                      type="checkbox"
                      onChange={onWaiverMinorCheckboxClicked}
                      checked={waiverMinorCheckboxSelected}
                    />{" "}
                  </FormGroup>
                  <Text
                    text="I have read the waiver and agree to its terms and conditions"
                    className="ml-4"
                  />
                </Styled.Row>
              )}
              {minorContent === null && (
                <Text text="There is no minor waiver, please check the adult waiver." />
              )}
            </Tabs.Item>
          </Tabs.Group>
        </>
      ) : (
        <>
          {!(isRegistered || adultContent === null) && (
            <Styled.Row>
              <p>
                Before you can finish registration. Please review the following
                waiver.
              </p>
            </Styled.Row>
          )}

          {!isRegistered && adultContent === null && (
            <Styled.Row>
              <p>Click to confirm registration.</p>
            </Styled.Row>
          )}

          {adultContent !== null && (
            <Styled.WaiverBox>
              <div dangerouslySetInnerHTML={{ __html: adultContent }} />
            </Styled.WaiverBox>
          )}
          {!(isRegistered || adultContent === null) && (
            <Styled.Row>
              <FormGroup check>
                <Input
                  type="checkbox"
                  onChange={onWaiverCheckboxClicked}
                  checked={waiverCheckboxSelected}
                />{" "}
              </FormGroup>
              <Text
                text="I have read the waiver and agree to its terms and conditions"
                className="ml-4"
              />
            </Styled.Row>
          )}
        </>
      )}
      <ModalFooter>
        {!isRegistered &&
          (!hasMinor || (adultContent === null && minorContent === null)) && (
            <BoGButton
              text="Register"
              disabled={!waiverCheckboxSelected}
              onClick={() => onRegisterAfterWaiverClicked()}
            />
          )}

        {hasMinor &&
          !isRegistered &&
          activeTab === 0 &&
          !(adultContent === null && minorContent === null) && (
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
