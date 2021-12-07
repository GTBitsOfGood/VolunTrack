import React from 'react';
import PropTypes from 'prop-types';
import * as Table from '../shared/tableStyles';
import Loading from 'components/Shared/Loading';
import { Icon } from 'components/Shared';
import styled from 'styled-components';
import { Button } from 'reactstrap';

const Styled = {
  Button: styled(Button)`
    background: white;
    border: none;
  `
};

const EventTable = ({ events, loading, onEditClicked, onDeleteClicked }) => {
  return (
      <Table.Container>
      <Table.Table>
        <thead>
          <tr>
          <th></th>
            <th>Name</th>
            <th>Date</th>
            <th>Location</th>
            <th>Website</th>
            <th># of Shifts</th>
            <th id="volunteerHeader" style={{visibility:"hidden"}}>Volunteers</th>
          </tr>
        </thead>
        <tbody>
          {!loading &&
            events.map((event, idx) => (
              <EventTableRow
                event={event}
                onEditClicked={onEditClicked}
                onDeleteClicked={onDeleteClicked}
                idx={idx}
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
