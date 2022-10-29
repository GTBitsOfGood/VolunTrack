import { useSession } from "next-auth/react";
import Error from "next/error";
import React from "react";
import { Button } from "reactstrap";
import styled from "styled-components";
import {
  fetchUserCount,
  fetchUserManagementData,
  updateUser,
} from "../../actions/queries";
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
    position: relative;
    left: 10%;
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
  TableUsers: styled.div`
    width: 80%;
  `,
  TotalVols: styled.div`
    font-style: normal;
    font-weight: bold;
    font-size: 14px;
    line-height: 19px;
    margin-top: 0.3rem;
  `,
  Text: styled.div`
    color: #000000;
    width: 184px;
    font-style: normal;
    font-weight: bold;
    font-size: 32px;
    line-height: 41px;
  `,
  Search: styled.input`
    height: 2rem;
    width: 85%;
    margin-right: 1rem;
    margin-bottom: 1rem;
    padding: 0 0.5rem;
    font-size: 1rem;
    border: 1px solid lightgray;
    border-radius: 0.5rem;
  `,
  TopMenu: styled.div`
    display: flex;
    flex-direction: row;
    margin-top: 0.7rem;
    width: 80%;
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
    searchValue: "",
    searchOn: false,
    searchArray: [],
  };

  componentDidMount = () => this.onRefresh();
  onRefresh = async () => {
    this.setState({ loadingMoreUsers: true });
    fetchUserCount().then((result) => {
      if (result && result.data && result.data.count) {
        this.setState({
          userCount: result.data.count,
        });
      }
    });
    let result = await fetchUserManagementData();
    if (result && result.data && result.data.users) {
      console.log("fetchUserManagementData");
      console.log(result.data.users);
      this.setState({
        users: result.data.users.filter((user) => user.role === "volunteer"),
        currentPage: 0,
        loadingMoreUsers: false,
      });
    }
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
    // const start = currentPage * PAGE_SIZE;
    return users; //.slice(start, start + PAGE_SIZE);
  };
  onChangeSearch = (record) => {
    const { users, currentPage } = this.state;
    fetchUserManagementData().then((result) => {
      this.setState({
        users: result.data.users.filter((user) =>
          user.name.toLowerCase().includes(record.toLowerCase())
        ),
      });
    });
  };
  atEnd = () =>
    (this.state.currentPage + 1) * PAGE_SIZE >= this.state.userCount;
  onEditUser = (updatedUser) => {
    console.log(updatedUser);
    /** code to update users in state at that specific index */
    updateUser(updatedUser);
  };
  filteredAndSortedVolunteers = () => {
    const filterArray = this.state.users.filter(
      (user) =>
        user.name
          ?.toLowerCase()
          .includes(this.state.searchValue.toLowerCase()) ||
        user.email?.toLowerCase().includes(this.state.searchValue.toLowerCase())
    );
    return filterArray;
  };
  render() {
    const { currentPage, loadingMoreUsers, searchValue } = this.state;
    return (
      <Styled.Container>
        <Styled.Text>Volunteers</Styled.Text>
        <Styled.TopMenu>
          <Styled.Search
            placeholder="Search Name"
            value={searchValue}
            onChange={(evt) =>
              this.setState({ searchValue: evt.target.value, searchOn: true })
            }
          />
          <Styled.TotalVols>
            Total Volunteers: {this.getUsersAtPage().length}
          </Styled.TotalVols>
        </Styled.TopMenu>
        <Styled.TableUsers>
          <UserTable
            users={
              this.state.searchOn
                ? this.filteredAndSortedVolunteers()
                : this.getUsersAtPage()
            }
            loading={loadingMoreUsers}
            editUserCallback={this.onEditUser}
          />
        </Styled.TableUsers>
      </Styled.Container>
    );
  }
}

export default authWrapper(UserManager);
