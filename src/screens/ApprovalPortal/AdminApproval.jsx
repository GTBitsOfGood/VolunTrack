import { Spinner } from "flowbite-react";
import { useSession } from "next-auth/react";
import Error from "next/error";
import { useEffect, useState } from "react";
import { getRegistrations } from "../../queries/registrations";
import { getEvent } from "../../queries/events";
import RegistrationCard from "./RegistrationCard";

const AdminApproval = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [pendingRegistrations, setPendingRegistrations] = useState([]);
  const [historyRegistrations, setHistoryRegistrations] = useState([]);
  const [events, setEvents] = useState({});
  const [regCounts, setRegCounts] = useState({});

  useEffect(() => {
    const fetchRegistrations = async () => {
      setLoading(true);
      const result = await getRegistrations({
        organizationId: user.organizationId,
      });
      if (result) {
        const registrations = result.data.registrations;
        updateRegCounts(result.data.registrations);

        const pending = registrations.filter(
          (reg) => reg.approved === "pending"
        );
        const history = registrations
        .filter((reg) => reg.approved !== "pending")
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        
        setPendingRegistrations(pending);
        setHistoryRegistrations(history);

        const eventData = {};
        for (const registration of registrations) {
          try {
            const event = await getEvent(registration.eventId);
            eventData[registration.eventId] = event?.data?.event || null;
          } catch (error) {
            console.error("Error fetching event:", error);
            eventData[registration.eventId] = null;
          }
        }
        setEvents(eventData);
      }
      setLoading(false);
    };

    fetchRegistrations();
  }, [user.organizationId]);

  const updateRegCounts = (registrations) => {
    const counts = {};
    registrations.forEach((reg) => {
      const eventId = reg.eventId;
      if (!counts[eventId]) {
        counts[eventId] = 0;
      }
      if (reg.approved === "approved") {
        counts[eventId] += 1 + (reg.minors?.length || 0); // Count the main registration + minors
      }
    });
    setRegCounts(counts);
  };

  const moveToHistory = (registrationId, status) => {
    setPendingRegistrations((prevPending) => {
      const registration = prevPending.find(
        (reg) => reg._id === registrationId
      );
      if (registration) {
        const updatedRegistration = { ...registration, approved: status };

        setRegCounts((prevRegCounts) => {
          const eventId = registration.eventId;
          const currentCount = prevRegCounts[eventId] || 0;

          if (status === "approved") {
            const newCount =
              currentCount + 1 + (registration.minors?.length || 0);
            return { ...prevRegCounts, [eventId]: newCount };
          } else if (status === "denied") {
            if (registration.approved === "approved") {
              const newCount =
                currentCount - 1 - (registration.minors?.length || 0);
              return { ...prevRegCounts, [eventId]: newCount };
            }
          }

          return prevRegCounts;
        });

        setHistoryRegistrations((prevHistory) => {
          const updatedHistory = [...prevHistory, updatedRegistration];
          return updatedHistory.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)); 
        });

        return prevPending.filter((reg) => reg._id !== registrationId);
      }
      return prevPending;
    });
  };

  return loading ? (
    <div className="mt-16 text-center">
      <Spinner />
    </div>
  ) : (
    <div className="mx-auto my-2 w-3/4 space-y-8">
      <h1 className="top-34 left-20 my-4 text-3xl font-semibold">Event Approval Portal</h1>
      <div className="top-54 left-20 mx-auto flex flex-col gap-[100px]">
        <div className="flex flex-col gap-10">
          <div className="text-2xl font-inter">New Requests</div>
          {pendingRegistrations?.length > 0 ? (
            pendingRegistrations.map((registration, index) => {
              if (!events[registration.eventId]) {
                return null;
              }

              return (
                <RegistrationCard
                  key={index}
                  registration={registration}
                  event={events[registration.eventId]}
                  regCount={regCounts[registration.eventId] || 0}
                  onApprove={() => moveToHistory(registration._id, "approved")}
                  onDeny={() => moveToHistory(registration._id, "denied")}
                />
              );
            })
          ) : (
            <div className="text-left font-inter">No new event approval requests</div>
          )}
        </div>
        <div className="flex flex-col gap-10">
          <div className="text-2xl font-inter">Registration History</div>
          {historyRegistrations.length > 0 ? (
            historyRegistrations.map((registration, index) => {
              if (!events[registration.eventId]) {
                return null;
              }

              return (
                <RegistrationCard
                  key={index}
                  registration={registration}
                  event={events[registration.eventId]}
                  regCount={regCounts[registration.eventId] || 0}
                />
              );
            })
          ) : (
            <div className="text-left font-iter">No registration history</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BOGWrapper(AdminApproval);

function BOGWrapper(Component) {
  return function WrappedComponent(props) {
    const {
      data: { user },
    } = useSession();
    if (user.role !== "admin") {
      return (
        <Error
          title="You are not authorized to access this page"
          statusCode={403}
        />
      );
    } else {
      return <Component {...props} user={user} />;
    }
  };
}
