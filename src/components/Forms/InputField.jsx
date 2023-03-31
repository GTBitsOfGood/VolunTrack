import { Label, TextInput } from "flowbite-react";
import { ErrorMessage, Field } from "formik";
import PropTypes from "prop-types";

const InputField = (props) => (
  <div className={props.className + " mb-3"}>
    <div className="flex flex-row">
      <Label class="mb-1 h-6 font-medium text-slate-600" htmlFor={props.name}>
        {props.label}
      </Label>
      {props.isRequired && <p className="mb-0 text-red-600">*</p>}
    </div>
    <Field name={props.name}>
      {({ field }) => (
        <TextInput
          class="border-1 mt-0 h-10 w-full rounded-md border-gray-300 bg-white disabled:border-gray-500 disabled:bg-gray-300"
          id={props.name}
          {...field}
          type={props.type ?? "text"}
          placeholder={props.placeholder}
          disabled={props.disabled}
        />
      )}
    </Field>
    <ErrorMessage
      component="div"
      className="mt-1 inline-block pt-0 text-sm text-red-600"
      name={props.name}
    />{" "}
  </div>
);

InputField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  isRequired: PropTypes.bool,
  disabled: PropTypes.bool,
  type: PropTypes.string,
  className: PropTypes.string,
};

export default InputField;
