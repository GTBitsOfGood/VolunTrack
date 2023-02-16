import { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import PropTypes from "prop-types";
import { updateEvent } from "../../../screens/Events/eventHelpers";

const EventUnRegisterModal = ({ open, toggle, eventData, userId }) => {
  //   const [isDeleting, setDeleting] = useState(false);

  //   const handleSubmit = () => {
  //     setDeleting(true);
  //     deleteAttendance(event._id, event.eventId)
  //       .then(() => {
  //         toggle();
  //         setDeleting(false);
  //       })
  //       .catch(console.log);
  //   };

  const onUnregisterClicked = async (event) => {
    const changedEvent = {
      // remove current user id from event volunteers
      ...event,
      volunteers: event.volunteers.filter((volunteer) => volunteer !== userId),
    };
    await updateEvent(changedEvent);

    // onRefresh();
  };

  return (
    <Modal isOpen={open} toggle={toggle} backdrop="static">
      <ModalHeader toggle={toggle}>Delete Entry</ModalHeader>
      {/* <ModalBody>
        Are you sure you want to cancel your registration for this event?
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          No, keep it
        </Button>
        <Button color="primary" onClick={handleSubmit} disabled={isDeleting}>
          Yes, cancel it
        </Button>
      </ModalFooter> */}
    </Modal>
  );
};

EventUnRegisterModal.propTypes = {
  open: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  eventData: PropTypes.object.isRequired,
  userId: PropTypes.object.isRequired,
};
export default EventUnRegisterModal;
