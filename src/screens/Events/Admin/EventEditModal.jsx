import { Modal, ModalHeader } from "reactstrap";
import styled from "styled-components";
import Text from "../../../components/Text";
import PropTypes from "prop-types";
import variables from "../../../design-tokens/_variables.module.scss";
import EventFormModal from "./EventFormModal";

const Styled = {
  ModalHeader: styled(ModalHeader)`
    border-color: transparent;
    p {
      color: ${variables["dark"]};
      font-weight: 700;
      margin-top: 2rem;
      margin-left: 4.5rem;
      padding-right: 3.5rem;
      padding-left: 3.5rem;
      border-bottom: 2px solid ${variables["dark"]};
    }
  `,
};

const EventEditModal = ({ open, toggle, event, setEvent }) => {
  return (
    <Modal isOpen={open} toggle={toggle} size="xl">
      <Styled.ModalHeader toggle={toggle} />
      <Text
        className="mx-auto w-3/4 border-b-2 border-b-primaryColor text-center text-primaryColor"
        text="Edit Event"
        type="subheader"
      />
      <EventFormModal
        toggle={toggle}
        event={event}
        isGroupEvent={event?.orgName !== "" && event?.orgName != null}
        setEvent={setEvent}
      />
    </Modal>
  );
};
EventEditModal.propTypes = {
  open: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  event: PropTypes.object.isRequired,
  setEvent: PropTypes.func,
};

export default EventEditModal;
