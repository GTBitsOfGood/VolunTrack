import { bool } from "prop-types";
import { getInvitedAdmins } from "../queries/organizations";
import { getUsers } from "../queries/users";

class Management extends React.Component {
    state = {
        newInvitedAdmin: "",
        users: [],
        invitedAdmins: [],
        userCount: 0,
        currentPage: 0,
        loadingMoreUsers: false,
        showNewAdminModal: false,
        searchValue: "",
        searchOn: false,
        valid: false,
    };
    
    componentDidMount = () => this.onRefresh();

    onRefresh = () => {
        this.setState({ loadingMoreUsers: true })
        if (isAdmin) {
            getInvitedAdmins(this.props.user.organizationId).then((result) => {
                if (result && result.data) {
                  this.setState({
                    invitedAdmins: result.data.invitedAdmins,
                  });
                }
              });
        }
        getUsers().then((result) => {
            if (result && result.data && result.data.users) {
                this.setState({users: isAdmin ? 
                    result.data.users.filter(
                    (user) =>
                      user.role === "admin" ||
                      user.role === "admin-assistant" ||
                      user.role === "staff"
                    ):
                    result.data.users,
                  currentPage: 0,
                  loadingMoreUsers: false,})
            }
        })
    }

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


    render () {
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

export default AdminAuthWrapper(Management);

Management.propTypes = {
  user: PropTypes.object.isRequired,
  getAdminRoles: bool.isRequired,
};

