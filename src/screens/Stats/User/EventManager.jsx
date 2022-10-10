import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useSession } from "next-auth/react";
import { Button } from "reactstrap";
import Icon from "../../../components/Icon";
import EventTable from "./EventTable";
import { fetchEventsByUserId, fetchEvents, getCurrentUser } from "../../../actions/queries";
import { updateEvent } from "./eventHelpers";
import variables from "../../../design-tokens/_variables.module.scss";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

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
  Margin: styled.div`
    
  `,
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
  StatImage: styled.div`
    
  `,
  Hours: styled.div`
    margin-bottom: 2rem;
    
  `,
};

const EventManager = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [markDates, setDates] = useState([]);
  const [length, setLength] = useState(0);
  const [sum, setSum] = useState(0);
  const [users, setUser] = useState("loading..");

  if (!user) {
    const { data: session } = useSession();
    user = session.user;
  }

  

  useEffect(() => {
    onRefresh();
  }, []);
  
  const onRefresh = () => {
    setLoading(true);
    //console.log("EVENT MANAGER " + user._id);
    //console.log(user._id)
    //fetchEvents(undefined, new Date().toLocaleDateString("en-US"))
    fetchEventsByUserId(user._id)
      .then((result) => {
        
        if (result && result.data && result.data.event) {
          setEvents(result.data.event);
          setLength(result.data.event.length);
          //console.log(result)
          let i = 0;
          let add = 0;
          for (i = 0; i < result.data.event.length; i++) {
            add += getHours(result.data.event[i].startTime,result.data.event[i].endTime);
          };
          setSum(add);
          

        }
      })
      .finally(() => {
        // events.map((event) => ( {
        //   setSum(sum + 2) 
        // }
        //   //console.log(event.startTime)
          
        // ))
        setLoading(false);
      });

    getCurrentUser(user._id)
    .then((result) => {
        
      if (result) {
        setUser(result.data.result[0].mandatedHours)
        //console.log(result)
      }
    })
    .finally(() => {
      
      
    });

  };

  const getHours = (startTime, endTime) => {
    var timeStart = new Date("01/01/2007 " + startTime);
    var timeEnd = new Date("01/01/2007 " + endTime);
  
    let hours = Math.abs(timeEnd - timeStart) / 36e5;
  
    if (hours < 0) {
      hours = 24 + hours;
    }
    
    return Math.round(hours * 10) / 10.0;
  }

  const [value, setDate] = useState(new Date());

  let splitDate = value.toDateString().split(" ");
  const [dateString, setDateString] = useState(splitDate[1] + " " + splitDate[2] + ", " + splitDate[3]);

  const onRegister = async (event) => {
    const changedEvent = {
      ...event,
      volunteers: event.volunteers.concat(user._id),
    }; // adds userId to event
    const updatedEvent = await registerForEvent({ user, event: changedEvent }); // updates event in backend
    setEvents(events.map((e) => (e._id === event._id ? updatedEvent : e))); // set event state to reflect new event

    onRefresh();
  };

  const onUnregister = async (event) => {
    const changedEvent = {
      // remove current user id from event volunteers
      ...event,
      volunteers: event.volunteers.filter(
        (volunteer) => volunteer !== user._id
      ),
    };
    const updatedEvent = await updateEvent(changedEvent);
    setEvents(events.map((e) => (e._id === event._id ? updatedEvent : e)));

    onRefresh();
  };

  

  return (
    <Styled.Container>
      <Styled.Right>
        <Styled.Header>
        Totals
        </Styled.Header>
        <Styled.Header2>
          MEDALS
        </Styled.Header2>
      <Styled.Box>
          <Styled.BoxInner>
            <Styled.StatText>
              Events Attended
            </Styled.StatText>
            <Styled.StatImage>
            <img
            src="/images/Events Attended - Gold.png"
            alt="helping-mamas-photo"
            width="150px"
            height="150px"
          />
            </Styled.StatImage>
          <Styled.StatText>
          
          {events.length} events
          </Styled.StatText>
          
          </Styled.BoxInner>

          <Styled.BoxInner>
            <Styled.StatText>
              Hours Earned
            </Styled.StatText>
            <Styled.StatImage>
            <img
            src="/images/Hours Earned - Silver.png"
            alt="helping-mamas-photo"
            width="150px"
            height="150px"
          />
            </Styled.StatImage>
          <Styled.StatText>
          
          {sum} hours earned
          </Styled.StatText>
          
          </Styled.BoxInner>



          
          
          </Styled.Box> 
          <Styled.Hours>
          <b>Court Required Hours:</b> &ensp;{users}
          </Styled.Hours>
          <Styled.Header>
        History
        </Styled.Header>
        <Styled.Header2>
          {length} events
        </Styled.Header2>
          <Styled.marginTable>
            <EventTable
              events={events}
              onRegisterClicked={onRegister}
              onUnregister={onUnregister}
              user={user}
            ></EventTable>
          </Styled.marginTable>
      
            <Styled.Margin>
               
            </Styled.Margin>
          </Styled.Right>
          
    </Styled.Container>
  );
};

export default EventManager;
