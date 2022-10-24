import { Form as FFForm, Formik } from "formik";
import PropTypes from "prop-types";
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

Form.propTypes = {
  children: PropTypes.object,
};

export default Form;
