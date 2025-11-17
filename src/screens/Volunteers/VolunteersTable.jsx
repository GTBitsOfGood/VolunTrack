import React from "react";
import PropTypes from "prop-types";
import { Table, Tooltip } from "flowbite-react";
import Loading from "../../components/Loading";
import Pagination from "../../components/PaginationComp";
import { DocumentDuplicateIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import { StarIcon as StarOutline } from "@heroicons/react/24/outline";

class VolunteersTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageSize: 10,
      currentPage: 0,
      pinnedUserIds: [],
      selectedLocation: "All",
    };
  }

  // helper to find organization id on user object
  getOrgId = (user) => {
    return user?.organizationId ?? user?.organization ?? user?.orgId ?? null;
  };

  // counts volunteers per location for the current org
  computeLocationCounts = (users) => {
    const counts = {};
    users.forEach((u) => {
      const loc = u?.location ?? "Unknown";
      counts[loc] = (counts[loc] || 0) + 1;
    });
    return counts;
  };

  // localStorage persistence scoped to organization
  loadPinnedForOrg = () => {
    const orgId = this.getOrgId(this.props.sessionUser) || "global";
    try {
      const raw = localStorage.getItem(`pinnedVolunteers:${orgId}`);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  };

  persistPinnedForOrg = (pinned) => {
    const orgId = this.getOrgId(this.props.sessionUser) || "global";
    try {
      localStorage.setItem(`pinnedVolunteers:${orgId}`, JSON.stringify(pinned));
    } catch (e) {
      // ignore storage errors
    }
  };

  componentDidMount() {
    const pinned = this.loadPinnedForOrg();
    this.setState({ pinnedUserIds: pinned });
  }

  componentDidUpdate(prevProps) {
    const prevOrg = this.getOrgId(prevProps.sessionUser);
    const curOrg = this.getOrgId(this.props.sessionUser);
    if (prevOrg !== curOrg) {
      const pinned = this.loadPinnedForOrg();
      this.setState({ pinnedUserIds: pinned, selectedLocation: "All", currentPage: 0 });
    }
  }

  updatePage = (pageNum) => {
    this.setState({ currentPage: pageNum });
  };

  // toggle pin/unpin and persist
  togglePin = (userId) => {
    this.setState(
      (prev) => {
        const exists = prev.pinnedUserIds.includes(userId);
        const next = exists ? prev.pinnedUserIds.filter((id) => id !== userId) : [userId, ...prev.pinnedUserIds];
        return { pinnedUserIds: next };
      },
      () => {
        this.persistPinnedForOrg(this.state.pinnedUserIds);
      }
    );
  };

  // filter to same org and selected location, then order pinned first
  getDisplayedUsers = () => {
    const { users } = this.props;
    const { pinnedUserIds, selectedLocation } = this.state;
    const currentOrgId = this.getOrgId(this.props.sessionUser);

    // scope to current org
    const orgScoped = users.filter((u) => this.getOrgId(u) === currentOrgId);

    // apply location filter
    const filtered = orgScoped.filter((u) =>
      selectedLocation === "All" ? true : (u?.location ?? "Unknown") === selectedLocation
    );

    // pinned first (preserve pinned order), then remaining
    const pinned = pinnedUserIds.map((id) => filtered.find((u) => u._id === id)).filter(Boolean);
    const rest = filtered.filter((u) => !pinnedUserIds.includes(u._id));
    return [...pinned, ...rest];
  };

  selectLocation = (loc) => {
    this.setState({ selectedLocation: loc, currentPage: 0 });
  };

  render() {
    const { users, loading } = this.props;
    const { currentPage, pageSize, pinnedUserIds, selectedLocation } = this.state;

    const currentOrgId = this.getOrgId(this.props.sessionUser);
    const orgScopedUsers = users.filter((u) => this.getOrgId(u) === currentOrgId);
    const locationCounts = this.computeLocationCounts(orgScopedUsers);
    const locationKeys = ["All", ...Object.keys(locationCounts).sort()];

    const displayedUsers = this.getDisplayedUsers();

    return (
      <div className="m-auto h-full w-full">
        {/* Location filters */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {locationKeys.map((loc) => (
            <button
              key={loc}
              className={`px-3 py-1 rounded-full border ${
                selectedLocation === loc ? "bg-primaryColor text-white" : "bg-white"
              }`}
              onClick={() => this.selectLocation(loc)}
            >
              {loc} {loc !== "All" ? <span className="ml-1 text-sm">({locationCounts[loc]})</span> : <span className="ml-1 text-sm">({orgScopedUsers.length})</span>}
            </button>
          ))}
        </div>

        <Table style={{ width: "100%", maxWidth: "none" }} striped={true}>
          <Table.Head>
            <Table.HeadCell>Pin</Table.HeadCell>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Email Address</Table.HeadCell>
            <Table.HeadCell>Role</Table.HeadCell>
            <Table.HeadCell>Location</Table.HeadCell>
            <Table.HeadCell> </Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {!loading &&
              displayedUsers
                .slice(currentPage * pageSize, (currentPage + 1) * pageSize)
                .map((user, idx) => (
                  <Table.Row key={user._id ?? idx}>
                    <Table.Cell>
                      <Tooltip content={pinnedUserIds.includes(user._id) ? "Unpin" : "Pin"} style="light">
                        <button className="mx-1" onClick={() => this.togglePin(user._id)} aria-label="Pin user">
                          {pinnedUserIds.includes(user._id) ? <StarSolid className="h-6 text-yellow-400" /> : <StarOutline className="h-6 text-gray-400" />}
                        </button>
                      </Tooltip>
                    </Table.Cell>
                    <Table.Cell>{(user.firstName ?? "") + " " + (user.lastName ?? "")}</Table.Cell>
                    <Table.Cell className="flex items-center">
                      <div className="flex items-center">
                        {user.email}
                        <Tooltip content="Copy" style="light">
                          <button className="mx-1" onClick={() => navigator.clipboard.writeText(user.email)}>
                            <DocumentDuplicateIcon className="ml-2 h-7 text-primaryColor" />
                          </button>
                        </Tooltip>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      {user.role === "admin" ? "Administrator" : user.role === "admin-assistant" ? "Admin Assistant" : user.role === "staff" ? "Staff" : (user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "")}
                    </Table.Cell>
                    <Table.Cell>{user.location ?? "Unknown"}</Table.Cell>
                    <Table.Cell></Table.Cell>
                  </Table.Row>
                ))}
          </Table.Body>
        </Table>

        {loading && <Loading />}

        {displayedUsers.length !== 0 && (
          <Pagination items={displayedUsers} pageSize={pageSize} currentPage={currentPage} updatePageCallback={this.updatePage} />
        )}
      </div>
    );
  }
}

export default VolunteersTable;

VolunteersTable.propTypes = {
  sessionUser: PropTypes.object.isRequired,
  users: PropTypes.array.isRequired,
  loading: PropTypes.bool,
};
