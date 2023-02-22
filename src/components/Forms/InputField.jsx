import { ErrorMessage, Field } from "formik";
import PropTypes from "prop-types";
import { Label, TextInput } from "flowbite-react";
import styled from "styled-components";

const Styled = {
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
};

const InputField = (props) => (
  <div>
    <Label>{props.label}</Label>
    <Field name={props.name}>
      {({ field }) => (
        <TextInput {...field} type="text" placeholder={props.placeholder} />
      )}
    </Field>
    <Styled.ErrorMessage name={props.name} />
  </div>
);

InputField.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
};

export default InputField;
