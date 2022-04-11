import PropTypes from "prop-types";
import React, { useState } from "react";
import { Button } from "reactstrap";
import styled from "styled-components";
import { deleteWaiver } from "../../actions/queries";
import Icon from "../../components/Icon";
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
  text-align: center;
`;
const WaiverLink = styled.a`
  margin: 0;
`;
const ReplaceButton = styled(Button)`
  margin: 0 2rem 0 auto;
  height: 50%;
  background: ${variables["secondary"]};
`;
const SubmitButton = styled(Button)`
  margin: 0 2rem 0 auto;
  height: 50%;
  background: ${variables["secondary"]};
  align-self: center;
`;
const DeleteButton = styled(Button)`
  height: 50%;
  background: ${variables["primary"]};
`;
const ReplaceForm = styled.form`
  width: 14rem;
  margin: 0 0 0 2rem;
  display: flex;
  gap: 0.5rem;
  flex-direction: column;
`;
const ReplaceFileInput = styled.input`
  width: 16rem;
`;
const CancelButton = styled(Button)`
  background: ${variables["secondary"]};
  width: 50%;
`;
const WaiverUploadContainer = styled.div`
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
const WaiverUploadButton = styled(Button)`
  background: ${variables["primary"]};
`;
const WaiverUploadForm = styled.form`
  display: flex;
`;
const WaiverUploadInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Waiver = ({ waiver, updateWaivers }) => {
  const [isReplacing, setIsReplacing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const waiverType = Object.keys(waiver)[0];
  const waiverTypeCapitalized =
    waiverType.charAt(0).toUpperCase() + waiverType.slice(1);
  const waiverFilePath = waiver[waiverType];
  const waiverFileName = waiverFilePath?.split("/").pop();

  const handleReplace = () => {
    setIsReplacing(true);
  };
  const handleCancelReplace = () => {
    setIsReplacing(false);
  };
  const handleDelete = async () => {
    await deleteWaiver(waiverType);
    await updateWaivers();
  };
  const handleUpload = () => {
    setIsUploading(true);
  };
  const handleUploadCancel = () => {
    setIsUploading(false);
  };

  return (
    <WaiverContainer>
      {!waiverFilePath ? (
        <>
          <WaiverUploadContainer>
            <WaiverHeader>{waiverTypeCapitalized} Waiver</WaiverHeader>
            {isUploading ? (
              <WaiverUploadForm
                action="/api/waivers"
                encType="multipart/form-data"
                method="POST"
                id={`${waiverType}Form`}
              >
                <WaiverUploadInputContainer>
                  <ReplaceFileInput
                    type="file"
                    id={waiverType}
                    name={waiverType}
                  />
                  <CancelButton onClick={handleUploadCancel}>
                    Cancel
                  </CancelButton>
                </WaiverUploadInputContainer>
                <SubmitButton type="submit" form={`${waiverType}Form`}>
                  Submit
                </SubmitButton>
              </WaiverUploadForm>
            ) : (
              <WaiverUploadButton onClick={handleUpload}>
                <Icon name="add" />
                Upload
              </WaiverUploadButton>
            )}
          </WaiverUploadContainer>
        </>
      ) : (
        <>
          <WaiverTextContainer>
            <WaiverHeader>{waiverTypeCapitalized} Waiver</WaiverHeader>
            <WaiverLink
              href={waiverFilePath.replace("./public/", "")}
              target="_blank"
            >
              File: {waiverFileName}
            </WaiverLink>
          </WaiverTextContainer>
          {isReplacing && (
            <ReplaceForm
              action="/api/waivers"
              encType="multipart/form-data"
              method="POST"
              id={`${waiverType}Form`}
            >
              <ReplaceFileInput type="file" id={waiverType} name={waiverType} />
              <CancelButton onClick={handleCancelReplace}>Cancel</CancelButton>
            </ReplaceForm>
          )}
          {isReplacing ? (
            <SubmitButton type="submit" form={`${waiverType}Form`}>
              Submit
            </SubmitButton>
          ) : (
            <ReplaceButton onClick={handleReplace}>Replace</ReplaceButton>
          )}
          <DeleteButton onClick={handleDelete}>Delete</DeleteButton>
        </>
      )}
    </WaiverContainer>
  );
};

Waiver.propTypes = {
  waiver: PropTypes.object.isRequired,
  updateWaivers: PropTypes.func.isRequired,
};

export default Waiver;
