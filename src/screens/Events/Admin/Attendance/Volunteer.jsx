import { Table } from "flowbite-react";
import BoGButton from "../../../../components/BoGButton";

const Volunteer = ({
  row,
  disabled,
  pastEnd,
  endLabel,
  onEdit,
  onCheckIn,
  onCheckOut,
  onNoShow,
  onDelete,
}) => {
  const { volunteer, records, openRecords, issue, status } = row;
  const label =
    issue === "missingCheckin"
      ? "Didn't clock in"
      : issue === "missingCheckout"
      ? "Didn't clock out"
      : status === "checkedIn"
      ? "Checked in"
      : status === "checkedOut"
      ? "Checked out"
      : "Waiting to check in";
  return (
    <Table.Row className="bg-white">
      <Table.Cell>
        {volunteer.firstName} {volunteer.lastName}
      </Table.Cell>
      <Table.Cell>{volunteer.email}</Table.Cell>
      <Table.Cell>{volunteer.phone}</Table.Cell>
      <Table.Cell>{row.minors.length}</Table.Cell>
      <Table.Cell>{label}</Table.Cell>
      <Table.Cell>
        <div className="flex flex-wrap gap-2">
          <BoGButton
            text="Edit times"
            disabled={disabled}
            onClick={() => onEdit(row)}
          />
          {issue === "missingCheckin" && (
            <>
              <BoGButton
                text="Add hours"
                disabled={disabled}
                onClick={() => onEdit(row)}
              />
              <BoGButton
                text="Didn't come"
                disabled={disabled}
                onClick={() => onNoShow(row)}
              />
            </>
          )}
          {status === "waiting" && !pastEnd && records.length === 0 && (
            <BoGButton
              text="Check In"
              disabled={disabled}
              onClick={() => onCheckIn(row)}
            />
          )}
          {openRecords.map((record) => (
            <div key={record._id}>
              {records.length > 1 && (
                <p className="text-sm">
                  Entry {records.indexOf(record) + 1}: checked in{" "}
                  {new Intl.DateTimeFormat("en-US", {
                    timeZone: "America/New_York",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  }).format(new Date(record.checkinTime))}{" "}
                  (Atlanta)
                </p>
              )}
              <BoGButton
                text={pastEnd ? `Check out at ${endLabel}` : "Check Out"}
                disabled={disabled}
                onClick={() => onCheckOut(row, record)}
              />
            </div>
          ))}
          {status === "waiting" && row.registrationId && (
            <BoGButton
              text="Delete registration"
              outline
              disabled={disabled}
              onClick={() => onDelete(row)}
            />
          )}
        </div>
      </Table.Cell>
    </Table.Row>
  );
};
export default Volunteer;
