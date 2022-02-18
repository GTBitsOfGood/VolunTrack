import React from "react";
import styled from "styled-components";
import { Modal, ModalHeader } from "reactstrap";
import { Form as FForm, ErrorMessage } from "formik";

import PropTypes from "prop-types";
import EventFormModal from "./EventFormModal"

const Styled = {
  Form: styled(FForm)``,
  ErrorMessage: styled(ErrorMessage).attrs({
    component: "span",
  })`
    ::before {
      content: "*";
    }
    color: red;
    font-size: 14px;
    font-weight: bold;
    display: inline-block;
  `,
};

const EventEditModal = ({ open, toggle, event }) => {
  return (
    <Modal isOpen={open} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>Edit Event</ModalHeader>
        <EventFormModal
        toggle={toggle}
        event={event}>
        </EventFormModal>    
    </Modal>
  );
};
EventEditModal.propTypes = {
  open: PropTypes.bool,
  toggle: PropTypes.func,
};

export default EventEditModal;
