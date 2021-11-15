import React from 'react';
import { roles, statuses, mandated } from '../applicantInfoHelpers';
import { Button, ModalHeader, ModalBody, ModalFooter, Modal } from 'reactstrap';
import Loading from '../../Shared/Loading';
import PropTypes from 'prop-types';
import * as Table from '../shared/tableStyles';
import * as Form from '../shared/formStyles';

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
      <Table.Container>
        <Table.Table>
          <tbody>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Mandated</th>
            </tr>
            {!loading &&
              users.map((user, index) => (
                <Table.Row
                  key={index}
                  evenIndex={index % 2 === 0}
                  onClick={() => this.onDisplayEditUserModal(user)}
                >
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{roles[user.role]}</td>
                  <td>{statuses[user.status]}</td>
                  <td>{mandated[user.mandated]}</td>
                </Table.Row>
              ))}
          </tbody>
        </Table.Table>
        {loading && <Loading />}
        <Modal isOpen={this.state.userSelectedForEdit} onClose={null}>
          <ModalHeader>Edit User</ModalHeader>
          <ModalBody>
            <form>
              <Form.FormGroup>
                <Form.Label>Name</Form.Label>
                <Form.Input
                  defaultValue={
                    this.state.userSelectedForEdit ? this.state.userSelectedForEdit.name : ''
                  }
                  type="text"
                  name="Name"
                />
                <Form.Label>Email</Form.Label>
                <Form.Input
                  defaultValue={
                    this.state.userSelectedForEdit ? this.state.userSelectedForEdit.email : ''
                  }
                  type="text"
                  name="Email"
                />
                <Form.Label>Role</Form.Label>
                <Form.Dropdown
                  defaultValue={
                    this.state.userSelectedForEdit ? this.state.userSelectedForEdit.role : ''
                  }
                  type="select"
                  name="roleSelected"
                >
                  {Object.keys(roles).map((t, i) => (
                    <option value={t}>{keyToValue(t)}</option>
                  ))}
                </Form.Dropdown>
                <Form.Label>Status</Form.Label>
                <Form.Dropdown
                  defaultValue={
                    this.state.userSelectedForEdit ? this.state.userSelectedForEdit.status : ''
                  }
                  type="select"
                  name="statusSelected"
                >
                  {Object.keys(statuses).map((t, i) => (
                    <option value={t}>{keyToValue(t)}</option>
                  ))}
                </Form.Dropdown>
                <Form.Label>Mandated Hours</Form.Label>
                <Form.Dropdown
                  defaultValue={
                    this.state.userSelectedForEdit ? this.state.userSelectedForEdit.mandated : ''
                  }
                  type="select"
                  name="mandatedSelected"
                >
                  {Object.keys(mandated).map((t, i) => (
                    <option value={t}>{keyToValue(t)}</option>
                  ))}
                </Form.Dropdown>
                <Form.Label>Number of Mandated Hours</Form.Label>
                <Form.Input
                  defaultValue={
                    this.state.userSelectedForEdit ? this.state.userSelectedForEdit.mandatedHours : '0'
                  }
                  type="text"
                  name="mandatedHours"
                />
              </Form.FormGroup>
            </form>
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
        </Modal>
      </Table.Container>
    );
  }
}

export default UserTable;

UserTable.propTypes = {
  users: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  editUserCallback: PropTypes.func.isRequired
};
