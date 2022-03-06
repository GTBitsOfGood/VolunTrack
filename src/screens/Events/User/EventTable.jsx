import { useSession } from "next-auth/react";
import PropTypes from "prop-types";
import React from "react";
import { Button } from "reactstrap";
import styled from "styled-components";
import Icon from "../../../components/Icon";
import * as Table from "../../sharedStyles/tableStyles";

const Styled = {
  Button: styled(Button)`
    background: white;
    border: none;
    color: #000;
    padding: 0;
  `,
  Container: styled.div`
    width: 100%;
    height: 100%;
    margin: auto;
  `,
  ul: styled.ul`
    list-style-type: none;
  `,
  List: styled.li`
    padding-bottom: 120px;
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

const EventTable = ({ events, onRegister, onUnregister }) => {
  const {
    data: { user },
  } = useSession();

  console.log(user);

  return (
    <Styled.Container>
      <Styled.ul>
        {events.map((event) => (
          <Styled.List key={event._id}>
            <Table.EventList>
              <Table.Inner>
                <Table.Slots>SLOTS</Table.Slots>
                <Table.Register>
                  {event.volunteers.includes(user._id) ? (
                    <>
                      <Styled.Button onClick={() => onUnregister(event)}>
                        <Icon color="grey3" name="delete" />
                        <span>Unregister</span>
                      </Styled.Button>
                    </>
                  ) : (
                    <Styled.Button onClick={() => onRegister(event)}>
                      <Icon color="grey3" name="add" />
                      <span>Sign up</span>
                    </Styled.Button>
                  )}
                </Table.Register>
                <Table.Text>
                  <Table.Volunteers>
                    {event.volunteers.length}/{event.max_volunteers}{" "}
                  </Table.Volunteers>
                  <Table.EventName>{event.title}</Table.EventName>
                </Table.Text>
              </Table.Inner>
              <Table.Creation>{event.date.slice(0, 10)}</Table.Creation>
            </Table.EventList>
          </Styled.List>
        ))}
      </Styled.ul>
    </Styled.Container>
  );
};
EventTable.propTypes = {
  events: PropTypes.array,
  onRegister: PropTypes.func,
  onUnregister: PropTypes.func,
};

export default EventTable;
