import React from "react";
import { Formik, Form as FFForm } from "formik";
import styled from "styled-components";

const FForm = styled(FFForm)`
  display: flex;
  flex-direction: column;
`;

const Form = (props) => (
  <Formik {...props}>
    <FForm>{props.children}</FForm>
  </Formik>
);

export default Form;
