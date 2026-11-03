import { Table } from "flowbite-react";
import Volunteer from "./Volunteer";
const AttendanceFunctionality = ({ rows, ...actions }) =>
  rows.length ? (
    <Table>
      <Table.Head className="border-b bg-white">
        {["Name", "Email", "Phone", "# Minors", "Status", "Actions"].map(
          (label) => (
            <Table.HeadCell key={label}>{label}</Table.HeadCell>
          )
        )}
      </Table.Head>
      <Table.Body className="divide-y">
        {rows.map((row) => (
          <Volunteer key={row.volunteer._id} row={row} {...actions} />
        ))}
      </Table.Body>
    </Table>
  ) : (
    <p className="py-4">No attendance rows match this view.</p>
  );
export default AttendanceFunctionality;
