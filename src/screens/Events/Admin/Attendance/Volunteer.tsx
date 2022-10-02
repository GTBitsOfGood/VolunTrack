import styled from "styled-components";

const Styled = {
  Container: styled.div`
    width: 32%;
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

const Volunteer = ({
  volunteer,
  onClick,
}: {
  volunteer: { [key: string]: any };
  onClick: (userId: string) => void;
}): JSX.Element => {
  return (
    <Styled.Container onClick={() => onClick(volunteer._id)}>
      {/* TODO: add number of minors attatched to volunteer */}
      <Styled.Name>
        {volunteer.bio.first_name} {volunteer.bio.last_name}
      </Styled.Name>
      <Styled.Email>{volunteer.bio.email}</Styled.Email>
    </Styled.Container>
  );
};

export default Volunteer;
