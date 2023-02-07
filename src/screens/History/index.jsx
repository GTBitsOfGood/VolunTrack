import { useSession } from "next-auth/react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  getHistoryEvents,
  getUserFromId,
  getUsers,
} from "../../actions/queries";
import * as Table from "../sharedStyles/tableStyles";

const Styled = {
  Container: styled.div`
    width: 90vw;
    max-width: 96rem;
    margin: 0 auto;
    padding: 2rem 0 0 0;
  `,
  Header: styled.h1`
    margin: 0;

    font-size: 3rem;
    font-weight: bold;
  `,
  HeaderRow: styled.div`
    margin: 0 0 1rem 0;

    display: flex;
    justify-content: space-between;
  `,
  CheckedInData: styled.p`
    margin: 0;

    font-size: 2rem;
    vertical-align: top;
  `,
  Search: styled.input`
    height: 3rem;
    width: 100%;
    margin: 0;
    padding: 0 0.5rem;

    font-size: 1.5rem;

    border: 1px solid lightgray;
    border-radius: 0.5rem;
  `,
};

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
    <Styled.Container>
      <Styled.HeaderRow>
        <Styled.Header>History</Styled.Header>
      </Styled.HeaderRow>

      <Styled.Search
        placeholder="Search by Admin Name or Actions"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />

      <Table.Table>
        <tbody>
          <tr>
            <th style={{ color: "#960034" }}>Name</th>
            <th style={{ color: "#960034" }}>Change Description</th>
            <th style={{ color: "#960034" }}>Time</th>
          </tr>
          {filteredAndSortedHistoryEvents().map((event, index) => (
            <Table.Row key={index} evenIndex={index % 2 === 0}>
              <td>
                {event.firstName} {event.lastName}
              </td>
              <td>{event.description}</td>
              <td>{new Date(event.createdAt).toLocaleString()}</td>
            </Table.Row>
          ))}
        </tbody>
      </Table.Table>
    </Styled.Container>
  );
};

History.propTypes = {
  historyEvents: PropTypes.array,
};

export default History;
