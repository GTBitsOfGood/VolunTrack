import React from "react";
import styled from "styled-components";
import { Modal, ModalHeader } from "reactstrap";
import { Form as FForm, ErrorMessage } from "formik";
import PropTypes from "prop-types";
import EventFormModal from "./EventFormModal"
import variables from "../../../design-tokens/_variables.module.scss";

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
  ModalHeader: styled(ModalHeader)`
    color: ${variables["dark"]};
  `
};

const EventCreateModal = ({ open, toggle }) => {

  return (
    <Modal isOpen={open} toggle={toggle} backdrop="static" size="lg">
      <Styled.ModalHeader toggle={toggle}>Standard Event</Styled.ModalHeader>
      <EventFormModal toggle={toggle} event={null}></EventFormModal>
    </Modal>
  );
};
EventCreateModal.propTypes = {
  open: PropTypes.bool,
  toggle: PropTypes.func,
};

export default EventCreateModal;
