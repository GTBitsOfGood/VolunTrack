import styled from "styled-components";

import Volunteer from "./Volunteer";

const Styled = {
  InfoText: styled.p`
    margin: 2rem 0 1rem 0;
    padding 0;

    color: gray;
  `,
  VolunteerContainer: styled.div`
    width: 100%;

    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    row-gap: 1rem;
  `,
};

const AttendanceFunctionality = ({
  checkedInVolunteers,
  checkedOutVolunteers,
  checkIn,
  checkOut,
}: {
  checkedInVolunteers: any;
  checkedOutVolunteers: any;
  checkIn: (volunteer: any) => void;
  checkOut: (volunteer: any) => void;
}): JSX.Element => (
  <>
    <Styled.InfoText>CLICK ON A VOLUNTEER TO CHECK IN</Styled.InfoText>
    <Styled.VolunteerContainer>
      {checkedOutVolunteers &&
        checkedOutVolunteers.map((volunteer) => (
          <Volunteer
            key={volunteer._id}
            volunteer={volunteer}
            onClick={checkIn}
          />
        ))}
    </Styled.VolunteerContainer>
    <Styled.InfoText>CLICK ON A VOLUNTEER TO CHECK OUT</Styled.InfoText>
    <Styled.VolunteerContainer>
      {checkedInVolunteers &&
        checkedInVolunteers.map((volunteer) => (
          <Volunteer
            key={volunteer._id}
            volunteer={volunteer}
            onClick={checkOut}
          />
        ))}
    </Styled.VolunteerContainer>
  </>
);
export default AttendanceFunctionality;
