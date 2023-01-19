import { useSession } from "next-auth/react";
import Error from "next/error";
import React from "react";
import { Button } from "reactstrap";
import styled from "styled-components";
import {
  deleteUser,
  fetchUserCount,
  fetchUserManagementData,
  updateUser,
} from "../../actions/queries";
import VolunteerTable from "./VolunteerTable";
import { CSVLink } from "react-csv";

// const PAGE_SIZE = 3;

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
  Text: styled.p`
    color: #000000;
    font-style: normal;
    font-weight: bold;
    font-size: 32px;
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
  HeaderTitle: styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  `,
  CSVLink: styled(CSVLink)`
    position: relative;
    height: 2.5rem;
    right: 20%;
    text-align: center;
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

class Volunteers extends React.Component {
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
      this.setState({
        users: result.data.users.filter((user) => user.role === "volunteer"),
        currentPage: 0,
        loadingMoreUsers: false,
      });
    }
  };

  onEditUser = (updatedUser) => {
    /** code to update users in state at that specific index */
    updateUser(
      updatedUser.email,
      updatedUser.first_name,
      updatedUser.last_name,
      updatedUser.phone_number,
      updatedUser.date_of_birth,
      updatedUser.zip_code,
      updatedUser.address,
      updatedUser.city,
      updatedUser.state,
      updatedUser.notes,
      this.props.user._id
    );

    let updatedUsers = this.state.users.map((user) => {
      if (user.email === updatedUser.email) return updatedUser;
      else return user;
    });

    this.setState({
      users: updatedUsers,
      currentPage: 0,
      loadingMoreUsers: false,
    });

    // this.onRefresh();
  };
  onDeleteUser = (userId) => {
    deleteUser(userId);

    let updatedUsers = [];

    this.state.users.map((user) => {
      if (user._id !== userId) {
        updatedUsers.push(user);
      }
    });

    this.setState({
      users: updatedUsers,
      currentPage: 0,
      loadingMoreUsers: false,
    });
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
        <Styled.HeaderTitle>
          <Styled.Text>Volunteers</Styled.Text>
          <Styled.CSVLink
            data={this.state.users}
            filename={"volunteer-list.csv"}
            className="btn btn-primary"
            target="_blank"
          >
            Download to CSV
          </Styled.CSVLink>
        </Styled.HeaderTitle>
        <Styled.TopMenu>
          <Styled.Search
            placeholder="Search Name"
            value={searchValue}
            onChange={(evt) =>
              this.setState({ searchValue: evt.target.value, searchOn: true })
            }
          />
          <Styled.TotalVols>
            Total Volunteers: {this.state.users.length}
          </Styled.TotalVols>
        </Styled.TopMenu>
        <Styled.TableUsers>
          <VolunteerTable
            users={
              this.state.searchOn
                ? this.filteredAndSortedVolunteers()
                : this.state.users
            }
            loading={loadingMoreUsers}
            editUserCallback={this.onEditUser}
            deleteUserCallback={this.onDeleteUser}
          />
        </Styled.TableUsers>
      </Styled.Container>
    );
  }
}

export default authWrapper(Volunteers);
