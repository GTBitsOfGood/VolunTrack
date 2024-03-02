import classnames from "classnames";
import PropTypes from "prop-types";
import { useState } from "react";
import { Modal, ModalHeader, Nav, NavItem, NavLink } from "reactstrap";
import styled from "styled-components";
import variables from "../../../design-tokens/_variables.module.scss";
import EventFormModal from "./EventFormModal";
import { Tabs } from "flowbite-react";

const Styled = {
  ModalHeader: styled(ModalHeader)`
    border-color: transparent;
    .org-event {
      color: ${variables["input-color"]};
      border-bottom: 2px solid #e9e9e9;
      padding-right: 5rem;
      padding-left: 3.5rem;
      display: inline;
    }
  `,
  HeaderText: styled.p`
    color: ${variables["dark"]};
    font-weight: 700;
    font-size: 1.2em;
  `,
  Nav: styled(Nav)`
    padding-left: 1.5rem;
    margin-top: -2rem;
  `,
};

const EventCreateModal = ({ open, toggle }) => {
  // State for current active Tab
  const [currentActiveTab, setCurrentActiveTab] = useState("1");

  // Toggle active state for Tab
  const changeTab = (tab) => {
    if (currentActiveTab !== tab) setCurrentActiveTab(tab);
  };

  return (
    <Modal isOpen={open} toggle={toggle} backdrop="static" size="xl">
      <Styled.ModalHeader toggle={toggle}>Create an Event</Styled.ModalHeader>
      <Tabs.Group aria-label="Default tabs" style="default">
        <Tabs.Item active title="Public Event">
          <EventFormModal toggle={toggle} event={null} isGroupEvent={false} />
        </Tabs.Item>
        <Tabs.Item title="Private Group Event">
          <EventFormModal toggle={toggle} event={null} isGroupEvent={true} />
        </Tabs.Item>
      </Tabs.Group>
    </Modal>
  );
};

EventCreateModal.propTypes = {
  open: PropTypes.bool,
  toggle: PropTypes.func,
};

export default EventCreateModal;
