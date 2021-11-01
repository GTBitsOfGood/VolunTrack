import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button } from 'reactstrap';
import { Icon } from 'components/Shared';
import { fetchEvents } from 'components/AdminDash/queries';
import SettingsEditModal from './SettingsEditModal';

import * as Table from '../shared/tableStyles';

const Styled = {
  Container: styled.div`
    width: 100%;
    height: 100%;
    background: ${props => props.theme.grey9};
    padding-top: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  `,
  HeaderContainer: styled.div`
    width: 95%;
    max-width: 80rem;
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
  `,
  Button: styled(Button)`
    background: white;
    border: none;
  `
};

const SettingsManager = () => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);

  const onRefresh = () => {
    setLoading(true);
    fetchEvents()
      .then(result => {
        if (result && result.data && result.data.events) {
          setEvents(result.data.events);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onCreateClicked = () => {
    setShowEditModal(true);
  };

  const toggleEditModal = () => {
    setShowEditModal(prev => !prev);
    onRefresh();
  };
  useEffect(() => {
    onRefresh();
  }, []);

  return (
    <Styled.Container>
      <Styled.HeaderContainer>
        <Styled.Button onClick={onCreateClicked}>
          <Icon color="grey3" name="add" />
          <span>Edit</span>
        </Styled.Button>
      </Styled.HeaderContainer>
      <SettingsEditModal open={showEditModal} toggle={toggleEditModal} /> 
    </Styled.Container>
  );
};

export default SettingsManager;
