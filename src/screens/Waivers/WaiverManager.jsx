import { useSession } from "next-auth/react";
import Error from "next/error";
import { useEffect, useState } from "react";
import { Button } from "reactstrap";
import Icon from "../../components/Icon";
import router from "next/router";
import variables from "../../design-tokens/_variables.module.scss";
import styled from "styled-components";
import { getWaivers } from "../../actions/queries";
import Waiver from "./Waiver";

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
  const [waivers, setWaivers] = useState({});
  const [adultExists, setAdult] = useState(true);
  const [minorExists, setMinor] = useState(true);
  const [adultWaiver, setAdultWaiver] = useState(null);
  const [minorWaiver, setMinorWaiver] = useState(null);
  const [user, setUser] = useState(null);

  // const getAndSetWaivers = async () => {
  //   const res = await getWaivers();
  //   setWaivers(res.data);
  // };

  if (!user) {
    const { data: session } = useSession();
    setUser(session.user);
  }

  // const onRefresh = () => {
  //   loadWaivers();
  // };

  const loadWaivers = async () => {
    const adult = await getWaivers("adult", user.organizationId);
    setAdultWaiver(adult);

    const minor = await getWaivers("adult", user.organizationId);
    setMinorWaiver(minor);
  };

  const editWaiver = async () => {
    await router.push(`${router.pathname}/edit`);
  };

  // useEffect(() => {
  //   getAndSetWaivers();
  // }, []);

  return (
    <WaiversContainer>
      <h2>Manage Waivers</h2>

      <WaiverContainer>
        {adultExists ? (
          <>
            <WaiverUploadContainer>
              <WaiverHeader>Adult Waiver</WaiverHeader>
              <WaiverUploadForm>
                <SubmitButton type="editPage" onClick={editWaiver}>
                  Edit Waiver
                </SubmitButton>
                <SubmitButton type="delete">Delete Waiver</SubmitButton>
              </WaiverUploadForm>
            </WaiverUploadContainer>
          </>
        ) : (
          <>
            <WaiverUploadContainer>
              <WaiverHeader>Adult Waiver</WaiverHeader>
              <WaiverUploadForm>
                <SubmitButton type="editPage">+ Click to Add</SubmitButton>
              </WaiverUploadForm>
            </WaiverUploadContainer>
          </>
        )}
      </WaiverContainer>

      <WaiverContainer>
        {minorExists ? (
          <>
            <WaiverUploadContainer>
              <WaiverHeader>Minor Waiver</WaiverHeader>
              <WaiverUploadForm>
                <SubmitButton type="editPage">Edit Waiver</SubmitButton>
                <SubmitButton type="delete">Delete Waiver</SubmitButton>
              </WaiverUploadForm>
            </WaiverUploadContainer>
          </>
        ) : (
          <>
            <WaiverUploadContainer>
              <WaiverHeader>Adult Waiver</WaiverHeader>
              <WaiverUploadForm>
                <SubmitButton type="editPage">+ Click to Add</SubmitButton>
              </WaiverUploadForm>
            </WaiverUploadContainer>
          </>
        )}
      </WaiverContainer>

      {/* <Waiver
        waiver={{ adult: waivers.adult }}
        updateWaivers={getAndSetWaivers}
      />
      <Waiver
        waiver={{ minor: waivers.minor }}
        updateWaivers={getAndSetWaivers}
      /> */}
    </WaiversContainer>
  );
};

export default authWrapper(WaiverManager);
