
import { useSession } from "next-auth/react";
import { ErrorMessage, Field, Form as FForm, Formik } from "formik";
import PropTypes from "prop-types";
import React, { useRef, useState } from "react";
import "react-quill/dist/quill.snow.css";
import {
  Button,
  Col,
  FormGroup,
  Input,
  ModalBody,
  ModalFooter,
  Row,
  Form,
} from "reactstrap";
import styled from "styled-components";
import { createEvent, editEvent } from "../../../actions/queries";
import variables from "../../../design-tokens/_variables.module.scss";
import * as SForm from "../../sharedStyles/formStyles";
// import { groupEventValidator, standardEventValidator } from "./eventHelpers";


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
  Form: styled(FForm)``,
  ErrorMessage: styled(ErrorMessage).attrs({
    component: "span",
  })`
    ::before {
      content: "*";
    }
    color: #ef4e79;
    font-size: 14px;
    font-weight: bold;
    margin-top: 0px;
    padding-top: 0px;
    display: inline-block;
  `,
  Col: styled(Col)`
    padding: 5px;
    padding-bottom: 3px;
  `,
  FifthCol: styled(Col)`
    padding: 5px;
    padding-bottom: 3px;
    max-width: 20%;
  `,
  ThirdCol: styled(Col)`
    padding: 5px;
    padding-bottom: 3px;
    max-width: 33%;
  `,
  ModalBody: styled(ModalBody)`
    margin-left: 1.5rem;
    margin-right: -10px;
  `,
  GenericText: styled.p`
    color: ${variables["yiq-text-dark"]};
  `,
  RedText: styled.i`
    color: red;
  `,
  Row: styled(Row)`
    margin: 0.5rem 2rem 0.5rem 1rem;
  `,
  Errors: styled.div`
    background-color: #f3f3f3;
    border-radius: 6px;
    max-width: 350px;
    padding: 8px;
  `,
  ErrorBox: styled.ul`
    margin: 0rem 2rem 0.5rem 1rem;
  `,
};

const Stats = () => {
  const [successText, setSuccessText] = useState("");

  const {
    data: { user },
  } = useSession();

  return (
    <Formik
    
    render={({
      handleSubmit,
      isValid,
      isSubmitting,
      values,
      setFieldValue,
      handleBlur,
      errors,
      touched,
    }) => (
      <React.Fragment>

                        <SForm.Label>
                          Start Date<Styled.RedText>*</Styled.RedText>
                        </SForm.Label>

                        <Field name="date">
                          {({ field }) => (
                            <SForm.Input {...field} type="date" />
                          )}
                        </Field>

                     <SForm.Label>
                          Start Time<Styled.RedText>*</Styled.RedText>
                        </SForm.Label>
                        <Field name="startTime">
                          {({ field }) => (
                            <SForm.Input {...field} type="time" />
                          )}
                        </Field>

                        <SForm.Label>
                          End Date<Styled.RedText>*</Styled.RedText>
                        </SForm.Label>

                        <Field name="date">
                          {({ field }) => (
                            <SForm.Input {...field} type="date" />
                          )}
                        </Field>

                        <SForm.Label>
                          End Time<Styled.RedText>*</Styled.RedText>
                        </SForm.Label>
                        <Field name="startTime">
                          {({ field }) => (
                            <SForm.Input {...field} type="time" />
                          )}
                        </Field>
          
      </React.Fragment>
    )}
  />
  )
};

export default Stats;
