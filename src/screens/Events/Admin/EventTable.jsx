import React from "react";
import PropTypes from "prop-types";
import * as Table from "../../sharedStyles/tableStyles";
import styled from "styled-components";
import { Button } from "reactstrap";
import Icon from "../../../components/Icon";

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

const EventTable = ({ events, onEditClicked, onDeleteClicked}) => {
  return (
    <Styled.Container>
      <Styled.ul>
        {events.map((event) => (
          <Styled.List>
            <Table.EventList>
              <Table.Inner>
                <Table.Slots>SLOTS</Table.Slots>
                <Table.Edit>
                  <Styled.Button onClick={() => onEditClicked(event)}>
                    <Icon color="grey3" name="create" />
                  </Styled.Button>
                </Table.Edit>
                <Table.Delete>
                  <Styled.Button onClick={() => onDeleteClicked(event)}>
                    <Icon color="grey3" name="delete" />
                  </Styled.Button>
                </Table.Delete>
                <Table.Text>
                  <Table.EventName>{event.title}</Table.EventName>
                  <Table.Volunteers>{event.volunteers.length}/{event.max_volunteers}          </Table.Volunteers>
                  <Table.Time>{convertTime(event.startTime)} - {convertTime(event.endTime)}</Table.Time>
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
