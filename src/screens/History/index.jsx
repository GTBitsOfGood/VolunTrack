import { Table } from "flowbite-react";
import { useSession } from "next-auth/react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import SearchBar from "../../components/SearchBar";
import Text from "../../components/Text";
import { getHistoryPage } from "../../queries/historyEvents";
import AdminAuthWrapper from "../../utils/AdminAuthWrapper";
import Pagination from "../../components/PaginationComp";

const PAGE_SIZE = 20;

// The server searches the history and sends one page at a time
// (GET /api/historyEvents?page=...). The page used to download every line.
const History = () => {
  const {
    data: { user },
  } = useSession();

  const [searchValue, setSearchValue] = useState("");
  const [search, setSearch] = useState("");
  const [historyEvents, setHistoryEvents] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const load = (page, nextSearch) =>
    getHistoryPage(page, PAGE_SIZE, nextSearch).then((result) => {
      if (result?.data) {
        setHistoryEvents(result.data.historyEvents ?? []);
        setTotal(result.data.total ?? 0);
        setCurrentPage(result.data.page ?? 0);
      } else console.error("Error getting history:", result?.error);
    });

  // Search after typing stops for a moment, from the first page.
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchValue), 300);
    return () => clearTimeout(timer);
  }, [searchValue]);

  useEffect(() => {
    load(0, search);
  }, [user.organizationId, search]);

  return (
    <div className="relative left-[10%] left-[10%] w-[80%] max-w-[96rem] py-3">
      <div className="mb-2">
        <Text text="History" type="header" />
      </div>
      <div className="mb-3">
        <SearchBar
          placeholder="Search by Admin Name or Actions"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>
      <Table style={{ width: "100%", maxWidth: "none" }} striped={true}>
        <Table.Head>
          <Table.HeadCell>Name</Table.HeadCell>
          <Table.HeadCell>Change Description</Table.HeadCell>
          <Table.HeadCell>Time</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {historyEvents.map((event, index) => (
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
      {total !== 0 && (
        <Pagination
          items={historyEvents}
          totalItems={total}
          pageSize={PAGE_SIZE}
          currentPage={currentPage}
          updatePageCallback={(page) => load(page, search)}
        />
      )}
    </div>
  );
};

History.propTypes = {
  historyEvents: PropTypes.array,
};

export default AdminAuthWrapper(History);
