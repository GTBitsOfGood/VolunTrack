import { Modal, ModalHeader } from "reactstrap";
import styled from "styled-components";
import Text from "../../../components/Text";
import PropTypes from "prop-types";
import variables from "../../../design-tokens/_variables.module.scss";
import EventFormModal from "./EventFormModal";
import BoGButton from "../../../components/BoGButton";
import { useEffect, useState } from "react";

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

const EventEditModal = ({
  open,
  toggle,
  event,
  setEvent,
  regCount,
  setEventEdit,
}) => {
  const [recurringEventConfirm, setRecurringEventConfirm] = useState(
    event.recurringEvents > 0 ? false : true
  );

  const [recurringEvent, setRecurringEvent] = useState(false);

  useEffect(() => {
    setRecurringEventConfirm(event.recurringEvents > 0 ? false : true);
  }, [open]);

  return (
    <Modal
      style={
        !recurringEventConfirm && event.recurringEvents > 0
          ? { maxWidth: "300px" }
          : {}
      }
      isOpen={open}
      toggle={toggle}
      size="xl"
    >
      {!recurringEventConfirm && event.recurringEvents > 0 && (
        <div>
          <div className="flex flex-col gap-8 px-3 py-2">
            <span className="text-xl font-bold">Edit Recurring Event</span>
            <div className="flex flex-col gap-4 pl-2">
              <div
                onClick={() => setRecurringEvent(false)}
                className="flex items-center gap-4"
              >
                <div className="flex h-[22px] w-[22px] items-center justify-center rounded-full border-[1.5px] border-primaryColor bg-white">
                  {!recurringEvent && (
                    <div className="h-[10.5px] w-[10.5px] rounded-full bg-primaryColor"></div>
                  )}
                </div>
                <span>This event</span>
              </div>
              <div
                onClick={() => setRecurringEvent(true)}
                className="flex items-center gap-4"
              >
                <div className="flex h-[22px] w-[22px] items-center justify-center rounded-full border-[1.5px] border-primaryColor bg-white">
                  {recurringEvent && (
                    <div className="h-[10.5px] w-[10.5px] rounded-full bg-primaryColor"></div>
                  )}
                </div>
                <span>This and future events</span>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <BoGButton
                text="Cancel"
                onClick={() => {
                  toggle();
                  setRecurringEventConfirm(false);
                }}
                outline={true}
              />
              <BoGButton
                text="Confirm"
                onClick={() => setRecurringEventConfirm(true)}
              />
            </div>
          </div>
        </div>
      )}
      {recurringEventConfirm && (
        <div>
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
            regCount={regCount}
            setEventEdit={setEventEdit}
            editRecurringEvent={recurringEvent}
          />
        </div>
      )}
    </Modal>
  );
};
EventEditModal.propTypes = {
  open: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  event: PropTypes.object.isRequired,
  setEvent: PropTypes.func,
  setEventEdit: PropTypes.func,
};

export default EventEditModal;
