import React, { useState } from "react";
import * as Table from "../../sharedStyles/tableStyles";
import Icon from "../../../components/Icon";
import styled from "styled-components";
import { Button } from "reactstrap";
import { fetchVolunteers } from "../../../actions/queries";

const Styled = {
  Button: styled(Button)`
    background: white;
    border: none;
  `,
};

const EventTableRow = ({ event, onEditClicked, onDeleteClicked, idx }) => {
  const [showVolunteers, setShowVolunteers] = useState(false);
  const [currentVolunteers, setCurrentVolunteers] = useState([]);

  const handleDropdownClick = () => {
    if (
      document.getElementById("volunteerHeader").style.visibility == "visible"
    ) {
      document.getElementById("volunteerHeader").style.visibility = "hidden";
    } else {
      document.getElementById("volunteerHeader").style.visibility = "visible";
    }

    setShowVolunteers(!showVolunteers);
    fetchVolunteers(event.volunteers)
      .then((result) => {
        if (result && result.data && result.data.users) {
          setCurrentVolunteers(result.data.users);
        }
      })
      .finally(() => {});
  };

  // must fix tr inside of tr
  // this should be resolved later as the current ui layout is also incorrect
  return (
    <Table.Row key={event._id} evenIndex={idx % 2 === 0}>
      <td>
        <Styled.Button onClick={handleDropdownClick}>
          <Icon
            color="grey3"
            name={showVolunteers ? "dropdown-arrow" : "right-chevron"}
          />
        </Styled.Button>
      </td>
      <td>{event.name}</td>
      <td>{event.date.slice(0,10)}</td>
      <td>{event.location}</td>
      <td>{event.shifts.length}</td>
      {showVolunteers &&
        currentVolunteers.map((volunteer, idx) => (
          <tr key={idx}>
            <td> {volunteer.bio.first_name}</td>
            <td> {volunteer.bio.last_name}</td>
          </tr>
        ))}

      
      {event.shifts.map((shift, idx) => (
        <tr key="idx">
          <td>Shift {idx + 1} </td>
          <td>Start Time: {shift.start_time}</td>
          <td>End Time: {shift.end_time}</td>
          <td>Max Volunteers: {shift.max_volunteers}</td>
        </tr>
      ))}
    </Table.Row>
  );
};

export default EventTableRow;
