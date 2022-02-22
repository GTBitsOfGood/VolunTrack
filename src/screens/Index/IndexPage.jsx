import { useSession } from "next-auth/react";
import "normalize.css";
import React from "react";
import styled from "styled-components";

const Styled = {
  Container: styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  `,
  Content: styled.main`
    flex: 1;
    overflow-y: scroll;
  `,
};

const IndexPage = () => {
  const { data: session } = useSession();

  return (
    <>
      <h1>
        Welcome {session.user.bio.first_name} {session.user.bio.last_name}
      </h1>
      <h2>Role: {session.user.role}</h2>
    </>
  );
};

export default IndexPage;
