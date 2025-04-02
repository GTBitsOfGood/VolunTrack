import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

const DropdownMenu = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [choice, setChoice] = useState(props.options[0]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setChoice(props.value);
  }, [props.value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <div className={"relative w-full"} ref={dropdownRef}>
      <div
        className={
          !props.className
            ? "flex h-[40px] w-full items-center justify-between rounded-lg border-[1px] px-4 py-2 text-sm text-black focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 " +
              (isOpen ? " " : "rounded-b-md ") +
              (props.disabled
                ? "border-gray-500 bg-gray-300 "
                : "border-gray-300 bg-white hover:bg-gray-50 ")
            : props.className
        }
        onClick={() => {
          if (props.disabled) return;
          setIsOpen(!isOpen);
        }}
      >
        <span>{props.value ? props.value : choice}</span>
        {props.arrow && !props.disabled && (
          <ChevronDownIcon className="ml-2 h-5 w-5" />
        )}
      </div>
      {isOpen && (
        <div className="absolute z-10 w-full rounded-b-md border-[1px] border-gray-300 bg-white pb-2 pt-2">
          {props.options.map((option) => (
            <div
              key={option}
              className="p-2 hover:bg-gray-200"
              onClick={() => {
                setChoice(option);
                props.callback(option);
                setIsOpen(false);
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

DropdownMenu.propTypes = {
  options: PropTypes.array.isRequired,
  callback: PropTypes.func.isRequired,
  arrow: PropTypes.bool,
  value: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

export default DropdownMenu;
