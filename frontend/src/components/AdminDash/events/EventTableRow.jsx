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

const EventTableRow = ({ event, onEditClicked, onDeleteClicked }) => {
  const [showVolunteers, setShowVolunteers] = useState(false);

  const updateDropdown = () => {
    setShowVolunteers(!showVolunteers);
  };

  return (
    <Table.Row key={event._id}>
      <td>
        <Styled.Button onClick={updateDropdown}>
          <Icon color="grey3" name={showVolunteers ? 'dropdown-arrow' : 'right-chevron'} />
        </Styled.Button>
      </td>
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
      <td>{event.volunteers}</td>
    </Table.Row>
  );
};

export default EventTableRow;
