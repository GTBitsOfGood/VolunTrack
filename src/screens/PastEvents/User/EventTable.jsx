import React from "react";
import PropTypes from "prop-types";
import * as Table from "../../sharedStyles/tableStyles";
import Loading from "../../../components/Loading";
import Icon from "../../../components/Icon";
import styled from "styled-components";
import { Button } from "reactstrap";

const Styled = {
  Button: styled(Button)`
    background: white;
    border: none;
  `,
};

const EventTable = ({ events, loading, user }) => {
  return (
    <Table.Container>
      <Table.Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Date</th>
            <th>Location</th>
            <th>Website</th>
          </tr>
        </thead>
        <tbody>
          {!loading &&
            events.map((event, idx) => (
              <Table.Row key={event._id} evenIndex={idx % 2 === 0}>
                <td>{event.name}</td>
                <td>{event.date}</td>
                <td>{event.location}</td>
                <td>
                  {event.volunteers.length + " / " + event.max_volunteers}
                </td>
              </Table.Row>
            ))}
        </tbody>
      </Table.Table>
      {loading && <Loading />}
    </Table.Container>
  );
};
EventTable.propTypes = {
  loading: PropTypes.bool,
  events: PropTypes.array,
};

export default EventTable;