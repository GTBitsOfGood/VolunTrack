import { ErrorMessage, Field } from "formik";
import PropTypes from "prop-types";
import { Label, TextInput } from "flowbite-react";

const InputField = (props) => (
  <div>
    <div className="flex flex-row">
      <Label class="text-slate-200 mb-2 h-6 font-medium" htmlFor={props.name}>
        {props.label}
      </Label>
      {props.isRequired && <p className="mb-0 text-red-600">*</p>}
    </div>
    <Field name={props.name}>
      {({ field }) => (
        <TextInput
          class="border-1 border-slate-100 mt-0 h-10 w-full rounded-md bg-white"
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
      className="mt-1 inline-block pt-0 text-sm text-red-600 before:content-['Hello_World']"
      name={props.name}
    />
  </div>
);

InputField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  isRequired: PropTypes.bool,
  disabled: PropTypes.bool,
  type: PropTypes.string,
};

export default InputField;