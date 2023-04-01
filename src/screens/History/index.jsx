import { useSession } from "next-auth/react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { getHistoryEvents, getUsers } from "../../actions/queries";
import { Table } from "flowbite-react";
import SearchBar from "../../components/SearchBar";
import AdminAuthWrapper from "../../utils/AdminAuthWrapper";
import Text from "../../components/Text";

const History = () => {
  const {
    data: { user },
  } = useSession();

  const [searchValue, setSearchValue] = useState("");
  const [historyEvents, setHistoryEvents] = useState([]);

  useEffect(() => {
    (async () => {
      const fetchedHistoryEvents = (await getHistoryEvents(user.organizationId))
        .data;
      const admins = (await getUsers(user.organizationId, "admin")).data.users;
      const mappedHistoryEvents = await Promise.all(
        fetchedHistoryEvents.map(async (event) => {
          const matchedAdmin = admins.find(
            (element) => element._id === event.userId
          );
          return {
            ...event,
            firstName: matchedAdmin?.first_name ?? "Unknown",
            lastName: matchedAdmin?.last_name ?? "Admin",
          };
        })
      );
      setHistoryEvents(mappedHistoryEvents);
    })();
  }, []);

  const filteredAndSortedHistoryEvents = () => {
    return (
      searchValue.length > 0
        ? historyEvents.filter(
            (h) =>
              h.firstName?.toLowerCase().includes(searchValue.toLowerCase()) ||
              h.lastName?.toLowerCase().includes(searchValue.toLowerCase()) ||
              (h.firstName + " " + h.lastName)
                ?.toLowerCase()
                .trim()
                .includes(searchValue.toLowerCase().trim()) ||
              h.description
                ?.toLowerCase()
                .trim()
                .includes(searchValue.toLowerCase().trim())
          )
        : historyEvents
    ).sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
  };

  return (
    <div className="relative left-[10%] left-[10%] w-[80%] max-w-[96rem] py-3">
      <div className="mb-2">
        <Text text="History" type="header" />
      </div>

      <SearchBar
        placeholder="Search by Admin Name or Actions"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <Table style={{ width: "100%", maxWidth: "none" }} striped={true}>
        <Table.Head>
          <Table.HeadCell>Name</Table.HeadCell>
          <Table.HeadCell>Change Description</Table.HeadCell>
          <Table.HeadCell>Time</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {filteredAndSortedHistoryEvents().map((event, index) => (
            <Table.Row key={index} evenIndex={index % 2 === 0}>
              <Table.Cell>
                {event.firstName} {event.lastName}
              </Table.Cell>
              <Table.Cell>{event.description}</Table.Cell>
              <Table.Cell>
                {new Date(event.createdAt).toLocaleString()}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

History.propTypes = {
  historyEvents: PropTypes.array,
};

export default AdminAuthWrapper(History);
