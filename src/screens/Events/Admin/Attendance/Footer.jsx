import { useRouter } from "next/router";
import BoGButton from "../../../../components/BoGButton";
import styled from "styled-components";
import PropTypes from "prop-types";

const Styled = {
  Background: styled.div`
    width: 100%;
    height: 6rem;
    margin-top: auto;

    background: white;
  `,
  Container: styled.div`
    margin: 0 auto;
    width: 90vw;
    max-width: 96rem;
    height: 100%;

    padding: 1rem 0;

    display: flex;
    gap: 2rem;
    justify-content: center;
  `,
};

const Footer = ({ endEvent, reopenEvent, event }) => {
  const router = useRouter();

  return (
    <Styled.Background>
      <Styled.Container>
        {event.isEnded ? (
          <BoGButton text="Reopen Event" onClick={reopenEvent} />
        ) : (
          <BoGButton text="End Evnet" onClick={endEvent} />
        )}
        <BoGButton
          onClick={() => router.push(`/events/${event._id}`)}
          text="Visit Event Page"
        />
      </Styled.Container>
    </Styled.Background>
  );
};

export default Footer;

Footer.propTypes = {
  endEvent: PropTypes.func.isRequired,
  reopenEvent: PropTypes.func.isRequired,
  event: PropTypes.object.isRequired,
};
