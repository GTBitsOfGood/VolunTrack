import { Table } from "flowbite-react";
import { useSession } from "next-auth/react";
import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";
import SearchBar from "../../components/SearchBar";
import Text from "../../components/Text";
import { getHistoryEvents } from "../../queries/historyEvents";
import { getUsers } from "../../queries/users";
import AdminAuthWrapper from "../../utils/AdminAuthWrapper";
import Pagination from "../../components/PaginationComp";

const History = () => {
  const {
    data: { user },
  } = useSession();

  const [searchValue, setSearchValue] = useState("");
  const [historyEvents, setHistoryEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  const pageSize = 20;

  useEffect(() => {
    (async () => {
      const fetchedHistoryEvents = (
        await getHistoryEvents({ organizationId: user.organizationId })
      ).data.historyEvents;
      const admins = (await getUsers(user.organizationId, "admin")).data.users;
      const mappedHistoryEvents = await Promise.all(
        fetchedHistoryEvents.map(async (event) => {
          const matchedAdmin = admins.find(
            (element) => element._id === event.userId
          );
          return {
            ...event,
            firstName: matchedAdmin?.firstName ?? "Unknown",
            lastName: matchedAdmin?.lastName ?? "Admin",
          };
        })
      );
      setHistoryEvents(mappedHistoryEvents);
    })();
  }, []);

  const filteredAndSortedHistoryEvents = useCallback(() => {
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
  }, [historyEvents, searchValue]);

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
          {filteredAndSortedHistoryEvents()
            .slice(currentPage * pageSize, (currentPage + 1) * pageSize)
            .map((event, index) => (
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
      {filteredAndSortedHistoryEvents().length !== 0 && (
        <Pagination
          items={filteredAndSortedHistoryEvents()}
          pageSize={pageSize}
          currentPage={currentPage}
          updatePageCallback={setCurrentPage}
        />
      )}
    </div>
  );
};

History.propTypes = {
  historyEvents: PropTypes.array,
};

export default AdminAuthWrapper(History);
