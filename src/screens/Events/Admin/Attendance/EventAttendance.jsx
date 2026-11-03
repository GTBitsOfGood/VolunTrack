import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import BoGButton from "../../../../components/BoGButton";
import SearchBar from "../../../../components/SearchBar";
import Text from "../../../../components/Text";
import {
  checkInVolunteer,
  checkOutVolunteer,
  getAttendances,
  setEventAttendanceEnded,
} from "../../../../queries/attendances";
import { getEvent } from "../../../../queries/events";
import { getUsers } from "../../../../queries/users";
import {
  deleteRegistration,
  getRegistrations,
  markRegistrationNoShow,
} from "../../../../queries/registrations";
import AdminAuthWrapper from "../../../../utils/AdminAuthWrapper";
import EditEventStats from "../Statistics/EditEventStats";
import AttendanceFunctionality from "./AttendanceFunctionality";
import { getShiftDateTimes } from "../../../../../utils/dates";
import {
  getAttendanceManagementRows,
  getEndEventCheckout,
} from "../../../../../utils/attendanceManagement";

const requireData = (response, key) => {
  if (response?.error || response?.data?.error || response?.data?.[key] == null)
    throw new Error(
      String(
        response?.error ||
          response?.data?.error ||
          "The server did not confirm the change. Refresh and try again."
      )
    );
  return response.data[key];
};
const EventAttendance = ({ user }) => {
  const router = useRouter();
  const eventId =
    typeof router.query.eventId === "string" ? router.query.eventId : null;
  const organizationId = String(user.organizationId ?? "");
  const [snapshot, setSnapshot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const operation = useRef(false);
  const generation = useRef(0);
  const mounted = useRef(true);
  const [now, setNow] = useState(() => new Date());
  const [search, setSearch] = useState("");
  const [editor, setEditor] = useState(null);
  const [selection, setSelection] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const refresh = useCallback(async () => {
    if (!router.isReady || !eventId) throw new Error("Shift ID is not ready.");
    const request = ++generation.current;
    setLoading(true);
    try {
      const event = requireData(await getEvent(eventId), "event");
      if (
        !organizationId ||
        String(event.eventParent?.organizationId) !== organizationId
      )
        throw new Error("This shift does not belong to your organization.");
      const [usersResponse, registrationsResponse, attendanceResponse] =
        await Promise.all([
          getUsers(organizationId),
          getRegistrations({ organizationId, eventId }),
          getAttendances({ organizationId, eventId }),
        ]);
      const data = {
        event,
        users: requireData(usersResponse, "users"),
        registrations: requireData(registrationsResponse, "registrations"),
        attendances: requireData(attendanceResponse, "attendances"),
      };
      // Validate the schedule before enabling any time mutation.
      getShiftDateTimes(
        event.date,
        event.eventParent.startTime,
        event.eventParent.endTime
      );
      if (mounted.current && request === generation.current) {
        setSnapshot(data);
        setLoadError("");
        setNow(new Date());
      }
      return data;
    } catch (error) {
      if (mounted.current && request === generation.current)
        setLoadError(error.message);
      throw error;
    } finally {
      if (mounted.current && request === generation.current) setLoading(false);
    }
  }, [router.isReady, eventId, organizationId]);

  useEffect(() => {
    mounted.current = true;
    setSnapshot(null);
    setEditor(null);
    setSelection(null);
    setDeleting(null);
    setMessage("");
    if (router.isReady && eventId) refresh().catch(() => {});
    return () => {
      mounted.current = false;
      generation.current++;
    };
  }, [refresh, router.isReady, eventId]);
  useEffect(() => {
    const focus = () => {
      setNow(new Date());
      if (!operation.current && router.isReady && eventId)
        refresh().catch(() => {});
    };
    const visible = () => {
      if (document.visibilityState === "visible") focus();
    };
    window.addEventListener("focus", focus);
    document.addEventListener("visibilitychange", visible);
    return () => {
      window.removeEventListener("focus", focus);
      document.removeEventListener("visibilitychange", visible);
    };
  }, [refresh, router.isReady, eventId]);
  const timing = useMemo(() => {
    if (!snapshot) return null;
    return getShiftDateTimes(
      snapshot.event.date,
      snapshot.event.eventParent.startTime,
      snapshot.event.eventParent.endTime
    );
  }, [snapshot]);
  const endMillis = timing?.end.getTime();
  useEffect(() => {
    if (endMillis == null) return;
    let timer;
    const schedule = () => {
      const remaining = endMillis + 1 - Date.now();
      if (remaining <= 0) {
        setNow(new Date());
        return;
      }
      timer = window.setTimeout(schedule, Math.min(remaining, 2147483647));
    };
    schedule();
    return () => window.clearTimeout(timer);
  }, [endMillis]);
  const rows = useMemo(
    () => (snapshot ? getAttendanceManagementRows({ ...snapshot, now }) : []),
    [snapshot, now]
  );
  const pastEnd = timing ? now > timing.end : false;
  const endLabel = timing
    ? new Intl.DateTimeFormat("en-US", {
        timeZone: "America/New_York",
        hour: "numeric",
        minute: "2-digit",
      }).format(timing.end)
    : "";
  const disabled =
    busy || loading || !!loadError || !!editor || !!selection || !!deleting;

  const run = async (work) => {
    if (operation.current || loading || loadError) return;
    operation.current = true;
    setBusy(true);
    setMessage("");
    try {
      await work();
    } catch (error) {
      let refreshError = "";
      try {
        await refresh();
      } catch {
        refreshError =
          " Could not refresh saved state. Use Refresh attendance before trying again.";
      }
      if (mounted.current) setMessage(error.message + refreshError);
    } finally {
      operation.current = false;
      if (mounted.current) setBusy(false);
    }
  };
  const openEditor = (row) => {
    if (row.records.length > 1) setSelection(row);
    else setEditor({ row, attendance: row.records[0] ?? null });
  };
  const checkIn = (row) =>
    run(async () => {
      const v = row.volunteer;
      requireData(
        await checkInVolunteer(
          v._id,
          eventId,
          organizationId,
          `${v.firstName} ${v.lastName}`,
          v.email,
          snapshot.event.eventParent.title
        ),
        "attendance"
      );
      await refresh();
      setMessage("Check-in saved.");
    });
  const checkOut = (row, record) =>
    run(async () => {
      const checkoutTime = getEndEventCheckout(snapshot.event, new Date());
      requireData(
        await checkOutVolunteer(row.volunteer._id, eventId, {
          attendanceId: record._id,
          checkoutTime,
        }),
        "attendance"
      );
      await refresh();
      setMessage("Checkout saved.");
    });
  const noShow = (row) =>
    run(async () => {
      requireData(
        await markRegistrationNoShow(row.registrationId),
        "registration"
      );
      await refresh();
      setMessage("Didn't come saved. No attendance hours were created.");
    });
  const endEvent = () => {
    const capturedNow = new Date();
    return run(async () => {
      const fresh = await refresh();
      const checkoutTime = getEndEventCheckout(fresh.event, capturedNow);
      const open = fresh.attendances.filter(
        (a) =>
          String(a.eventId) === eventId &&
          String(a.organizationId) === organizationId &&
          a.checkinTime != null &&
          a.checkoutTime == null
      );
      const results = await Promise.allSettled(
        open.map(async (record) =>
          requireData(
            await checkOutVolunteer(record.userId, eventId, {
              attendanceId: record._id,
              checkoutTime,
            }),
            "attendance"
          )
        )
      );
      const failures = results.filter((result) => result.status === "rejected");
      if (failures.length)
        throw new Error(
          `${open.length - failures.length} of ${
            open.length
          } checkouts confirmed. Event was not marked ended. ${
            failures[0].reason.message
          } Review refreshed attendance and retry End Event.`
        );
      const saved = requireData(
        await setEventAttendanceEnded(eventId, true),
        "event"
      );
      if (!saved.isEnded)
        throw new Error("The server did not confirm End Event.");
      await refresh();
      setMessage("Event ended. All open checkouts were confirmed.");
    });
  };
  const reopen = () =>
    run(async () => {
      const saved = requireData(
        await setEventAttendanceEnded(eventId, false),
        "event"
      );
      if (saved.isEnded)
        throw new Error("The server did not confirm Reopen Event.");
      await refresh();
      setMessage("Event reopened.");
    });
  const remove = () =>
    run(async () => {
      const result = await deleteRegistration(deleting.registrationId);
      if (
        result?.error ||
        result?.data?.error ||
        !result?.status ||
        result.status >= 400
      )
        throw new Error(
          String(
            result?.error ||
              result?.data?.error ||
              "Registration deletion was not confirmed."
          )
        );
      await refresh();
      setDeleting(null);
      setMessage("Registration deleted.");
    });
  const event = snapshot?.event;
  const shown = rows.filter((row) =>
    `${row.volunteer.firstName ?? ""} ${row.volunteer.lastName ?? ""} ${
      row.volunteer.email ?? ""
    }`
      .toLowerCase()
      .includes(search.toLowerCase())
  );
  return (
    <div className="mx-auto w-[90vw] max-w-[96rem] pt-8">
      <Text className="mb-4" href="/events" text="← Back to home" />
      <div className="mb-4 flex justify-between">
        <h1 className="text-3xl font-bold">Attendance Management</h1>
        <BoGButton
          text={event?.isEnded ? "Reopen Event" : "End Event"}
          disabled={disabled || !event}
          onClick={event?.isEnded ? reopen : endEvent}
        />
      </div>
      {loadError && <p role="alert">Unable to load attendance: {loadError}</p>}
      {message && (
        <p role="status" className="my-3">
          {message}
        </p>
      )}
      {busy && <p role="status">Saving attendance…</p>}
      {loading && <p role="status">Loading attendance…</p>}
      <BoGButton
        text="Refresh attendance"
        outline
        disabled={
          busy ||
          loading ||
          !eventId ||
          !router.isReady ||
          !!editor ||
          !!selection ||
          !!deleting
        }
        onClick={() => refresh().catch(() => {})}
      />
      {event && (
        <>
          <div className="my-4 rounded-xl bg-grey px-6 py-3">
            <h2 className="text-xl font-bold">{event.eventParent.title}</h2>
            <p>
              {event.date.substring(0, 10)}, {event.eventParent.startTime} –{" "}
              {event.eventParent.endTime} (Atlanta time, America/New_York)
            </p>
            <p>
              {event.eventParent.address} {event.eventParent.city}{" "}
              {event.eventParent.state} {event.eventParent.zip}
            </p>
            <div
              className="h-24 overflow-hidden"
              dangerouslySetInnerHTML={{
                __html: event.eventParent.description ?? "",
              }}
            />
            <Text href={`/events/${eventId}`} text="See More Details" />
          </div>
          <div className="my-8 rounded-xl bg-grey px-6 py-3">
            <SearchBar
              placeholder="Search by Member Name or Email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <AttendanceFunctionality
              rows={shown}
              disabled={disabled}
              pastEnd={pastEnd}
              endLabel={endLabel}
              onEdit={openEditor}
              onCheckIn={checkIn}
              onCheckOut={checkOut}
              onNoShow={noShow}
              onDelete={setDeleting}
            />
          </div>
        </>
      )}
      <EditEventStats
        open={!!editor}
        toggle={() => setEditor(null)}
        attendance={editor?.attendance}
        volunteer={editor?.row.volunteer}
        event={event}
        onSaved={async () => {
          await refresh();
          setMessage("Attendance saved.");
        }}
      />
      <Modal
        isOpen={!!selection}
        toggle={() => setSelection(null)}
        backdrop="static"
      >
        <ModalHeader toggle={() => setSelection(null)}>
          Choose attendance entry
        </ModalHeader>
        <ModalBody>
          {selection?.records.map((record, index) => (
            <div key={record._id} className="mb-4">
              <p>
                Entry {index + 1}:{" "}
                {record.checkinTime
                  ? new Intl.DateTimeFormat("en-US", {
                      timeZone: "America/New_York",
                      dateStyle: "medium",
                      timeStyle: "medium",
                    }).format(new Date(record.checkinTime))
                  : "Check-in not recorded"}{" "}
                –{" "}
                {record.checkoutTime
                  ? new Intl.DateTimeFormat("en-US", {
                      timeZone: "America/New_York",
                      dateStyle: "medium",
                      timeStyle: "medium",
                    }).format(new Date(record.checkoutTime))
                  : "Checkout not recorded"}{" "}
                (Atlanta)
              </p>
              <BoGButton
                text={`Edit entry ${index + 1}`}
                onClick={() => {
                  setEditor({ row: selection, attendance: record });
                  setSelection(null);
                }}
              />
            </div>
          ))}
        </ModalBody>
      </Modal>
      <Modal
        isOpen={!!deleting}
        toggle={busy ? undefined : () => setDeleting(null)}
        backdrop="static"
        keyboard={!busy}
      >
        <ModalHeader toggle={busy ? undefined : () => setDeleting(null)}>
          Delete registration
        </ModalHeader>
        <ModalBody>
          Delete {deleting?.volunteer.firstName} {deleting?.volunteer.lastName}
          &apos;s registration? This cannot be undone.
        </ModalBody>
        <ModalFooter>
          <BoGButton
            text="Cancel"
            disabled={busy}
            onClick={() => setDeleting(null)}
          />
          <BoGButton
            text="Delete"
            disabled={busy || loading || !!loadError}
            onClick={remove}
          />
        </ModalFooter>
      </Modal>
    </div>
  );
};
export default AdminAuthWrapper(EventAttendance);
