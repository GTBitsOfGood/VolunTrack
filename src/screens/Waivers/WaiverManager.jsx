import { useSession } from "next-auth/react";
import Error from "next/error";
import { useRef } from "react";
import { useEffect, useState } from "react";
import { Button } from "flowbite-react";
import variables from "../../design-tokens/_variables.module.scss";
import styled from "styled-components";
import { getWaivers } from "../../actions/queries";
import { uploadWaiver } from "../../actions/queries";
import "react-quill/dist/quill.snow.css";

const WaiversContainer = styled.div`
  min-width: 60%;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
`;

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
  text-decoration: underline;
`;
const ReplaceButton = styled(Button)`
  margin: 0 2rem 0 auto;
  height: 50%;
  background: ${variables["secondary"]};
`;
const SubmitButton = styled(Button)`
  height: 50%;
  margin-top: 2.5rem;
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
  align-self: center;
  margin-left: 12rem;
`;
const CancelButton = styled(Button)`
  height: 50%;
  background: ${variables["secondary"]};
  align-self: center;
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
  align-self: center;
`;
const WaiverUploadInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

function authWrapper(Component) {
  return function WrappedComponent(props) {
    const {
      data: { user },
    } = useSession();
    if (user.role !== "admin") {
      return (
        <Error
          title="You are not authorized to access this page"
          statusCode={403}
        />
      );
    } else {
      return <Component {...props} user={user} />;
    }
  };
}

const WaiverManager = () => {
  let ReactQuill;
  // patch for build failure
  if (typeof window !== "undefined") {
    ReactQuill = require("react-quill");
  }
  const quill = useRef(null);

  const {
    data: { user },
  } = useSession();

  const [adultContent, setAdultContent] = useState("");
  const [minorContent, setMinorContent] = useState("");

  const loadWaivers = async () => {
    const adult = await getWaivers("adult", user.organizationId);

    if (adult.data.waiver.length > 0) {
      setAdultContent(adult.data.waiver[0].text);
    }

    const minor = await getWaivers("minor", user.organizationId);

    if (minor.data.waiver.length > 0) {
      setMinorContent(minor.data.waiver[0].text);
    }
  };

  useEffect(() => {
    loadWaivers();
  }, []);

  const submitAdult = (values, setSubmitting) => {
    uploadWaiver("adult", adultContent, user.organizationId);
  };

  const submitMinor = (values, setSubmitting) => {
    uploadWaiver("minor", minorContent, user.organizationId);
  };

  return (
    <WaiversContainer>
      <h2>Manage Waivers</h2>
      {/* <Tabs.Group
    aria-label="Default tabs"
    style="default"
  >
    <Tabs.Item
      active={true}
      title="Adult Waiver" 
    >
      Profile content
    </Tabs.Item>
    <Tabs.Item title="Minor Waiver">
      Dashboard content
    </Tabs.Item>
  </Tabs.Group> */}
      Adult Waiver
      <div>
        <ReactQuill
          value={adultContent}
          onChange={(newValue) => {
            setAdultContent(newValue);
          }}
          ref={quill}
        />
      </div>
      <Button gradientMonochrome="pink" onClick={submitAdult}>
        Save
      </Button>
      <br></br>
      Minor Waiver
      <div>
        <ReactQuill
          value={minorContent}
          onChange={(newValue) => {
            setMinorContent(newValue);
          }}
          ref={quill}
        />
      </div>
      <Button gradientMonochrome="pink" onClick={submitMinor}>
        Save
      </Button>
    </WaiversContainer>
  );
};

export default authWrapper(WaiverManager);
