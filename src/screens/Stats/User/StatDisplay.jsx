import { Formik } from "formik";
import { useSession } from "next-auth/react";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import "react-calendar/dist/Calendar.css";
import styled from "styled-components";
import BoGButton from "../../../components/BoGButton";
import EventTable from "../../../components/EventTable";
import ProgressDisplay from "../../../components/ProgressDisplay";
import { getAttendancesByUserId } from "../../../queries/attendances";
import { getUser } from "../../../queries/users";
import "react-calendar/dist/Calendar.css";
import { getHours } from "./hourParsing";
import { filterAttendance } from "../helper";
import InputField from "../../../components/Forms/InputField";

const Styled = {
  Header: styled.div`
    font-size: 27px;
    font-weight: bold;
    padding: 5px;
  `,
  Header2: styled.div`
    font-size: 14px;
    color: gray;
    padding: 5px;
  `,
};

const StatDisplay = ({ userId }) => {
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState([]);
  const [length, setLength] = useState(0);
  const [sum, setSum] = useState(0);
  const [name, setName] = useState("");
  const [attend, setAttend] = useState("Bronze");
  const [earn, setEarn] = useState("Bronze");
  const [startDate, setStartDate] = useState("undefined");
  const [endDate, setEndDate] = useState("undefined");

  if (!userId) {
    const { data: session } = useSession();
    userId = session.user._id;
  }

  const onSubmitValues = (values, setSubmitting) => {
    let offset = new Date().getTimezoneOffset();

    if (!values.startDate) {
      setStartDate("undefined");
    } else {
      let start = new Date(values.startDate);
      start.setMinutes(start.getMinutes() - offset);
      setStartDate(start);
    }

    if (!values.endDate) {
      setEndDate("undefined");
    } else {
      let end = new Date(values.endDate);
      end.setMinutes(end.getMinutes() - offset);
      setEndDate(end);
    }
  };

  useEffect(() => {
    setLoading(true);
    getAttendancesByUserId(userId)
      .then((result) => {
        if (result?.data?.attendances) {
          const filteredAttendance = filterAttendance(
            result.data.attendances,
            startDate,
            endDate
          );
          setAttendance(filteredAttendance);
          setLength(filteredAttendance.length);

          if (filteredAttendance.length > 1) {
            setAttend("Silver");
          } else if (filteredAttendance.length > 3) {
            setAttend("Gold");
          }
          let add = 0;
          // HAVE TO FIX THIS
          for (let i = 0; i < filteredAttendance.length; i++) {
            if (filteredAttendance[i].checkoutTime != null) {
              add += getHours(
                filteredAttendance[i].checkinTime.slice(11, 16),
                filteredAttendance[i].checkoutTime.slice(11, 16)
              );
            }
          }
          setSum(add);
          if (add >= 7) {
            setEarn("Silver");
          } else if (add >= 14) {
            setEarn("Gold");
          }
        }
      })
      .finally(() => {
        setLoading(false);
      });

    getUser(userId).then((response) => {
      if (response.data)
        setName(`${response.data.firstName} ${response.data.lastName}'s`);
    });
  }, [startDate, endDate]);

  return (
    <React.Fragment>
      <div className="flex-column mx-auto flex w-5/6 items-start">
        <Styled.Header>{name} Volunteer Statistics</Styled.Header>
        <div className="my-2 flex justify-between">
          <ProgressDisplay
            type={"Events"}
            attendance={attendance}
            header={"Events Attended"}
          />
          <ProgressDisplay
            type={"Hours"}
            attendance={attendance}
            header={"Hours Earned"}
          />
        </div>

        <Formik
          initialValues={{}}
          onSubmit={(values, { setSubmitting }) => {
            onSubmitValues(values, setSubmitting);
          }}
          render={({ handleSubmit }) => (
            <div className="my-2 flex items-center space-x-8">
              <InputField label="From" name="startDate" type="datetime-local" />
              <InputField label="To" name="endDate" type="datetime-local" />
              <BoGButton
                text="Search"
                onClick={() => {
                  handleSubmit();
                }}
              />
            </div>
          )}
        />
        <div className="w-full">
          <Styled.Header>Volunteer History</Styled.Header>
          <Styled.Header2>{length} events</Styled.Header2>
          <EventTable events={attendance} isIndividualStats={true} />
        </div>
      </div>
    </React.Fragment>
  );
};
StatDisplay.propTypes = {
  userId: PropTypes.string,
  onlyAchievements: PropTypes.bool,
};

export default StatDisplay;
