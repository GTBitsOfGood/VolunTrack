import PropTypes from "prop-types";
import React, { useContext, useState } from "react";
import { Button } from "reactstrap";
import styled from "styled-components";
import { deleteWaiver, uploadWaiver } from "../../actions/queries";
import Icon from "../../components/Icon";
import variables from "../../design-tokens/_variables.module.scss";
import { RequestContext } from "../../providers/RequestProvider";

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
  const [selectedFile, setSelectedFile] = useState(null);
  const context = useContext(RequestContext);

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
    setIsReplacing(false);
    context.startLoading();
    context.success("Waiver deleted!");
  };
  const handleUpload = () => {
    setIsUploading(true);
  };
  const handleUploadCancel = () => {
    setIsUploading(false);
    setSelectedFile(null);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append(waiverType, selectedFile);
    await uploadWaiver(formData);
    await updateWaivers();
    setIsUploading(false);
    setIsReplacing(false);
    context.startLoading();
    context.success("Waiver uploaded!");
  };

  return (
    <WaiverContainer>
      {!waiverFilePath ? (
        <>
          <WaiverUploadContainer>
            <WaiverHeader>{waiverTypeCapitalized} Waiver</WaiverHeader>
            {isUploading ? (
              <WaiverUploadForm>
                <WaiverUploadInputContainer>
                  <ReplaceFileInput
                    type="file"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                  />
                  <CancelButton onClick={handleUploadCancel}>
                    Cancel
                  </CancelButton>
                </WaiverUploadInputContainer>
                <SubmitButton type="submit" onClick={handleSubmit}>
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
            <ReplaceForm>
              <ReplaceFileInput
                type="file"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                id={`${waiverType}ReplaceForm`}
              />
              <CancelButton onClick={handleCancelReplace}>Cancel</CancelButton>
            </ReplaceForm>
          )}
          {isReplacing ? (
            <SubmitButton
              type="submit"
              form={`${waiverType}ReplaceForm`}
              onClick={handleSubmit}
            >
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
