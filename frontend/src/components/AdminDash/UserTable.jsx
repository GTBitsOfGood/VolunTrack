import React from 'react';
import styled from 'styled-components';
import { roles, statuses } from './applicantInfoHelpers';
import {
  Button,
  FormGroup,
  Modal,
  ModalHeader,
  ModalBody,
  Input,
  Label,
  ModalFooter
} from 'reactstrap';
import { Form } from '../Forms';
import Loading from '../Shared/Loading';
import PropTypes from 'prop-types';

const Styled = {
  Container: styled.div`
    background: white;
    width: 95%;
    max-width: 80rem;
    border-radius: 0.5rem;
    padding: 1rem;
    border: 0.1rem solid ${props => props.theme.grey9};
  `,
  Table: styled.table`
    width: 100%;

    th {
      color: ${props => props.theme.primaryGrey};
      font-size: 1.2rem;
    }
    th,
    td {
      padding: 1.5rem;
    }
  `,
  Row: styled.tr`
    ${props => props.evenIndex && 'background: #F7F7F7'};
    cursor: pointer;
  `,
  LoadingBody: styled.div`
    height: 39rem;
    width: 100%;
    display: flex;
    align-items: center;
  `,
  TextBox: styled(Input)`
    border: 1px solid ${props => props.theme.grey8};
    border-radius: 0.5rem 0.5rem 0.5rem 0.5rem;
    margin-bottom: 1rem;
    margin-top: 0.1rem;
  `,

  Label: styled(Label)`
    padding-left: 0.2rem;
    font-weight: bold;
    color: props.theme.primaryGrey;
  `,

  FormGroup: styled(FormGroup)`
    width: 80%;
  `,

  Dropdown: styled(Input)`
    border: 1px solid ${props => props.theme.grey8};
    border-radius: 0.5rem 0.5rem 0.5rem 0.5rem;
    margin-bottom: 0.5rem;
    padding-left: 0.5rem;
  `
};

const keyToValue = key => {
  key = key.replace(/_/g, ' ');
  key = key
    .toLowerCase()
    .split(' ')
    .map(s => s.charAt(0).toUpperCase() + s.substring(1))
    .join(' ');
  return key;
};

class UserTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userSelectedForEdit: null
    };
  }
  onDisplayEditUserModal = userToEdit => {
    console.log(userToEdit);
    this.setState({
      userSelectedForEdit: userToEdit
    });
  };

  onModalClose = updatedUser => {
    if (updatedUser) {
      this.props.editUserCallback(updatedUser);
    }
    this.setState({
      userSelectedForEdit: null
    });
  };
  render() {
    const { users, loading } = this.props;
    return (
      <Styled.Container>
        <Styled.Table>
          <tbody>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
            {!loading &&
              users.map((user, index) => (
                <Styled.Row
                  key={index}
                  evenIndex={index % 2 === 0}
                  onClick={() => this.onDisplayEditUserModal(user)}
                >
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{roles[user.role]}</td>
                  <td>{statuses[user.status]}</td>
                </Styled.Row>
              ))}
          </tbody>
        </Styled.Table>
        {loading && <Loading />}
        <Modal isOpen={this.state.userSelectedForEdit} onClose={null}>
          <ModalHeader>Edit User</ModalHeader>
          <Form>
            {/* onSubmit=
            {values => {
              this.onModalClose(values);
            }} */}
            <ModalBody>
              <Styled.FormGroup>
                <Styled.Label>Name</Styled.Label>
                <Styled.TextBox
                  defaultValue={
                    this.state.userSelectedForEdit ? this.state.userSelectedForEdit.name : ''
                  }
                  type="text"
                  name="Name"
                />
                <Styled.Label>Email</Styled.Label>
                <Styled.TextBox
                  defaultValue={
                    this.state.userSelectedForEdit ? this.state.userSelectedForEdit.email : ''
                  }
                  type="text"
                  name="Email"
                />
                <Styled.Label>Role</Styled.Label>
                <Styled.Dropdown
                  defaultValue={
                    this.state.userSelectedForEdit ? this.state.userSelectedForEdit.role : ''
                  }
                  type="select"
                  name="roleSelected"
                >
                  {Object.keys(roles).map((t, i) => (
                    <option value={t}>{keyToValue(t)}</option>
                  ))}
                </Styled.Dropdown>
                <Styled.Label>Status</Styled.Label>
                <Styled.Dropdown
                  defaultValue={
                    this.state.userSelectedForEdit ? this.state.userSelectedForEdit.status : ''
                  }
                  type="select"
                  name="statusSelected"
                >
                  {Object.keys(statuses).map((t, i) => (
                    <option value={t}>{keyToValue(t)}</option>
                  ))}
                </Styled.Dropdown>
              </Styled.FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={this.onModalClose}>
                Cancel
              </Button>
              <Button color="primary" onClick={this.onModalClose}>
                Submit
              </Button>
              {/* <Button color="primary" type="submit">
                Submit
              </Button> */}
            </ModalFooter>
          </Form>
        </Modal>
        );
        {/* export default Filters;

Filters.propTypes = {
  show: PropTypes.bool.isRequired,
  toggleCallback: PropTypes.func.isRequired,
  submitCallback: PropTypes.func.isRequired,
  appliedFilters: PropTypes.object
}; */}
      </Styled.Container>
    );
  }
}

export default UserTable;

UserTable.propTypes = {
  users: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  editUserCallback: PropTypes.func.isRequired
};
