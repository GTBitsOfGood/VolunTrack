import React from 'react';
import UserTable from './UserTable';
import styled from 'styled-components';
import { fetchUserManagementData, fetchUserCount } from '../queries';
import { Button } from 'reactstrap';
// import { Button, FormGroup, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
// import { Form, Checkbox } from '../Forms';
import { Icon } from '../../Shared';

const PAGE_SIZE = 10;

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
  PaginationContainer: styled.div`
    background: white;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    height: 3rem;

    p {
      color: ${props => props.theme.grey5};
      margin: 0 1rem;
      font-size: 1.2rem;
    }
  `,
  ButtonContainer: styled.div`
    width: 95%;
    max-width: 80rem;
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
  `,
  Button: styled(Button)`
    background: white;
    border: none;

    ${props => props.disabled && 'background: white !important'}
  `,
  ToBeginningButton: styled(Button)`
    background: white;
    border: none;
    margin-left: auto;
    margin-right: 1rem;
  `
};

class UserManager extends React.Component {
  state = {
    users: [],
    userCount: 0,
    currentPage: 0,
    loadingMoreUsers: false
  };
  componentDidMount = () => this.onRefresh();
  onRefresh = () => {
    this.setState({ loadingMoreUsers: true });
    fetchUserCount().then(result => {
      if (result && result.data && result.data.count) {
        this.setState({
          userCount: result.data.count
        });
      }
    });
    fetchUserManagementData().then(result => {
      if (result && result.data && result.data.users) {
        this.setState({
          users: result.data.users,
          currentPage: 0,
          loadingMoreUsers: false
        });
      }
    });
  };
  onNextPage = () => {
    const { currentPage, users } = this.state;
    if ((currentPage + 1) * PAGE_SIZE === users.length) {
      this.setState({ loadingMoreUsers: true });
      fetchUserManagementData(users[users.length - 1]._id).then(result => {
        if (result && result.data && result.data.users) {
          this.setState({
            users: [...users, ...result.data.users],
            currentPage: currentPage + 1,
            loadingMoreUsers: false
          });
        }
      });
    } else {
      this.setState({
        currentPage: currentPage + 1
      });
    }
  };
  onPreviousPage = () => this.setState({ currentPage: this.state.currentPage - 1 });
  onToBeginning = () => this.setState({ currentPage: 0 });
  getUsersAtPage = () => {
    const { users, currentPage } = this.state;
    const start = currentPage * PAGE_SIZE;
    return users.slice(start, start + PAGE_SIZE);
  };
  atEnd = () => (this.state.currentPage + 1) * PAGE_SIZE >= this.state.userCount;
  onEditUser = editedUser => {
    /** code to update users in state at that specific index */
  };
  render() {
    const { currentPage, loadingMoreUsers } = this.state;
    return (
      <Styled.Container>
        <Styled.ButtonContainer>
          <Styled.Button onClick={this.onRefresh}>
            <Icon color="grey3" name="refresh" />
            <span> Refresh</span>
          </Styled.Button>
          {currentPage > 0 && (
            <Styled.ToBeginningButton onClick={this.onToBeginning}>
              To Beginning
            </Styled.ToBeginningButton>
          )}
          <Styled.PaginationContainer>
            <Styled.Button disabled={currentPage === 0} onClick={this.onPreviousPage}>
              <Icon color={currentPage === 0 ? 'grey7' : 'grey3'} name="left-chevron" />
            </Styled.Button>
            <p>{currentPage + 1}</p>
            <Styled.Button disabled={this.atEnd()} onClick={this.onNextPage}>
              <Icon color={this.atEnd() ? 'grey7' : 'grey3'} name="right-chevron" />
            </Styled.Button>
          </Styled.PaginationContainer>
        </Styled.ButtonContainer>
        <UserTable
          users={this.getUsersAtPage()}
          loading={loadingMoreUsers}
          editUserCallback={this.onEditUser}
        />
      </Styled.Container>
    );
  }
}

export default UserManager;
