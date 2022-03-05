import { useSession } from "next-auth/react";
import Error from "next/error";
import React from "react";
import { Button } from "reactstrap";
import styled from "styled-components";
import { fetchUserCount, fetchUserManagementData } from "../../actions/queries";
import Icon from "../../components/Icon";
import UserTable from "./UserTable";
import ReactSearchBox from "react-search-box";

const PAGE_SIZE = 10;

const Styled = {
  Container: styled.div`
    width: 100%;
    height: 100%;
    background: ${(props) => props.theme.grey9};
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
      color: ${(props) => props.theme.grey5};
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
    color: black;
    &:hover {
      background: gainsboro;
    }
    &:focus {
      background: white;
      box-shadow: none;
    }
    ${(props) => props.disabled && "background: white !important"}
  `,
  ToBeginningButton: styled(Button)`
    background: white;
    border: none;
    margin-left: auto;
    margin-right: 1rem;
    color: black;
  `,
  SearchBox: styled.div`
    position: absolute;
    left: 75px;
    top: 150px;
  `,
  Text: styled.div`
    color: #000000;
    position: absolute;
    width: 184px;
    height: 41px;
    left: 75px;
    top: 119px;
    font-style: normal;
    font-weight: bold;
    font-size: 32px;
    line-height: 41px;
  `,
};

function authWrapper(Component) {
  return function WrappedComponent(props) {
    const {
      data: { user },
    } = useSession();
    if (user.role !== "admin") {
      return (
        <Error
          title="You are not authorized to access this page"
          statusCode={403}
        />
      );
    } else {
      return <Component {...props} user={user} />;
    }
  };
}

class UserManager extends React.Component {
  state = {
    users: [],
    userCount: 0,
    currentPage: 0,
    loadingMoreUsers: false,
  };

  componentDidMount = () => this.onRefresh();
  onRefresh = () => {
    this.setState({ loadingMoreUsers: true });
    fetchUserCount().then((result) => {
      if (result && result.data && result.data.count) {
        this.setState({
          userCount: result.data.count,
        });
      }
    });
    fetchUserManagementData().then((result) => {
      if (result && result.data && result.data.users) {
        this.setState({
          users: result.data.users,
          currentPage: 0,
          loadingMoreUsers: false,
        });
      }
    });
  };
  onNextPage = () => {
    const { currentPage, users } = this.state;
    if ((currentPage + 1) * PAGE_SIZE === users.length) {
      this.setState({ loadingMoreUsers: true });
      fetchUserManagementData(users[users.length - 1]._id).then((result) => {
        if (result && result.data && result.data.users) {
          this.setState({
            users: [...users, ...result.data.users],
            currentPage: currentPage + 1,
            loadingMoreUsers: false,
          });
        }
      });
    } else {
      this.setState({
        currentPage: currentPage + 1,
      });
    }
  };
  onPreviousPage = () =>
    this.setState({ currentPage: this.state.currentPage - 1 });
  onToBeginning = () => this.setState({ currentPage: 0 });
  getUsersAtPage = () => {
    const { users, currentPage } = this.state;
    const start = currentPage * PAGE_SIZE;
    return users.slice(start, start + PAGE_SIZE);
  };
  onChangeSearch = (record) => {
    const { users, currentPage } = this.state;
    this.setState({
      users: users.filter((user) => user.name.includes(record)),
    });
  };
  atEnd = () =>
    (this.state.currentPage + 1) * PAGE_SIZE >= this.state.userCount;
  onEditUser = () => {
    /** code to update users in state at that specific index */
  };
  render() {
    const { currentPage, loadingMoreUsers } = this.state;
    return (
      <Styled.Container>
        <Styled.Text>Volunteers</Styled.Text>
        Total Volunteers: {this.getUsersAtPage().length}
        <Styled.SearchBox>
          <ReactSearchBox
            placeholder="Search Name"
            value="Doe"
            data={this.getUsersAtPage()}
            onChange={(record) => this.onChangeSearch(record)}
          />
        </Styled.SearchBox>
        <UserTable
          users={this.getUsersAtPage()}
          loading={loadingMoreUsers}
          editUserCallback={this.onEditUser}
        />
      </Styled.Container>
    );
  }
}

export default authWrapper(UserManager);
