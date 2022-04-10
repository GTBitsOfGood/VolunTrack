import { useSession } from "next-auth/react";
import Error from "next/error";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getWaiverPaths } from "../../actions/queries";
import Waiver from "./Waiver";

const WaiversContainer = styled.div`
  min-width: 60%;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
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
  const [filePaths, setFilePaths] = useState([]);

  useEffect(() => {
    const getWaivers = async () => {
      const waiverPaths = await getWaiverPaths();
      setFilePaths(Object.values(waiverPaths.data));
    };

    getWaivers();
  }, []);

  return (
    <WaiversContainer>
      <h2>Manage Waivers</h2>
      {filePaths.map((path) => (
        <Waiver filePath={path} key={path} />
      ))}
    </WaiversContainer>
  );
};

export default authWrapper(WaiverManager);
