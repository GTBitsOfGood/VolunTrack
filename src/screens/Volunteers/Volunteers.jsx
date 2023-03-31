import { useSession } from "next-auth/react";
import Error from "next/error";
import PropTypes from "prop-types";
import React from "react";
import { CSVLink } from "react-csv";
import styled from "styled-components";
import { deleteUser, getUsers, updateUser } from "../../queries/users";
import VolunteerTable from "./VolunteerTable";

const Styled = {
  Container: styled.div`
    width: 100%;
    height: 100%;

    padding-top: 1rem;
    display: flex;
    flex-direction: column;
    position: relative;
    left: 10%;
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
    loadingMoreUsers: false,
    searchValue: "",
    searchOn: false,
  };

  componentDidMount = () => this.onRefresh();
  onRefresh = async () => {
    this.setState({ loadingMoreUsers: true });
    let result = await getUsers(this.props.user.organizationId, "volunteer");
    if (result && result.data && result.data.users) {
      this.setState({
        users: result.data.users,
        loadingMoreUsers: false,
      });
    }
  };

  onEditUser = (userId, updatedUser) => {
    /** Code to update users in state at that specific index */
    const adminId = this.props.user._id;
    const userInfo = { adminId, bio: updatedUser };
    updateUser(userId, userInfo);

    let updatedUsers = this.state.users.map((user) => {
      if (user.email === updatedUser.email) {
        return {
          ...updatedUser,
          name: updatedUser.first_name + " " + updatedUser.last_name,
          _id: user._id,
          status: user.status,
          role: user.role,
        };
      }
      return user;
    });

    this.setState({
      users: updatedUsers,
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
    const { loadingMoreUsers, searchValue } = this.state;
    return (
      <Styled.Container>
        <Styled.HeaderTitle>
          <Styled.Text>Volunteers</Styled.Text>
          <Styled.CSVLink
            data={this.state.users}
            filename={"volunteer-list.csv"}
            className="btn bg-primaryColor text-white"
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
            isAdmin={this.props.user.role === "admin"}
          />
        </Styled.TableUsers>
      </Styled.Container>
    );
  }
}

export default authWrapper(Volunteers);

Volunteers.propTypes = {
  user: PropTypes.object.isRequired,
};
