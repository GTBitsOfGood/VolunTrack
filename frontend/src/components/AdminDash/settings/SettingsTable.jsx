import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as Table from '../shared/tableStyles';
import Loading from 'components/Shared/Loading';
import { Icon } from 'components/Shared';
import styled from 'styled-components';
import { Button } from 'reactstrap';
import { bindActionCreators } from 'redux';
import { getCurrentUser } from 'components/AdminDash/queries';

const Styled = {
  Button: styled(Button)`
    background: white;
    border: none;
  `
};

const SettingsTable = ({ user, loading }) => {
  return (
    <Table.Container>
      <Table.Table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Phone Number</th>
          </tr>
        </thead>
        <tbody>
            {!loading &&
              <Table.Row key={user.bio.first_name}>
                <td>{user.bio.first_name}</td>
                <td>{user.bio.last_name}</td>
                <td>{user.bio.phone_number}</td>
                <td>Show file names</td >
              </Table.Row>
            }
        </tbody>
      </Table.Table>
      {loading && <Loading />}
    </Table.Container>
  );
};
SettingsTable.propTypes = {
  loading: PropTypes.bool,
  users: PropTypes.array,
  onEditClicked: PropTypes.func,
  onDeleteClicked: PropTypes.func
};

export default SettingsTable;
