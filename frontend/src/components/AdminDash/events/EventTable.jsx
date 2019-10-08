import React from 'react';
import styled from 'styled-components';
import * as Table from '../shared/tableStyles';
import Loading from 'components/Shared/Loading';

const EventTable = ({ events }) => {
  return (
    <Table.Container>
      <Table.Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Date</th>
            <th>Location</th>
            <th># of Volunteers</th>
          </tr>
        </thead>
        <tbody>
          {events &&
            events.map((event, idx) => (
              <Table.Row key={event._id} evenIndex={idx % 2 === 0}>
                <td>{event.name}</td>
                <td>{event.date}</td>
                <td>{event.location}</td>
                <td>{event.volunteers.length + ' / ' + event.max_volunteers}</td>
              </Table.Row>
            ))}
        </tbody>
      </Table.Table>
      {!events && <Loading />}
    </Table.Container>
  );
};

export default EventTable;
