import styled from "styled-components";
import "flowbite-react";
import { Table, Button } from "flowbite-react";

const Styled = {
  Container: styled.div`
    width: calc((100% / 3) - (2rem / 3));
    padding: 1rem;

    display: flex;
    flex-direction: column;

    background-color: white;
    border-radius: 1rem;

    cursor: pointer;
  `,
  GreyedOutContainer: styled.div`
    width: calc((100% / 3) - (2rem / 3));
    padding: 1rem;

    display: flex;
    flex-direction: column;

    background-color: #d3d3d3;
    border-radius: 1rem;
  `,
  Name: styled.p`
    margin: 0;
    padding: 0;

    font-weight: bold;
  `,
  Email: styled.p`
    margin: 0;
    padding: 0;

    color: gray;
  `,
};

const CheckedInContainer = styled.div`
  background-color: #9cdea3;
`;

// let checkedOut = false;

// const checkedOutVol = () => {
//   checkedOut = !checkedOut;
//   console.log(checkedOut);
// };

const Volunteer = ({
  volunteer,
  minors,
  onClick,
  checkInStatus,
  isEnded,
}: {
  volunteer: { [key: string]: any };
  minors: string[];
  onClick: (volunteer: { [key: string]: any }) => void;
  checkInStatus: "waiting" | "checked in" | "checked out";
  isEnded: boolean;
}): JSX.Element => {
  const renderButton = () => {
    if (checkInStatus === "waiting")
      return (
        <Button
          className="bg-red-500 hover:bg-red-200"
          onClick={() => onClick(volunteer)}
        >
          Check In
        </Button>
      );
    if (checkInStatus === "checked in")
      return (
        <Button
          className="bg-red-300 text-pink-400"
          onClick={() => {
            console.log("hi");
            onClick(volunteer);
          }}
        >
          Check Out
        </Button>
      );
    if (checkInStatus === "checked out")
      return (
        <Button className="bg-stone-600	text-white" disabled>
          Checked Out
        </Button>
      );
    return null;
  };
  return (
    <>
      {/* {isEnded ? (
        <Styled.GreyedOutContainer>
          <Styled.Name>
            {volunteer.bio.first_name} {volunteer.bio.last_name}{" "}
            {minors?.length > 0 && <>({minors.length} minors)</>}
          </Styled.Name>
          <Styled.Email>{volunteer.bio.email}</Styled.Email>
        </Styled.GreyedOutContainer>
      ) : (
        <Styled.Container
          as={isCheckedIn && CheckedInContainer}
          onClick={() => onClick(volunteer)}
        >
          <Styled.Name>
            {volunteer.bio.first_name} {volunteer.bio.last_name}{" "}
            {minors?.length > 0 && <>({minors.length} minors)</>}
          </Styled.Name>
          <Styled.Email>{volunteer.bio.email}</Styled.Email>
        </Styled.Container>
      )} */}
      {isEnded ? (
        //event ended table
        <Table.Row>
          <Table.Cell>{renderButton()}</Table.Cell>
          <Table.Cell>
            {volunteer.bio.first_name} {volunteer.bio.last_name}
          </Table.Cell>
          <Table.Cell>{volunteer.bio.email}</Table.Cell>
          <Table.Cell>{volunteer.bio.phone_number}</Table.Cell>
          <Table.Cell>
            {" "}
            {/* {isCheckedIn ? "Time Placement" : "Waiting to Check-In"} */}
          </Table.Cell>
        </Table.Row>
      ) : (
        //default table
        <Table.Row>
          <Table.Cell>{renderButton()}</Table.Cell>
          <Table.Cell>
            {volunteer.bio.first_name} {volunteer.bio.last_name}
          </Table.Cell>
          <Table.Cell>{volunteer.bio.email}</Table.Cell>
          <Table.Cell>{volunteer.bio.phone_number}</Table.Cell>
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
