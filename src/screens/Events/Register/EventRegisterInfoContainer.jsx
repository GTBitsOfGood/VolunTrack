import styled from "styled-components";
import { Row, Col, Container } from "reactstrap";
import IconSpecial from "../../../components/IconSpecial";
import Link from "next/link";
import PropTypes from "prop-types";
import variables from "../../../design-tokens/_variables.module.scss";

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
    text-align: left;
    overflow-wrap: break-word;
  `,
  EventRow: styled(Row)`
    margin: 0 1rem 0 1rem;
  `,
  EventRowHeader: styled.div`
    margin: 1rem 1rem 0 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
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
  LinkedText: styled.p`
    color: ${variables["primary"]};
    font-size: 0.9rem;
    font-weight: 900;
    text-align: left;
    text-decoration: underline;
    padding-top: 0.4rem;
    overflow-wrap: break-word;
  `,
};

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

const EventRegisterInfoContainer = ({ event, user, eventId }) => {
  // const { email = "", phone_number = "" } = user?.bio ?? {};

  if (!event || !event.date) {
    return <div />;
  }

  return (
    <Styled.EventContainer>
      <Styled.EventRowHeader>
        <Styled.EventTitleText>{event.title}</Styled.EventTitleText>
        <Link href={`/events/${eventId}`}>
          <Styled.LinkedText style={{ cursor: "pointer" }}>
            See Full Event Information
          </Styled.LinkedText>
        </Link>
      </Styled.EventRowHeader>
      <Styled.EventRow>
        {event.isValidForCourtHours && (
          <Styled.DetailText>
            This event can count toward court required hours
          </Styled.DetailText>
        )}
      </Styled.EventRow>
      <Styled.EventRow>
        <Styled.EventInfoCol xs="12" lg="3">
          <Row>
            <IconSpecial
              width="31"
              height="31"
              viewBox="0 0 31 31"
              name="date"
            />
            <Styled.EventInfoText>
              {event.date.slice(0, 10)}
            </Styled.EventInfoText>
          </Row>
        </Styled.EventInfoCol>
        <Styled.EventInfoCol xs="12" lg="3">
          <Row>
            <IconSpecial
              width="24"
              height="24"
              viewBox="0 0 24 24"
              name="time"
            />
            <Styled.EventInfoText>
              {convertTime(event.startTime)} - {convertTime(event.endTime)}{" "}
            </Styled.EventInfoText>
            <Styled.DetailText>&nbsp; {event.localTime}</Styled.DetailText>
          </Row>
        </Styled.EventInfoCol>
        <Styled.EventInfoCol xs="12" lg="4">
          <Row>
            <IconSpecial
              width="31"
              height="31"
              viewBox="0 0 31 31"
              name="location"
            />
            <Styled.EventInfoText>
              {event.address}, {event.city}, {event.state}, {event.zip}
            </Styled.EventInfoText>
          </Row>
        </Styled.EventInfoCol>
      </Styled.EventRow>
      <Styled.EventRow>
        <Styled.SectionHeaderText>Contact Us</Styled.SectionHeaderText>
      </Styled.EventRow>
      <Styled.EventRow>
        <Col xs="12" lg="4">
          <Row>
            <IconSpecial
              width="24"
              height="24"
              viewBox="0 0 24 24"
              name="email"
            />
            <Styled.ContactText>{event.eventContactEmail}</Styled.ContactText>
          </Row>
        </Col>
        <Col xs="12" lg="4">
          <Row>
            <IconSpecial
              width="22"
              height="22"
              viewBox="0 0 22 22"
              name="phone"
            />
            <Styled.ContactText>{event.eventContactPhone}</Styled.ContactText>
          </Row>
        </Col>
      </Styled.EventRow>
    </Styled.EventContainer>
  );
};

EventRegisterInfoContainer.propTypes = {
  event: PropTypes.object,
  user: PropTypes.object,
  eventId: PropTypes.string,
  confirmRegPage: PropTypes.bool,
};

export default EventRegisterInfoContainer;