import React from 'react';
import PropTypes from 'prop-types';
import * as Table from '../shared/tableStyles';
import Loading from 'components/Shared/Loading';

const EventTable = ({ events, loading }) => {
  return (
    <Table.Container>
      <Table.Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Date</th>
            <th>Location</th>
            <th>Website</th>
            <th># of Volunteers</th>
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
                  {event.external_links && event.external_links.length ? (
                    <a href={event.external_links[0]} target="_blank" rel="noopener noreferrer">
                      {event.external_links[0]}
                    </a>
                  ) : (
                    'N/A'
                  )}
                </td>
                <td>{event.volunteers.length + ' / ' + event.max_volunteers}</td>
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
  events: PropTypes.array
};

export default EventTable;
