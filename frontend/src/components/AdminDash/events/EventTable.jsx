import React, { useState, useEffect } from 'react';
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
                <td>
                  <Styled.Button onClick={() => onEditClicked(event)}>
                    <Icon color="grey3" name="create" />
                  </Styled.Button>
                </td>
                <td>
                  <Styled.Button onClick={() => onDeleteClicked(event)}>
                    <Icon color="grey3" name="delete" />
                  </Styled.Button>
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
  onEditClicked: PropTypes.func,
  onDeleteClicked: PropTypes.func
};

export default EventTable;
