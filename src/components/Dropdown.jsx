import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";

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
            ? "flex h-[40px] cursor-pointer flex-row items-center justify-between rounded-t-md border-[1px] border-gray-300 bg-white p-2 text-sm " +
              (isOpen ? "" : "rounded-b-md")
            : props.className
        }
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{props.value ? props.value : choice}</span>
        {
          props.arrow && (
            // (isOpen ? (
            <ChevronDownIcon className="ml-2 h-5 w-5" />
          )
          // ) : (
          //   <ChevronUpIcon className="ml-2 h-5 w-5" />
          // ))
        }
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
};

export default DropdownMenu;
