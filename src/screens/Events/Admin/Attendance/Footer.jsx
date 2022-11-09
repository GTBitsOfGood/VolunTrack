import { useRouter } from "next/router";
import { Button } from "reactstrap";
import styled from "styled-components";
import variables from "../../../../design-tokens/_variables.module.scss";

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
  EndEventButton: styled(Button)`
    width: 100%;
    background: ${variables.primary};
    border: none;
    border-radius: 1rem;
    color: white;

    font-size: 1.5rem;
  `,
  EventPageButton: styled(Button)`
    width: 100%;
    font-size: 1.5rem;
    border-radius: 1rem;
  `,
  ReopenEventButton: styled(Button)`
    width: 100%;
    font-size: 1.5rem;
    border-radius: 1rem;
  `,
};

const Footer = ({ endEvent, reopenEvent, event }) => {
  const router = useRouter();

  return (
    <Styled.Background>
      <Styled.Container>
        {event.isEnded ? (
          <Styled.ReopenEventButton onClick={reopenEvent}>
            Reopen Event
          </Styled.ReopenEventButton>
        ) : (
          <Styled.EndEventButton onClick={endEvent}>
            End Event
          </Styled.EndEventButton>
        )}
        <Styled.EventPageButton
          onClick={() => router.push(`/events/${event._id}`)}
        >
          Visit Event Page
        </Styled.EventPageButton>
      </Styled.Container>
    </Styled.Background>
  );
};

export default Footer;
