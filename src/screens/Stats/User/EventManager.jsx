import { useState, useEffect } from "react";
import styled from "styled-components";
import { useSession } from "next-auth/react";
import { Button } from "reactstrap";
import EventTable from "../../../components/EventTable";
import { fetchEventsByUserId, getCurrentUser } from "../../../actions/queries";
import variables from "../../../design-tokens/_variables.module.scss";
import "react-calendar/dist/Calendar.css";
import PropTypes from "prop-types";
import { getHours } from "./hourParsing";

const Styled = {
  Container: styled.div`
    width: 100%;
    height: 100%;
    background: ${(props) => props.theme.grey9};
    padding-top: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  `,
  Image: styled.div`
    width: 100%;
    height: 100%;
  `,
  Left: styled.div`
    margin-left: 10vw;
    display: flex;
    flex-direction: column;
  `,
  Right: styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 0vw;
  `,
  Button: styled(Button)`
    background: ${variables.primary};
    border: none;
    color: white;
    width: 7.5rem;
    height: 3rem;
    margin-top: 2rem;
    margin-bottom: 2vw;

    &:focus {
      background: white;
      outline: none;
      border: none;
    }
  `,
  Events: styled.div`
    text-align: left;
    font-size: 36px;
    font-weight: bold;
  `,
  Margin: styled.div``,
  Content: styled.div`
    width: 60%;
    height: 100%;
    background: ${(props) => props.theme.grey9};
    padding-top: 1rem;
    display: flex;
    flex-direction: row;
    margin: 0 auto;
    align-items: start;
  `,
  Date: styled.div`
    text-align: left;
    font-size: 28px;
    font-weight: bold;
  `,
  DateRow: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
  `,
  Back: styled.p`
    font-size: 14px;
    margin-left: 10px;
    padding-top: 8px;
    text-decoration: underline;
    color: ${variables.primary};
  `,
  Header: styled.div`
    font-size: 27px;
    font-weight: bold;
    padding: 5px;
  `,

  Header2: styled.div`
    font-size: 14px;
    color: gray;
    padding: 5px;
  `,
  marginTable: styled.div`
    margin-left: 0px;
  `,
  Box: styled.div`
    height: 250px;
    width: 725px;
    background-color: white;
    border: 1px solid ${variables["gray-200"]};
    margin-bottom: 10px;
    display: flex;
    flex-direction: row;
    justify-content: left;
    align-items: center;
  `,
  BoxInner: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    padding: 5px;
    padding-left: 20px;
  `,
  StatText: styled.div`
    font-weight: bold;
    font-size: 20px;
    text-align: center;
    padding: 3px;
  `,
  StatImage: styled.div``,
  Hours: styled.div`
    margin-bottom: 2rem;
  `,
};

const EventManager = ({ userId }) => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [length, setLength] = useState(0);
  const [sum, setSum] = useState(0);
  const [users, setUser] = useState("loading..");
  const [attend, setAttend] = useState("Bronze");
  const [earn, setEarn] = useState("Bronze");

  if (!userId) {
    console.log("here" + userId)
    const { data: session } = useSession();
    userId = session.user._id;
  }

  useEffect(() => {
    onRefresh();
  }, []);

  const onRefresh = () => {
    setLoading(true);
    console.log(userId)
    fetchEventsByUserId(userId)
      .then((result) => {


        if (result && result.data && result.data.event) {
          setEvents(result.data.event);
          setLength(result.data.event.length);

          if (result.data.event.length > 1) {
            setAttend("Silver");
          }
          if (result.data.event.length > 3) {
            setAttend("Gold");
          }
          let add = 0;
          // HAVE TO FIX THIS 
          for (let i = 0; i < result.data.event.length; i++) {
            if (result.data.event[i].timeCheckedOut != null) {
              add += getHours(
                result.data.event[i].timeCheckedIn.slice(11, 16),
                result.data.event[i].timeCheckedOut.slice(11, 16)
              );
            }  
          }
          setSum(add);
          if (add >= 7) {
            setEarn("Silver");
          }
          if (add >= 14) {
            setEarn("Gold");
          }
        }
      })
      .finally(() => {
        setLoading(false);
      });

    getCurrentUser(userId)
      .then((result) => {
        if (result) {
          setUser(result.data.result[0].mandatedHours);
        }
      })
      .finally(() => {});
  };
  return (
    <Styled.Container>
      <Styled.Right>
        <Styled.Header>Totals</Styled.Header>
        <Styled.Header2>MEDALS</Styled.Header2>
        <Styled.Box>
          <Styled.BoxInner>
            <Styled.StatText>Events Attended</Styled.StatText>
            <Styled.StatImage>
              {loading ? (
                "Loading... "
              ) : (
                <img
                  src={"/images/Events Attended - " + attend + ".png"}
                  alt="helping-mamas-photo"
                  width="150px"
                  height="150px"
                />
              )}
            </Styled.StatImage>
            <Styled.StatText>{events.length} events</Styled.StatText>
          </Styled.BoxInner>

          <Styled.BoxInner>
            <Styled.StatText>Hours Earned</Styled.StatText>
            <Styled.StatImage>
              {loading ? (
                "Loading... "
              ) : (
                <img
                  src={"/images/Hours Earned - " + earn + ".png"}
                  id="earned"
                  alt="helping-mamas-photo"
                  width="150px"
                  height="150px"
                />
              )}
            </Styled.StatImage>
            <Styled.StatText>{Math.round(sum * 10) / 10} hours</Styled.StatText>
          </Styled.BoxInner>
        </Styled.Box>
        <Styled.Hours>
          <b>Court Required Hours:</b> &ensp;{users}
        </Styled.Hours>
        <Styled.Header>History</Styled.Header>
        <Styled.Header2>{length} events</Styled.Header2>
        <Styled.marginTable>
          <EventTable events={events} isVolunteer={true} />
        </Styled.marginTable>

        <Styled.Margin></Styled.Margin>
      </Styled.Right>
    </Styled.Container>
  );
};
EventManager.propTypes = {
  user: PropTypes.object,
};

export default EventManager;
