import PropTypes from "prop-types";
import React, { useState } from "react";
import { Button } from "reactstrap";
import styled from "styled-components";
import variables from "../../design-tokens/_variables.module.scss";

const WaiverContainer = styled.div`
  padding: 1.5rem;
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
const SubmitButton = styled(Button)`
  margin: 0 2rem 0 auto;
  height: 50%;
  background: ${variables.buttonPink};
`;
const DeleteButton = styled(Button)`
  height: 50%;
  background: ${variables["button-pink"]};
`;
const ReplaceForm = styled.form`
  width: 14rem;
  margin: 0 0 0 2rem;
  display: flex;
  gap: 0.5rem;
  flex-direction: column;
`;
const ReplaceFileInput = styled.input``;
const CancelButton = styled(Button)`
  background: ${variables["button-pink"]};
  width: 50%;
  align-self: center;
`;

const Waiver = ({ filePath }) => {
  const [isReplacing, setIsReplacing] = useState(false);

  const getWaiverType = (filePath) =>
    filePath.toLowerCase().includes("adult") ? "adult" : "minor";
  const getFileNameFromPath = (filePath) =>
    filePath.split("\\").pop().split("/").pop();

  const replace = () => {
    setIsReplacing(true);
  };
  const cancelReplace = () => {
    setIsReplacing(false);
  };

  return (
    <WaiverContainer>
      <WaiverTextContainer>
        <WaiverHeader>
          {getWaiverType(filePath).charAt(0).toUpperCase() +
            getWaiverType(filePath).slice(1)}{" "}
          Waiver
        </WaiverHeader>
        <WaiverLink href={filePath} target="_blank">
          File: {getFileNameFromPath(filePath)}
        </WaiverLink>
      </WaiverTextContainer>
      {isReplacing && (
        <ReplaceForm
          action="/api/waivers"
          encType="multipart/form-data"
          method="POST"
          id={`${getWaiverType(filePath)}Form`}
        >
          <ReplaceFileInput
            type="file"
            id={getWaiverType(filePath)}
            name={getWaiverType(filePath)}
          />
          <CancelButton onClick={cancelReplace}>Cancel</CancelButton>
        </ReplaceForm>
      )}
      {isReplacing ? (
        <SubmitButton type="submit" form={`${getWaiverType(filePath)}Form`}>
          Submit
        </SubmitButton>
      ) : (
        <ReplaceButton onClick={replace}>Replace</ReplaceButton>
      )}
      <DeleteButton>Delete</DeleteButton>
    </WaiverContainer>
  );
};

Waiver.propTypes = {
  filePath: PropTypes.string.isRequired,
};

export default Waiver;
