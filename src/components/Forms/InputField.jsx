import { Label, TextInput } from "flowbite-react";
import { ErrorMessage, Field } from "formik";
import PropTypes from "prop-types";

const InputField = (props) => (
  <div>
    {props.label && (
    <div className="flex flex-row">
      <Label class="mb-2 h-6 font-medium text-slate-200" htmlFor={props.name}>
        {props.label}
      </Label>
      {props.isRequired && <p className="mb-0 text-red-600">*</p>}
    </div>
    )}
    <Field name={props.name}>
      {({ field }) => (
        <TextInput
          class="border-1 mt-0 h-10 w-full rounded-md border-slate-100 bg-white"
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
