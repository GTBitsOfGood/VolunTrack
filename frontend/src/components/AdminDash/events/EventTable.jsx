import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as Table from '../shared/tableStyles';
import Loading from 'components/Shared/Loading';
import { Icon } from 'components/Shared';
import styled from 'styled-components';
import { Button } from 'reactstrap';
import EventCreateModal from './EventCreateModal';
import EventTableRow from './EventTableRow';

const Styled = {
  Button: styled(Button)`
    background: white;
    border: none;
  `
};

const EventTable = ({ events, loading, onEditClicked, onDeleteClicked }) => {
  const [showVolunteers, setShowVolunteers] = useState(new Array(events.length).fill(false));

  const updateDropdown = idx => () => {
    setShowVolunteers(volunteers => {
      const newShowVolunteers = volunteers.slice(0);
      newShowVolunteers[idx] = !newShowVolunteers[idx];
      return newShowVolunteers;
    });
  };

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
              <EventTableRow
                event={event}
                onEditClicked={onEditClicked}
                onDeleteClicked={onDeleteClicked}
              />
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
  onEditClicked: PropTypes.func,
  onDeleteClicked: PropTypes.func
};

export default EventTable;
