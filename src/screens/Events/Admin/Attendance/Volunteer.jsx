import styled from "styled-components";

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
const Volunteer = (volunteer, minors, onClick, isCheckedIn, isEnded) => {
  console.log(volunteer);
  return (
    <>
      {isEnded ? (
        <Styled.GreyedOutContainer>
          <Styled.Name>
            {volunteer.firstName} {volunteer.lastName}{" "}
            {minors?.length > 0 && <>({minors.length} minors)</>}
          </Styled.Name>
          <Styled.Email>{volunteer.email}</Styled.Email>
        </Styled.GreyedOutContainer>
      ) : (
        <Styled.Container
          as={isCheckedIn && CheckedInContainer}
          onClick={() => onClick(volunteer)}
        >
          <Styled.Name>
            {volunteer.firstName} {volunteer.lastName}{" "}
            {minors?.length > 0 && <>({minors.length} minors)</>}
          </Styled.Name>
          <Styled.Email>{volunteer.email}</Styled.Email>
        </Styled.Container>
      )}
    </>
  );
};

export default Volunteer;
