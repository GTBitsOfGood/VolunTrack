import { Formik } from "formik";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import BoGButton from "../../../components/BoGButton";
import InputField from "../../../components/Forms/InputField";
import Loading from "../../../components/Loading";
import { getAttendanceStatistics } from "../../../queries/attendances";
import AdminAuthWrapper from "../../../utils/AdminAuthWrapper";
import Text from "../../../components/Text";
import { getEvents } from "../../../queries/events";
import EventStatsTable from "../../../components/EventStatsTable";

const OverallAttendanceSummary = () => {
  const {
    data: { user },
  } = useSession();

  const [numEvents, setNumEvents] = useState(0);
  const [attend, setAttend] = useState(0);
  const [hours, setHours] = useState(0);
  const [events, setEvents] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [computedStats, setComputedStats] = useState([]);

  useEffect(() => {
    onRefresh();
  }, []);

  const onRefresh = async () => {
    // grab the events
    setLoading(true);

    await getEvents(user.organizationId)
      .then((result) => {
        if (result?.data?.events) {
          setEvents(result.data.events);
        }
      })
      .then(() => {
        getAttendanceStatistics(user.organizationId, startDate, endDate).then(
          (result) => {
            let stats = result.data.statistics;
            let computedStats = [];
            setNumEvents(stats.length);

            let mins = 0;
            let volunteers = 0;
            stats.forEach((stat) => {
              mins += stat.minutes;
              volunteers += stat.users.length;
              let event = events.filter((event) => stat._id === event._id);
              if (event && event[0]) {
                computedStats.push({
                  _id: stat._id,
                  title: event[0].eventParent.title,
                  date: event[0].date,
                  startTime: event[0].eventParent.startTime,
                  endTime: event[0].eventParent.endTime,
                  attendance: stat.users.length,
                  hours: Math.round((stat.minutes / 60.0) * 100) / 100,
                });
              }
            });
            setAttend(volunteers);
            setHours(Math.round((mins / 60) * 100) / 100);
            setComputedStats(computedStats);
          }
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onSubmitValues = (values, setSubmitting) => {
    let offset = new Date().getTimezoneOffset();
    if (!values.startDate) {
      setStartDate(null);
    } else {
      let start = new Date(values.startDate);
      start.setMinutes(start.getMinutes() - offset);
      setStartDate(start);
    }

    if (!values.endDate) {
      setEndDate(null);
    } else {
      let end = new Date(values.endDate);
      end.setMinutes(end.getMinutes() - offset);
      setEndDate(end);
    }
    onRefresh();
  };

  return (
    <div className="align-center mx-auto mt-6 flex w-5/6 flex-col">
      <Text text="Overall Attendance Summary" type="header" className="my-4" />
      <Formik
        initialValues={{}}
        onSubmit={(values, { setSubmitting }) => {
          onSubmitValues(values, setSubmitting);
        }}
        render={({ handleSubmit }) => (
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <InputField label="From" name="startDate" type="datetime-local" />
            <InputField label="To" name="endDate" type="datetime-local" />
            <BoGButton
              className="mt-2 bg-primaryColor hover:bg-hoverColor"
              text="Search"
              onClick={() => {
                handleSubmit();
              }}
            />
          </div>
        )}
      />
      {loading && <Loading />}

      {!loading && (
        <div className="align-center my-8 flex flex-col gap-4 md:flex-row md:items-center md:gap-16">
          <div className="flex-column flex items-center">
            <Text text="Unique Events:" type="subheader" />
            <Text text={numEvents} type="subheader" />
          </div>
          <div className="flex-column flex items-center">
            <Text text="Total Volunteers:" type="subheader" />
            <Text text={attend} type="subheader" />
          </div>
          <div className="flex-column flex items-center">
            <Text text="Total Hours Worked:" type="subheader" />
            <Text text={hours} type="subheader" />
          </div>
        </div>
      )}

      {/* TODO: do the aggregation of events and stats for this to work*/}
      {!loading && (
        <div className="mb-4 mt-2">
          <EventStatsTable stats={computedStats} isVolunteer={false} />
        </div>
      )}
    </div>
  );
};

export default AdminAuthWrapper(OverallAttendanceSummary);
