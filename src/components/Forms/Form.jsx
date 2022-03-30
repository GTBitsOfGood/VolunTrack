import React from "react";
import { Formik, Form as FFForm } from "formik";
import styled from "styled-components";
import PropTypes from "prop-types";

const FForm = styled(FFForm)`
  display: flex;
  flex-direction: column;
`;

const Form = (props) => (
  <Formik {...props}>
    <FForm>{props.children}</FForm>
  </Formik>
);

Form.propTypes = {
  children: PropTypes.object,
};

export default Form;
