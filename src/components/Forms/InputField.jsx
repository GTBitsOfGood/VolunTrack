import { Label, TextInput, Tooltip } from "flowbite-react";
import { ErrorMessage, Field } from "formik";
import PropTypes from "prop-types";
import { InformationCircleIcon } from "@heroicons/react/24/solid";

const InputField = (props) => (
  <div className={props.className + " mb-3"}>
    {props.label && (
      <div className="flex flex-row">
        {props.tooltip && (
          <Tooltip className="flex flex-row" content={props.tooltip}>
            <Label
              className="mb-1 flex h-6 items-center font-medium text-slate-600"
              htmlFor={props.name}
            >
              {props.label}
              <InformationCircleIcon className="ml-1 flex w-4 text-black"></InformationCircleIcon>
            </Label>
            {props.isRequired && <p className="mb-0 text-red-600">*</p>}
          </Tooltip>
        )}
        {!props.tooltip && (
          <>
            <Label
              className="mb-1 h-6 font-medium text-slate-600"
              htmlFor={props.name}
            >
              {props.label}
            </Label>
            {props.isRequired && <p className="mb-0 text-red-600">*</p>}
          </>
        )}
      </div>
    )}
    <Field name={props.name}>
      {({ field }) => (
        <TextInput
          class="border-1 mt-0 h-10 w-full rounded-md border-gray-300 bg-white disabled:border-gray-500 disabled:bg-gray-300"
          id={props.name}
          name={props.name}
          {...field}
          type={props.type ?? "text"}
          placeholder={props.placeholder}
          disabled={props.disabled}
          maxLength={props.maxLength}
          min={props.min}
          max={props.max}
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
  label: PropTypes.string,
  placeholder: PropTypes.string,
  isRequired: PropTypes.bool,
  disabled: PropTypes.bool,
  type: PropTypes.string,
  className: PropTypes.string,
  tooltip: PropTypes.string,
  maxLength: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number,
};

export default InputField;
