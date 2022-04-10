import React from "react";
import styled from "styled-components";
import { Row, Col, Container } from "reactstrap";
import IconSpecial from "../../../../components/IconSpecial";

import PropTypes from "prop-types";
import variables from "../../../../design-tokens/_variables.module.scss";

const Styled = {
    EventContainer: styled(Container)`
      background-color: ${variables["white"]};
      margin-left: 1rem;
      border-radius: 0.5rem;
    `,
    ContactText: styled.p`
        color: ${variables["primary"]};
        font-size: 1rem;
        font-weight: 900;
        margin-left: 0.5rem;
        text-align: left;
        overflow-wrap: break-word;
        padding-bottom: 0.75rem;
    `,
    DetailText: styled.p`
        color: ${variables["gray-400"]};
        font-size: 0.8rem;
        overflow-wrap: break-word;
    `,
    EventInfoText: styled.p`
        color: ${variables["dark"]};
        font-size: 1rem;
        font-weight: 600;
        margin-left: 0.5rem;
        text-align: left;
        overflow-wrap: break-word;
    `,
    EventTitleText: styled.p`
        color: ${variables["dark"]};
        font-size: 1.5rem;
        font-weight: 900;
        margin-top: 1rem;
        margin-bottom: 0rem;
        text-align: left;
        overflow-wrap: break-word;
    `,
    EventRow: styled(Row)`
        margin: 0 1rem 0 1rem;
    `,
    SectionHeaderText: styled.p`
        color: ${variables["yiq-text-dark"]};
        text-align: left;
        font-weight: 900;
        margin-top: 0.8rem;
        overflow-wrap: break-word;
    `,
    EventInfoCol: styled(Col)`
        background-color: ${variables["gray-100"]};
        margin: 0 2rem 0.5rem 0;
        padding-top: 0.8rem;
        padding-left: 1.6rem;
        border-radius: 0.5rem;
    `,
    };

const convertTime = (time) => {
  console.log(time);
  console.log(typeof(time));
  let [hour, min] = time.split(":");
  let hours = parseInt(hour);
  let suffix = time[-2];
  if (!(suffix in ["pm", "am", "PM", "AM"])) {
    suffix = hours > 11 ? "pm" : "am";
  }
  hours = ((hours + 11) % 12) + 1;
  return hours.toString() + ":" + min + suffix;
};

const EventRegisterInfoContainer = ({event, user}) => {
    const {
        email = "",
        phone_number = "",
     } = user?.bio ?? {};
    
    if (!event || !event.date) {
        return <div />;
    }

    return (
    <Styled.EventContainer>
        <Styled.EventRow>
            <Styled.EventTitleText>{event.title}</Styled.EventTitleText>
        </Styled.EventRow>
        <Styled.EventRow>
            <Styled.DetailText>{event.description}</Styled.DetailText>
        </Styled.EventRow>
        <Styled.EventRow>
            <Styled.EventInfoCol xs="12" lg="3">
                <Row>
                    <IconSpecial width="31" height="31" viewBox="0 0 31 31" name="date"/>
                    <Styled.EventInfoText>{event.date.slice(0, 10)}</Styled.EventInfoText>
                </Row>
            </Styled.EventInfoCol>
            <Styled.EventInfoCol xs="12" lg="3">
                <Row>
                    <IconSpecial width="24" height="24" viewBox="0 0 24 24" name="time"/>
                    <Styled.EventInfoText>{convertTime(event.startTime)} - {convertTime(event.endTime)}</Styled.EventInfoText>
                </Row>
            </Styled.EventInfoCol>
            <Styled.EventInfoCol xs="12" lg="4">
                <Row>
                    <IconSpecial width="31" height="31" viewBox="0 0 31 31" name="location"/>
                    <Styled.EventInfoText>{event.address}</Styled.EventInfoText>
                </Row>
            </Styled.EventInfoCol>
        </Styled.EventRow>
        <Styled.EventRow>
            <Styled.SectionHeaderText>Contact Us</Styled.SectionHeaderText>
        </Styled.EventRow>
        <Styled.EventRow>
            <Col xs="12" lg="4">
                <Row>
                    <IconSpecial width="24" height="24" viewBox="0 0 24 24" name="email"/>
                    <Styled.ContactText>info@helpingmamas.org</Styled.ContactText>
                </Row>
            </Col>
            <Col xs="12" lg="4">
                <Row>
                    <IconSpecial width="22" height="22" viewBox="0 0 22 22" name="phone"/>
                    <Styled.ContactText>(770) 985-8010</Styled.ContactText>
                </Row>
            </Col>
        </Styled.EventRow>
    </Styled.EventContainer>
    )
}

EventRegisterInfoContainer.propTypes = {
    event: PropTypes.object,
    user: PropTypes.object
};

export default EventRegisterInfoContainer;