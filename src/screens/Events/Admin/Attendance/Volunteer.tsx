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

const Volunteer = ({
  volunteer,
  minors,
  onClick,
  isCheckedIn,
}: {
  volunteer: { [key: string]: any };
  minors: string[];
  onClick: (volunteer: { [key: string]: any }) => void;
  isCheckedIn: boolean;
}): JSX.Element => {
  return (
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
  );
};

export default Volunteer;
