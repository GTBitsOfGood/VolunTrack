import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  checkInVolunteer,
  checkOutVolunteer,
  fetchVolunteers,
} from "../../../../actions/queries";
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
  volunteerIds,
  eventId,
}: {
  volunteerIds: string[];
  eventId: string;
}): JSX.Element => {
  const [numCheckedIn, setNumCheckedIn] = useState(0);
  const [numCheckedOut, setNumCheckedOut] = useState(0);

  const [checkedInVolunteers, setCheckedInVolunteers] = useState([]);
  const [checkedOutVolunteers, setCheckedOutVolunteers] = useState([]);

  useEffect(() => {
    (async () => {
      const volunteers = (await fetchVolunteers(volunteerIds)).data.users;

      setCheckedInVolunteers(
        volunteers.filter((volunteer) =>
          volunteer.eventsCheckedIn?.includes(eventId)
        )
      );
      setCheckedOutVolunteers(
        volunteers.filter(
          (volunteer) => !volunteer.eventsCheckedIn?.includes(eventId)
        )
      );
    })();
  }, []);

  const checkIn = (userId) => {
    checkInVolunteer(userId, eventId);

    setCheckedInVolunteers(
      checkedInVolunteers.concat(
        checkedOutVolunteers.find((volunteer) => volunteer._id === userId)
      )
    );
    setCheckedOutVolunteers(
      checkedOutVolunteers.filter((volunteer) => volunteer._id !== userId)
    );
  };

  const checkOut = (userId) => {
    checkOutVolunteer(userId, eventId);

    setCheckedOutVolunteers(
      checkedOutVolunteers.concat(
        checkedInVolunteers.find((volunteer) => volunteer._id === userId)
      )
    );
    setCheckedInVolunteers(
      checkedInVolunteers.filter((volunteer) => volunteer._id !== userId)
    );
  };

  return (
    <>
      <Styled.InfoText>
        CLICK ON A VOLUNTEER TO CHECK IN ({numCheckedIn})
      </Styled.InfoText>
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
      <Styled.InfoText>
        CLICK ON A VOLUNTEER TO CHECK OUT ({numCheckedOut})
      </Styled.InfoText>
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
};

export default AttendanceFunctionality;
