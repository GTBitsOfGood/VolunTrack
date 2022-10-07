import { ErrorMessage, Field, Form as FForm, Formik } from "formik";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { Button } from "reactstrap";
import styled from "styled-components";
import { editProfile } from "../../actions/queries";
import * as SForm from "../sharedStyles/formStyles";
import { profileValidator } from "../Profile/helpers";
import { Container, Row, Col } from "reactstrap";
import { capitalizeFirstLetter } from "../Profile/helpers";
import EventManager from "./User/EventManager";

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

  
  return (
    <EventManager user={user} />
  );
};

export default Stats;

 /*

 import { useSession } from "next-auth/react";
import React from "react";
import AdminEventManager from "./Admin";
import UserEventManager from "./User";

const EventManagerSelector = () => {
  const {
    data: { user },
  } = useSession();

  return user.role === "admin" ? (
    <AdminEventManager user={user} />
  ) : (
    <UserEventManager user={user} />
  );
};

export default EventManagerSelector;

 */