import { Label, TextInput } from "flowbite-react";
import PropTypes from "prop-types";

const SearchBar = (props) => (
  <div className={props.className + " mb-3"}>
    {props.label && (
      <div className="flex flex-row">
        <Label class="mb-1 h-6 font-medium text-slate-600" htmlFor={props.name}>
          {props.label}
        </Label>
      </div>
    )}
    <TextInput
      class="border-1 mt-0 h-10 w-full rounded-md border-gray-300 bg-white disabled:border-gray-500 disabled:bg-gray-300"
      id={props.name}
      name={props.name}
      type="text"
      placeholder={props.placeholder}
      value={props.value}
      onChange={props.onChange}
    />
  </div>
);

SearchBar.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export default SearchBar;
