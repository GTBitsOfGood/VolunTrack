import { useSession } from "next-auth/react";
import Error from "next/error";
import PropTypes from "prop-types";
import React from "react";
import { CSVLink } from "react-csv";
import { deleteUser, getUsers, updateUser } from "../../actions/queries";
import VolunteerTable from "./VolunteerTable";
import SearchBar from "../../components/SearchBar";

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
    /** code to update users in state at that specific index */
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
      <div className="relative left-[10%] flex h-[100%] w-[100%] flex-col pt-[1rem]">
        <div className="flex w-[80%] flex-row justify-between">
          <div className="text-normal text-bold text-4xl">Volunteers</div>
          <CSVLink
            data={this.state.users}
            filename={"volunteer-list.csv"}
            className="btn bg-primaryColor text-white"
            target="_blank"
          >
            Download to CSV
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

export default authWrapper(Volunteers);

Volunteers.propTypes = {
  user: PropTypes.object.isRequired,
};
