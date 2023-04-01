import "flowbite-react";
import { Table } from "flowbite-react";
import BoGButton from "../../../../components/BoGButton";

// const Volunteer = ({
//   volunteer,
//   minors,
//   onClick,
//   isCheckedIn,
//   isEnded,
// }: {
//   volunteer: { [key: string]: any };
//   minors: string[];
//   onClick: (volunteer: { [key: string]: any }) => void;
//   isCheckedIn: boolean;
//   isEnded: boolean;
// }): JSX.Element => {
const Volunteer = (
  volunteer,
  minors,
  onClick,
  isCheckedIn,
  isEnded,
  checkInStatus
) => {
  const renderButton = () => {
    if (checkInStatus === "waiting")
      return <BoGButton text="Check In" onClick={() => onClick(volunteer)} />;
    else if (checkInStatus === "checked in")
      return (
        <BoGButton
          className="bg-secondaryColor text-primaryColor"
          text="Check Out"
          onClick={() => onClick(volunteer)}
        />
      );
    else
      return (
        <BoGButton
          className="bg-stone-600	text-white hover:bg-stone-600"
          text="Checked Out"
          disabled={true}
        />
      );
  };
  return (
    <>
      {isEnded ? (
        //event ended table
        <Table.Row>
          <Table.Cell>{renderButton()}</Table.Cell>
          <Table.Cell>
            {volunteer.firstName} {volunteer.lastName}
          </Table.Cell>
          <Table.Cell>{volunteer.email}</Table.Cell>
          <Table.Cell>{volunteer.phone_number}</Table.Cell>
          <Table.Cell>
            {" "}
            {/* {isCheckedIn ? "Time Placement" : "Waiting to Check-In"} */}
          </Table.Cell>
        </Table.Row>
      ) : (
        <Table.Row>
          <Table.Cell>{renderButton()}</Table.Cell>
          <Table.Cell>
            {volunteer.firstName} {volunteer.lastName}
          </Table.Cell>
          <Table.Cell>{volunteer.email}</Table.Cell>
          <Table.Cell>{volunteer.phone_number}</Table.Cell>
          <Table.Cell>
            {" "}
            {/* {isCheckedIn ? "Time Placement" : "Waiting to Check-In"} */}
          </Table.Cell>
        </Table.Row>
      )}
    </>
  );
};

export default Volunteer;
