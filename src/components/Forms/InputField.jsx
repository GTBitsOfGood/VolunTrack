import { Label, TextInput, Tooltip } from "flowbite-react";
import { ErrorMessage, Field } from "formik";
import PropTypes from "prop-types";
import { InformationCircleIcon } from "@heroicons/react/24/solid";

const InputField = (props) => (
  <div className={props.className + " mb-3"}>
    {props.label && (
      <div className="flex flex-row">
        {props.tooltip && (
          <div className="flex flex-row">
            <Label
              className="mb-1 flex h-6 items-center font-black text-slate-600"
              htmlFor={props.name}
            >
              {props.label}
            </Label>
            <Tooltip className="flex flex-row" content={props.tooltip}>
              <div className="flex h-6 items-center">
                <InformationCircleIcon className="ml-1 flex w-4 text-black"></InformationCircleIcon>
                {props.isRequired && <p className="mb-0 text-red-600">*</p>}
              </div>
            </Tooltip>
          </div>
        )}
        {!props.tooltip && (
          <>
            <Label className="mb-1 h-6 font-black" htmlFor={props.name}>
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
          class={`border-1 mt-0 h-10 w-full rounded-md bg-white disabled:border-gray-500 disabled:bg-gray-300 ${
            props.isEmptyOrInvalid ? "border-red-800" : "border-gray-300"
          }`}
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
  isEmptyOrInvalid: PropTypes.bool,
};

export default InputField;
