import React from "react";
import PropTypes from "prop-types";
import * as Table from "../../sharedStyles/tableStyles";
import styled from "styled-components";
import { Button } from "reactstrap";
import Icon from "../../../components/Icon";
import Link from "next/link";

const Styled = {
  Button: styled(Button)`
    background: white;
    border: none;
    z-index: 1;
  `,
  Container: styled.div`
    width: 100%;
    height: 100%;
    margin: auto;
  `,
  ul: styled.div`
    list-style-type: none;
    display: flex;
    flex-direction: column;
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

const getMinorTotal = (minors) => {
  let total = 0;
  minors.forEach((minorObj) => {
    total += minorObj.minor.length;
  });
  return total;
};

const EventTable = ({ events, onEditClicked, onDeleteClicked }) => {
  return (
    <Styled.Container>
      <Styled.ul>
        {events.map((event) => (
          <Styled.List key={event._id}>
            <Link href={`events/${event._id}`}>
              <Table.EventList>
                <Table.Inner>
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
                  <Table.TextInfo>
                    <Table.TitleAddNums>
                      <Table.EventName>{event.title}</Table.EventName>
                      <Table.Volunteers>
                        {" "}
                        {event.max_volunteers -
                          event.volunteers.length +
                          getMinorTotal(event.minors)}{" "}
                        slots available
                      </Table.Volunteers>
                    </Table.TitleAddNums>
                    <Table.Time>
                      {convertTime(event.startTime)} -{" "}
                      {convertTime(event.endTime)} EST
                    </Table.Time>
                  </Table.TextInfo>
                </Table.Inner>
                <Table.Creation>
                  {event.date.slice(5, 7)}/{event.date.slice(8, 10)}/
                  {event.date.slice(0, 4)}{" "}
                </Table.Creation>
              </Table.EventList>
            </Link>
          </Styled.List>
        ))}
      </Styled.ul>
    </Styled.Container>
  );
};
EventTable.propTypes = {
  events: PropTypes.Array,
  onEditClicked: PropTypes.func,
  onDeleteClicked: PropTypes.func,
};

export default EventTable;
