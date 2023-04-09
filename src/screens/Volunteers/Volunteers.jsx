import PropTypes from "prop-types";
import React from "react";
import { CSVLink } from "react-csv";
import { deleteUser, getUsers, updateUser } from "../../queries/users";
import VolunteerTable from "./VolunteerTable";
import SearchBar from "../../components/SearchBar";
import AdminAuthWrapper from "../../utils/AdminAuthWrapper";
import BoGButton from "../../components/BoGButton";

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
    updatedUser.adminId = adminId;
    updateUser(userId, updatedUser);

    let updatedUsers = this.state.users.map((user) => {
      if (user.email === updatedUser.email) {
        return {
          ...updatedUser,
          name: updatedUser.firstName + " " + updatedUser.lastName,
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
      <div className="relative left-[10%] flex h-full w-full flex-col pt-[1rem]">
        <div className="flex w-[80%] flex-row justify-between">
          <div className="text-normal text-bold text-4xl">Volunteers</div>
          <CSVLink
            data={this.state.users}
            filename={"volunteer-list.csv"}
            target="_blank"
            className="no-underline"
          >
            <BoGButton text="Download to CSV" />
          </CSVLink>
        </div>
        <div className="mt-[0.7rem] flex w-[80%] flex-row">
          <SearchBar
            placeholder="Search Name"
            value={searchValue}
            onChange={(evt) =>
              this.setState({ searchValue: evt.target.value, searchOn: true })
            }
            className="w-full"
          />
          <div className="mt-[0.3rem] w-[13%] text-center text-sm font-bold">
            Total Volunteers: {this.state.users.length}
          </div>
        </div>
        <div className="w-[80%]">
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
        </div>
      </div>
    );
  }
}

export default AdminAuthWrapper(Volunteers);

Volunteers.propTypes = {
  user: PropTypes.object.isRequired,
};
