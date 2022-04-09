import PropTypes from "prop-types";
import React from "react";
import { Button } from "reactstrap";
import styled from "styled-components";
import variables from "../../design-tokens/_variables.module.scss";

const WaiverContainer = styled.div`
  padding: 1rem;
  border-radius: 0.5rem;
  height: 8rem;
  width: 100%;
  background: white;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
`;
const WaiverTextContainer = styled.div`
  align-self: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5rem;
`;
const WaiverHeader = styled.h3`
  margin: 0;
`;
const WaiverLink = styled.a`
  margin: 0;
`;
const ReplaceButton = styled(Button)`
  margin: 0 2rem 0 auto;
  height: 50%;
  background: ${variables.buttonPink};
`;
const DeleteButton = styled(Button)`
  height: 50%;
  background: ${variables["button-pink"]};
`;

const Waiver = ({ filePath }) => {
  const getFileNameFromPath = (filePath) =>
    filePath.split("\\").pop().split("/").pop();
  const getFilePathForOpening = (filePath) => filePath.replace("./public", "");

  return (
    <WaiverContainer>
      <WaiverTextContainer>
        <WaiverHeader>
          {filePath.toLowerCase().includes("adult") ? "Adult" : "Minor"} Waiver
        </WaiverHeader>
        <WaiverLink
          href={getFilePathForOpening(filePath)}
          target="_blank"
          rel="noopener noreferrer"
        >
          File: {getFileNameFromPath(filePath)}
        </WaiverLink>
      </WaiverTextContainer>
      <ReplaceButton>Replace</ReplaceButton>
      <DeleteButton>Delete</DeleteButton>
    </WaiverContainer>
  );
};

Waiver.propTypes = {
  filePath: PropTypes.string.isRequired,
};

export default Waiver;
