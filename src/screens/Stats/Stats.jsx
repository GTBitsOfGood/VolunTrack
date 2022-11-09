import { ErrorMessage, Form as FForm } from "formik";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import styled from "styled-components";
import StatDisplay from "./User/StatDisplay";

const Styled = {
  Container: styled.div`
    background: white;
    margin-bottom: 2rem;
    border-radius: 0.4rem;
    padding: 2rem;
    width: 80%;
    padding-top: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  `,
  HeaderContainer: styled.div`
    width: 95%;
    max-width: 80rem;
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
  `,
  Form: styled(FForm)`
    width: 50%;
    background: white;
    padding: 5%;
  `,
  ErrorMessage: styled(ErrorMessage).attrs({
    component: "span",
  })`
    ::before {
      content: "*";
    }
    color: red;
    font-size: 14px;
    font-weight: bold;
    display: inline-block;
  `,
};

const Stats = () => {
  const [successText, setSuccessText] = useState("");

  const {
    data: { user },
  } = useSession();

  return <StatDisplay userId={user._id} />;
};

export default Stats;
