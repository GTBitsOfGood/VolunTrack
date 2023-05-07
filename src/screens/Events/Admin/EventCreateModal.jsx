import classnames from "classnames";
import PropTypes from "prop-types";
import { useState } from "react";
import { Modal, ModalHeader, Nav, NavItem, NavLink } from "reactstrap";
import styled from "styled-components";
import variables from "../../../design-tokens/_variables.module.scss";
import EventFormModal from "./EventFormModal";

const Styled = {
  ModalHeader: styled(ModalHeader)`
    border-color: transparent;
    .org-event {
      color: ${variables["input-color"]};
      border-bottom: 2px solid #e9e9e9;
      padding-right: 3.5rem;
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
      <Styled.ModalHeader toggle={toggle}></Styled.ModalHeader>
      <Styled.Nav tabs>
        <NavItem>
          <NavLink
            className={classnames({
              active: currentActiveTab === "1",
            })}
            onClick={() => {
              changeTab("1");
            }}
          >
            {" "}
            <Styled.HeaderText>
              <p className="text-primaryColor">Public Event</p>
            </Styled.HeaderText>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({
              active: currentActiveTab === "2",
            })}
            onClick={() => {
              changeTab("2");
            }}
          >
            {" "}
            <Styled.HeaderText>
              <p className="text-primaryColor">Private Group Event</p>
            </Styled.HeaderText>
          </NavLink>
        </NavItem>
      </Styled.Nav>
      <EventFormModal
        toggle={toggle}
        event={null}
        isGroupEvent={currentActiveTab === "2"}
      />
    </Modal>
  );
};
EventCreateModal.propTypes = {
  open: PropTypes.bool,
  toggle: PropTypes.func,
};

export default EventCreateModal;
