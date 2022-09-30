import React from "react";
import { Button } from "reactstrap";
import styled from "styled-components";
import variables from "../../../design-tokens/_variables.module.scss";

const Styled = {
  Button: styled(Button)`
    width: 100%;
    margin: 1rem 0 0 0;

    background: ${variables.primary};
    border: none;
    color: white;
  `,
};

const ManageAttendanceButton: React.FC = () => {
  const handleClick = (): void => {
    console.log("clicked");
  };

  return <Styled.Button onClick={handleClick}>Manage Attendance</Styled.Button>;
};

export default ManageAttendanceButton;
