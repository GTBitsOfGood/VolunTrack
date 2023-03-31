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
    gap: 1rem;
  `,
};

const AttendanceFunctionality = ({
  checkedInVolunteers,
  checkedOutVolunteers,
  minors,
  checkIn,
  checkOut,
  isEnded,
}) => (
  <>
    <Styled.InfoText>CLICK ON A VOLUNTEER TO CHECK IN</Styled.InfoText>
    <Styled.VolunteerContainer>
      {checkedOutVolunteers?.length > 0 &&
        checkedOutVolunteers.map((volunteer) => (
          <Volunteer
            key={volunteer._id}
            volunteer={volunteer}
            minors={minors[volunteer._id]}
            onClick={checkIn}
            isCheckedIn={false}
            isEnded={isEnded}
          />
        ))}
    </Styled.VolunteerContainer>
    <Styled.InfoText>CLICK ON A VOLUNTEER TO CHECK OUT</Styled.InfoText>
    <Styled.VolunteerContainer>
      {checkedInVolunteers?.length > 0 &&
        checkedInVolunteers.map((volunteer) => (
          <Volunteer
            key={volunteer._id}
            volunteer={volunteer}
            minors={minors[volunteer._id]}
            onClick={checkOut}
            isCheckedIn={true}
            isEnded={isEnded}
          />
        ))}
    </Styled.VolunteerContainer>
  </>
);
export default AttendanceFunctionality;
