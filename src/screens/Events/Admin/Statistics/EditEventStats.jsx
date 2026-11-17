import { useRef, useState } from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import PropTypes from "prop-types";
import EditEventStatsForm from "./EditEventStatsForm";

const EditEventStats = ({
  open,
  toggle,
  attendance,
  event,
  volunteer,
  onSaved,
}) => {
  const [isSaving, setSaving] = useState(false);
  const saving = useRef(false);
  const close = () => {
    if (!saving.current) toggle();
  };
  const saved = async (savedAttendance) => {
    await onSaved(savedAttendance);
    toggle();
  };
  const savingChanged = (value) => {
    saving.current = value;
    setSaving(value);
  };
  return (
    <Modal
      isOpen={open}
      toggle={close}
      size="xl"
      backdrop="static"
      keyboard={!isSaving}
    >
      <ModalHeader toggle={isSaving ? undefined : close}>
        {attendance ? "Edit times" : "Add hours"}
      </ModalHeader>
      {open &&
        (event ? (
          <EditEventStatsForm
            key={`${event._id}:${attendance?._id ?? volunteer?._id ?? "new"}`}
            toggle={close}
            stat={attendance}
            event={event}
            volunteer={volunteer}
            onSaved={saved}
            onSavingChange={savingChanged}
          />
        ) : (
          <ModalBody>
            <p role="alert">
              Shift details are not available yet. Close and reload the page
              before editing.
            </p>
          </ModalBody>
        ))}
    </Modal>
  );
};
EditEventStats.propTypes = {
  open: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  attendance: PropTypes.object,
  event: PropTypes.object,
  volunteer: PropTypes.object,
  onSaved: PropTypes.func.isRequired,
};
export default EditEventStats;
