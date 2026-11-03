import { ErrorMessage, Field, Form as FForm, Formik } from "formik";
import PropTypes from "prop-types";
import { useMemo, useRef, useState } from "react";
import { Col, ModalBody, ModalFooter, Row } from "reactstrap";
import BoGButton from "../../../../components/BoGButton";
import InputField from "../../../../components/Forms/InputField";
import {
  createAttendance,
  updateAttendance,
} from "../../../../queries/attendances";
import {
  getAttendanceEditorState,
  getAttendanceEditorPunches,
} from "../../../../../utils/attendanceEditor";
import { attendanceTimeValidator } from "../eventHelpers";

const EditEventStatsForm = ({
  toggle,
  stat,
  event,
  volunteer,
  onSaved,
  onSavingChange = () => {},
}) => {
  const preparation = useMemo(() => {
    try {
      return {
        state: getAttendanceEditorState({ event, attendance: stat, volunteer }),
      };
    } catch (error) {
      return {
        error:
          error instanceof RangeError
            ? error.message
            : "Shift details are unavailable. Close and reload the page before editing.",
      };
    }
  }, [event, stat, volunteer]);
  const pending = useRef(false);
  const persisted = useRef(false);
  const [isSaving, setSaving] = useState(false);
  const [savedToServer, setSavedToServer] = useState(false);
  const isEdit = Boolean(stat?._id);
  const hasContext =
    isEdit ||
    Boolean(volunteer?._id && event?._id && event?.eventParent?.organizationId);

  if (preparation.error)
    return (
      <>
        <ModalBody>
          <p role="alert">{preparation.error}</p>
        </ModalBody>
        <ModalFooter>
          <BoGButton text="Cancel" onClick={toggle} outline />
        </ModalFooter>
      </>
    );
  const editorState = preparation.state;

  const save = async (values, { setStatus, setSubmitting }) => {
    if (pending.current || persisted.current) return;
    pending.current = true;
    setSaving(true);
    onSavingChange(true);
    setStatus(undefined);
    let saved = null;
    try {
      const { checkinTime, checkoutTime } = getAttendanceEditorPunches(
        values,
        editorState
      );
      const result = isEdit
        ? await updateAttendance(stat._id, {
            expectedPunches: {
              checkinTime: stat.checkinTime ?? null,
              checkoutTime: stat.checkoutTime ?? null,
            },
            checkinTime,
            checkoutTime,
            ...(stat.checkinTime && stat.checkoutTime == null
              ? { onlyIfOpen: true }
              : {}),
          })
        : await createAttendance({
            userId: volunteer._id,
            eventId: event._id,
            organizationId: event.eventParent.organizationId,
            checkinTime,
            checkoutTime,
          });
      if (result?.error || !result?.data?.attendance) {
        throw new Error(
          typeof result?.error === "string"
            ? result.error
            : "Attendance was not saved. Check your connection and try again."
        );
      }
      saved = result.data.attendance;
      persisted.current = true;
      setSavedToServer(true);
      await onSaved(saved);
    } catch (error) {
      setStatus({
        error: saved
          ? "Attendance was saved, but the list could not refresh. Close this dialog and reload the page before making another change."
          : error instanceof Error
          ? error.message
          : "Attendance was not saved. Please try again.",
      });
    } finally {
      pending.current = false;
      setSaving(false);
      onSavingChange(false);
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={editorState.initialValues}
      validationSchema={attendanceTimeValidator(editorState)}
      validateOnMount
      onSubmit={save}
    >
      {({ values, isValid, isSubmitting, status }) => {
        let preview;
        try {
          preview = getAttendanceEditorPunches(values, editorState);
        } catch {
          preview = null;
        }
        const busy = isSaving || isSubmitting;
        return (
          <FForm noValidate>
            <ModalBody>
              <p className="mb-1 font-bold">{event.eventParent.title}</p>
              <p className="mb-3 text-sm">
                All dates and times use Atlanta time (America/New_York). The
                selected date applies to both punches.
              </p>
              {editorState.notices.map((notice) => (
                <p
                  key={notice}
                  className="mb-2 rounded border border-amber-300 bg-amber-50 p-2 text-sm"
                  role="note"
                >
                  {notice}
                </p>
              ))}
              <Row>
                <Col md={6}>
                  <InputField name="name" label="Name" disabled />
                </Col>
                <Col md={6}>
                  <InputField name="email" label="Email" disabled />
                </Col>
              </Row>
              <Row>
                <Col md={4}>
                  <InputField
                    name="day"
                    label="Atlanta date"
                    type="date"
                    isRequired
                    disabled={busy || savedToServer}
                  />
                </Col>
                <Col md={4}>
                  <InputField
                    name="checkin"
                    label="Check-in time"
                    type="time"
                    step="1"
                    isRequired
                    disabled={busy || savedToServer}
                  />
                </Col>
                <Col md={4}>
                  <InputField
                    name="checkout"
                    label="Checkout time"
                    type="time"
                    step="1"
                    isRequired
                    disabled={busy || savedToServer}
                  />
                </Col>
              </Row>
              {editorState.hasConflictingDates && (
                <div className="mb-3">
                  <label className="flex items-start gap-2">
                    <Field
                      type="checkbox"
                      name="confirmDateChange"
                      disabled={busy || savedToServer}
                    />
                    I confirm that both punches should use the selected date.
                  </label>
                  <ErrorMessage
                    name="confirmDateChange"
                    component="p"
                    className="text-sm text-red-600"
                  />
                </div>
              )}
              <p className="font-bold">
                Total:{" "}
                <output aria-label="Attendance duration" aria-live="polite">
                  {preview
                    ? `${Math.floor(preview.minutes / 60)} h ${
                        preview.minutes % 60
                      } min`
                    : "Enter a valid date and both times to preview hours."}
                </output>
              </p>
              {!hasContext && (
                <p role="alert">
                  Select a volunteer and shift before adding hours.
                </p>
              )}
              {status?.error && (
                <p role="alert" className="mt-3 text-red-600">
                  {status.error}
                </p>
              )}
              <p role="status" aria-live="polite">
                {busy
                  ? savedToServer
                    ? "Refreshing attendance…"
                    : "Saving attendance…"
                  : ""}
              </p>
            </ModalBody>
            <ModalFooter>
              <BoGButton
                text="Cancel"
                type="button"
                onClick={toggle}
                outline
                disabled={busy}
              />
              <BoGButton
                text={
                  savedToServer
                    ? "Saved"
                    : isEdit
                    ? "Save changes"
                    : "Add hours"
                }
                type="submit"
                disabled={!isValid || busy || savedToServer || !hasContext}
              />
            </ModalFooter>
          </FForm>
        );
      }}
    </Formik>
  );
};

EditEventStatsForm.propTypes = {
  stat: PropTypes.object,
  event: PropTypes.object.isRequired,
  volunteer: PropTypes.object,
  toggle: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired,
  onSavingChange: PropTypes.func,
};

export default EditEventStatsForm;
