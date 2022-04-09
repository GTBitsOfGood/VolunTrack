import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getWaiverPaths } from "../../actions/queries";
import Waiver from "./Waiver";

const WaiversContainer = styled.div`
  max-width: 40rem;
  display: flex;
  flex-direction: column;
`;

const Waivers = () => {
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

export default Waivers;
