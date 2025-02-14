import { useContext, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { set } from "mongoose";

const DropdownMenu = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [choice, setChoice] = useState(props.options[0]);

  useEffect(() => {
    setChoice(props.value);
  }, [props.value]);

  return (
    <div className={"relative w-full"}>
      <div
        className={ !props.className ?
          ("flex h-[40px] cursor-pointer flex-row items-center justify-between rounded-t-md border-[1px] border-gray-300 bg-white p-2 " +
          (isOpen ? "" : "rounded-b-md")) : props.className
        }
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{props.value ? props.value : choice}</span>
        {props.arrow &&
          (isOpen ? (
            <ChevronDownIcon className="ml-2 h-5 w-5" />
          ) : (
            <ChevronUpIcon className="ml-2 h-5 w-5" />
          ))}
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
