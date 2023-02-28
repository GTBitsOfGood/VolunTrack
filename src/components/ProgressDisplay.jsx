import { ErrorMessage, Field } from "formik";
import PropTypes from "prop-types";
import { Label, TextInput } from "flowbite-react";
import "flowbite-react";

const ProgressDisplay = (props) => (
  //   <div>
  //     <div className="flex flex-row">
  //       <Label class="font-medium h-6 mb-2 text-slate-200" htmlFor={props.name}>
  //         {props.label}
  //       </Label>
  //       {props.isRequired && <p className="text-red-600 mb-0">*</p>}
  //     </div>
  //     <Field name={props.name}>
  //       {({ field }) => (
  //         <TextInput
  //           class="bg-white rounded-md mt-0 h-10 w-full border-1 border-slate-100"
  //           id={props.name}
  //           {...field}
  //           type={props.type ?? "text"}
  //           placeholder={props.placeholder}
  //           disabled={props.disabled}
  //         />
  //       )}
  //     </Field>
  //     <ErrorMessage
  //       component="div"
  //       className="text-red-600 inline-block mt-1 pt-0 before:content-['Hello_World'] text-sm"
  //       name={props.name}
  //     />
  //   </div>

  <div>
    <p>paragraph</p>
  </div>
);

ProgressDisplay.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  isRequired: PropTypes.bool,
  disabled: PropTypes.bool,
  type: PropTypes.string,
};

export default ProgressDisplay;