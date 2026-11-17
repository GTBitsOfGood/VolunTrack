import { useSession } from "next-auth/react";
import Error from "next/error";
import { useEffect, useState } from "react";
import { getApprovals } from "../../queries/registrations";
import RegistrationCard from "./RegistrationCard";
import PaginationComp from "../../components/PaginationComp";
import LoadingModal from "../Events/LoadingModal";

// One request per screen (GET /api/registrations/approvals): the new requests
// and one page of history, each with its shift and the person's details. The
// page used to load every sign-up ever and then ask for each shift separately.
const AdminApproval = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [pendingRegistrations, setPendingRegistrations] = useState([]);
  const [historyRegistrations, setHistoryRegistrations] = useState([]);
  const [historyTotal, setHistoryTotal] = useState(0);
  const [regCounts, setRegCounts] = useState({});
  const [isShowAllRequests, setIsShowAllRequests] = useState(false);
  const [historyCurrentPage, setHistoryCurrentPage] = useState(0);
  const [loadError, setLoadError] = useState("");
  const pageSize = 3; // Number of items per page

  // quiet: keep the current cards on screen while the next ones load.
  const load = (page, { quiet = false } = {}) => {
    if (!quiet) setLoading(true);
    return getApprovals(page, pageSize)
      .then((result) => {
        if (result?.data) {
          setPendingRegistrations(result.data.pending);
          setHistoryRegistrations(result.data.history);
          setHistoryTotal(result.data.historyTotal);
          setHistoryCurrentPage(result.data.page);
          setRegCounts(result.data.regCounts);
          setLoadError("");
        } else {
          setLoadError(
            "The requests didn't load. Refresh the page to try again."
          );
          console.error("Error getting approval requests:", result?.error);
        }
      })
      .finally(() => {
        if (!quiet) setLoading(false);
      });
  };

  useEffect(() => {
    load(0);
  }, [user.organizationId]);

  // After Approve or Deny: reload, so the card moves into the history with its
  // new date and the spot counts are up to date.
  const reloadAfterDecision = () => load(historyCurrentPage, { quiet: true });

  return loading ? (
    <div className="flex justify-center pt-8">
      <LoadingModal isOpen={loading} />
    </div>
  ) : (
    <div className="mx-auto my-2 w-11/12 max-w-6xl space-y-8 md:w-3/4">
      <h1 className="my-4 text-3xl font-semibold">Event Approval Portal</h1>
      {loadError && (
        <p role="alert" className="font-semibold text-red-600">
          {loadError}
        </p>
      )}
      <div className="mx-auto flex flex-col gap-16 md:gap-[100px]">
        <div className="flex flex-col gap-10">
          <div className="font-inter text-2xl">New Requests</div>
          {pendingRegistrations?.length > 0 ? (
            pendingRegistrations
              .slice(0, isShowAllRequests ? pendingRegistrations.length : 3)
              .map((registration) => (
                <RegistrationCard
                  key={registration._id}
                  registration={registration}
                  event={registration.event}
                  person={registration.user}
                  regCount={regCounts[registration.eventId] || 0}
                  onApprove={reloadAfterDecision}
                  onDeny={reloadAfterDecision}
                />
              ))
          ) : (
            <div className="font-inter text-left text-[#0183A1]">
              No new event approval requests!
            </div>
          )}
        </div>
        {pendingRegistrations.length > 3 && (
          <div className="flex flex-row items-center justify-center">
            {isShowAllRequests ? (
              <u
                onClick={() => setIsShowAllRequests(false)}
                style={{
                  fontWeight: "500",
                  cursor: "pointer",
                }}
              >
                View Less Requests
              </u>
            ) : (
              <u
                onClick={() => setIsShowAllRequests(true)}
                style={{
                  fontWeight: "500",
                  cursor: "pointer",
                }}
              >
                View All Requests
              </u>
            )}
          </div>
        )}

        <div className="flex flex-col gap-10">
          <div className="font-inter text-2xl">Registration History</div>
          {historyRegistrations.length > 0 ? (
            <>
              {historyRegistrations.map((registration) => (
                <RegistrationCard
                  key={registration._id}
                  registration={registration}
                  event={registration.event}
                  person={registration.user}
                  regCount={regCounts[registration.eventId] || 0}
                />
              ))}

              {/* Pagination Controls */}
              <PaginationComp
                items={historyRegistrations}
                totalItems={historyTotal}
                pageSize={pageSize}
                currentPage={historyCurrentPage}
                updatePageCallback={(page) => load(page, { quiet: true })}
              />
            </>
          ) : (
            <div className="font-inter text-left">No registration history</div>
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
