import React from "react";
import PropTypes from "prop-types";
import * as Table from "../../sharedStyles/tableStyles";
import Icon from "../../../components/Icon";
import styled from "styled-components";
import { Button } from "reactstrap";

const Styled = {
  Button: styled(Button)`
    background: white;
    border: none;
  `,
  Container: styled.div`
  width: 100%;
  height:100%;
  margin:auto;
  `,
  ul: styled.ul`
    list-style-type:none;
  `,
  List: styled.li`
    padding-bottom:120px;
  `,
};

const convertTime = (time) => {
  let [hour, min] = time.split(':');
  let hours = parseInt(hour);
  let suffix = time[-2];
  if (!(suffix in ['pm', 'am', 'PM', 'AM'])) {
    suffix = (hours > 11)? 'pm': 'am';
  }
  hours = ((hours + 11) % 12 + 1);
  return hours.toString()+':'+min+suffix;
}

const EventTable = ({ events, onRegister, onUnregister, user}) => {
  return (
    <Styled.Container>
      <Styled.ul>
        {events.map((event) => (
          <Styled.List>
            <Table.EventList>
              <Table.Inner>
                <Table.Slots>SLOTS</Table.Slots>
                <Table.Register>
                  <Styled.Button onClick={() => onRegister(event)}>
                    <Icon color="grey3" name="add" />
                    <span>Sign up</span>
                  </Styled.Button>
                </Table.Register>
                <Table.Text>
                  <Table.Volunteers>{event.volunteers.length}/{event.max_volunteers}          </Table.Volunteers>
                  <Table.EventName>{event.title}</Table.EventName>
                  {event.shifts.map((shift) => (
                    <Table.Time>{convertTime(shift.start_time)} - {convertTime(shift.end_time)}</Table.Time>
                  ))}
                  
                </Table.Text>
              </Table.Inner>
              <Table.Creation>{event.date.slice(0,10)}</Table.Creation>
            </Table.EventList>
          </Styled.List>
        ))}
      </Styled.ul>
    </Styled.Container>
  );
};
EventTable.propTypes = {
  events:PropTypes.Array,
  onEditClicked: PropTypes.func,
  onDeleteClicked: PropTypes.func,
}

export default EventTable;
