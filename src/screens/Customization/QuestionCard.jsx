import React, { useEffect, useState } from "react";
import { TextInput, Select, Dropdown } from "flowbite-react";
import { FaTrash, FaGripVertical } from "react-icons/fa";
import { IoSquareOutline } from "react-icons/io5";
import { RxCircle, RxCross1 } from "react-icons/rx";
import { CiSquareCheck } from "react-icons/ci";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { CiCircleChevDown } from "react-icons/ci";
import { IoRadioButtonOn } from "react-icons/io5";

const QuestionCard = ({
  question,
  onChange,
  provided,
  onAddItem,
  onRemove,
}) => {
  const [title, setTitle] = useState(question.title);
  const [type, setType] = useState(question.type);
  const [isHovered, setIsHovered] = useState(false);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    onChange({ ...question, title: e.target.value });
    // Implement backend call to update title here.
  };

  const handleTypeChange = (newType) => {
    setType(newType);
    onChange({ ...question, type: newType });
    // Implement backend call to update type here.
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(true);
  };

  const handleChoiceChange = (index, value) => {
    const updatedItems = [...question.items];
    updatedItems[index] = { ...updatedItems[index], value };
    onChange({ ...question, items: updatedItems });
    // Implement backend call to update choice here.
  };

  const handleRemoveItem = (index) => {
    const updatedItems = question.items.filter((_, i) => i !== index);
    onChange({ ...question, items: updatedItems });
    // Implement backend call to remove choice here.
  };

  useEffect(() => {
    console.log("Question:", question);
  }, [question]);

  return (
    <div
      className="mb-4 rounded-lg bg-white p-4"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={provided.innerRef}
      {...provided.draggableProps}
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TextInput
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Question Title"
            style={{
              color: "#637381",
              fontFamily: "Open Sans",
              fontStyle: "normal",
              fontSize: "12px !important",
              fontWeight: "600",
            }}
            className="w-80 rounded-none border-b border-gray-400 bg-gray-50 focus:border-gray-600 focus:ring-0"
          />
        </div>
        <div className="flex items-center gap-4">
          {isHovered && (
            <div className="flex items-center gap-4">
              <Dropdown
                arrowIcon={false}
                style={{ backgroundColor: "white" }}
                label={
                  <div className="flex items-center gap-2">
                    {question.type === "multiple" && (
                      <>
                        <IoRadioButtonOn
                          className="ml-2 h-5 w-5"
                          style={{ color: "black" }}
                        />
                        <span style={{ color: "black" }} className="capitalize">
                          Mutiple Choice
                        </span>
                      </>
                    )}
                    {question.type === "dropdown" && (
                      <>
                        <CiCircleChevDown
                          className="ml-2 h-5 w-5"
                          style={{ color: "black" }}
                        />
                        <span style={{ color: "black" }} className="capitalize">
                          Dropdown
                        </span>
                      </>
                    )}
                    {question.type === "response" && (
                      <>
                        <HiOutlineMenuAlt2
                          className="ml-2 h-5 w-5"
                          style={{ color: "black" }}
                        />
                        <span style={{ color: "black" }} className="capitalize">
                          Free Response
                        </span>
                      </>
                    )}
                    {question.type === "checkboxes" && (
                      <>
                        <CiSquareCheck
                          className="ml-2 h-5 w-5"
                          style={{ color: "black" }}
                        />
                        <span style={{ color: "black" }} className="capitalize">
                          checkboxes
                        </span>
                      </>
                    )}
                    <ChevronDownIcon
                      className="ml-2 h-5 w-5"
                      style={{ color: "black" }}
                    />
                  </div>
                }
              >
                <Dropdown.Item onClick={() => handleTypeChange("multiple")}>
                  <div className="flex items-center gap-2">
                    <IoRadioButtonOn />
                    <span style={{ color: "black" }} className="capitalize">
                      Mutiple Choice
                    </span>
                  </div>
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleTypeChange("dropdown")}>
                  <div className="flex items-center gap-2">
                    <CiCircleChevDown />
                    <span style={{ color: "black" }} className="capitalize">
                      Dropdown
                    </span>
                  </div>
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleTypeChange("response")}>
                  <div className="flex items-center gap-2">
                    <HiOutlineMenuAlt2 />
                    <span style={{ color: "black" }} className="capitalize">
                      Free Response
                    </span>
                  </div>
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleTypeChange("checkboxes")}>
                  <div className="flex items-center gap-2">
                    <CiSquareCheck />
                    <span style={{ color: "black" }} className="capitalize">
                      checkboxes
                    </span>
                  </div>
                </Dropdown.Item>
              </Dropdown>
              <FaTrash className="cursor-pointer" onClick={onRemove} />
            </div>
          )}
          <div className="cursor-pointer" {...provided.dragHandleProps}>
            {" "}
            <FaGripVertical />
          </div>
        </div>
      </div>
      {question.type === "multiple" && (
        <>
          {question.items.map((item, index) => (
            <div key={index} className="flex h-12 items-center gap-2">
              <RxCircle />
              {isHovered ? (
                <>
                  <TextInput
                    type="text"
                    value={item.value}
                    onChange={(e) => handleChoiceChange(index, e.target.value)}
                    placeholder="Choice"
                    style={{
                      backgroundColor: "white",
                      color: "#637381",
                      fontFamily: "Open Sans",
                      fontStyle: "normal",
                      fontSize: "12px !important",
                      fontWeight: "200",
                    }}
                    className="w-80 rounded-none border-b border-gray-400 bg-gray-50 focus:border-gray-600 focus:ring-0"
                  />
                  <RxCross1
                    className="cursor-pointer"
                    onClick={() => handleRemoveItem(index)}
                  />
                </>
              ) : (
                <p
                  style={{
                    color: "#637381",
                    fontFamily: "Open Sans",
                    fontStyle: "normal",
                    fontSize: "12px !important",
                    fontWeight: "200",
                  }}
                  className="m-0"
                >
                  {item.value}
                </p>
              )}
            </div>
          ))}
          {isHovered ? (
            <div className="flex h-12 items-center gap-2">
              <RxCircle />
              <a
                style={{
                  color: "#637381",
                  fontFamily: "Open Sans",
                  fontStyle: "normal",
                  fontSize: "12px !important",
                  fontWeight: "200",
                  cursor: "pointer",
                }}
                onClick={onAddItem}
              >
                Add Choice
              </a>
            </div>
          ) : null}
        </>
      )}

      {question.type === "dropdown" && (
        <>
          {isHovered ? (
            <>
              {question.items.map((item, index) => (
                <div key={index} className="flex h-12 items-center gap-2">
                  <RxCircle />
                  <TextInput
                    type="text"
                    value={item.value}
                    onChange={(e) => handleChoiceChange(index, e.target.value)}
                    placeholder="Choice"
                    style={{
                      backgroundColor: "white",
                      color: "#637381",
                      fontFamily: "Open Sans",
                      fontStyle: "normal",
                      fontSize: "12px !important",
                      fontWeight: "200",
                    }}
                    className="w-80 rounded-none border-b border-gray-400 bg-gray-50 focus:border-gray-600 focus:ring-0"
                  />
                  <RxCross1
                    className="cursor-pointer"
                    onClick={() => handleRemoveItem(index)}
                  />
                </div>
              ))}
            </>
          ) : null}
          {!isHovered ? (
            <>
              <Select onChange={handleTypeChange} className="w-80">
                <option value="" disabled selected>
                  choose
                </option>
                {question.items.map((item, index) => (
                  <div key={index} className="flex h-12 items-center gap-2">
                    <option value={index}>{item.value}</option>
                  </div>
                ))}
              </Select>
            </>
          ) : null}
          {isHovered ? (
            <div className="flex h-12 items-center gap-2">
              <RxCircle />
              <a
                style={{
                  color: "#637381",
                  fontFamily: "Open Sans",
                  fontStyle: "normal",
                  fontSize: "12px !important",
                  fontWeight: "200",
                  cursor: "pointer",
                }}
                onClick={onAddItem}
              >
                Add Choice
              </a>
            </div>
          ) : null}
        </>
      )}

      {question.type === "response" && (
        <>
          <TextInput
            type="text"
            value={question.text}
            //eslint-disable-next-line
            onChange={(e) => handleChoiceChange(index, e.target.value)}
            placeholder="Text"
            style={{
              backgroundColor: "white",
              color: "#637381",
              fontFamily: "Open Sans",
              fontStyle: "normal",
              fontSize: "12px !important",
              fontWeight: "200",
              cursor: "pointer",
            }}
            className="w-80  rounded-none border-b border-gray-400 bg-gray-50 focus:border-gray-600 focus:ring-0"
          />
        </>
      )}

      {question.type === "checkkbox" && (
        <>
          {question.items.map((item, index) => (
            <div key={index} className="flex h-12 items-center gap-2">
              <IoSquareOutline />
              {isHovered ? (
                <>
                  <TextInput
                    type="text"
                    value={item.value}
                    onChange={(e) => handleChoiceChange(index, e.target.value)}
                    placeholder="Choice"
                    style={{
                      backgroundColor: "white",
                      color: "#637381",
                      fontFamily: "Open Sans",
                      fontStyle: "normal",
                      fontSize: "12px !important",
                      fontWeight: "200",
                    }}
                    className="w-80 rounded-none border-b border-gray-400 bg-gray-50 focus:border-gray-600 focus:ring-0"
                  />
                  <RxCross1
                    className="cursor-pointer"
                    onClick={() => handleRemoveItem(index)}
                  />
                </>
              ) : (
                <p
                  style={{
                    color: "#637381",
                    fontFamily: "Open Sans",
                    fontStyle: "normal",
                    fontSize: "12px !important",
                    fontWeight: "200",
                  }}
                  className="m-0"
                >
                  {item.value}
                </p>
              )}
            </div>
          ))}
          {isHovered ? (
            <div className="flex h-12 items-center gap-2">
              <IoSquareOutline />
              <a
                style={{
                  color: "#637381",
                  fontFamily: "Open Sans",
                  fontStyle: "normal",
                  fontSize: "12px !important",
                  fontWeight: "200",
                  cursor: "pointer",
                }}
                onClick={onAddItem}
              >
                Add Choice
              </a>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
};

export default QuestionCard;
