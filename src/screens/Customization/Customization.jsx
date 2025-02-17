import React, { useState, useEffect } from "react";
import AdminAuthWrapper from "../../utils/AdminAuthWrapper";
import { ToggleSwitch } from "flowbite-react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/24/solid";
import QuestionCard from "./QuestionCard";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const Customization = () => {
  const [edit, setEdit] = useState(false); // State to manage the toggle state
  const [isCollapsed, setIsCollapsed] = useState(true); // State to manage the collapsed state
  const [minWidth, setMinWidth] = useState("100vw"); // State to manage the minWidth
  const [questions, setQuestions] = useState([]); // State to manage the questions list

  const { v4: uuidv4 } = require("uuid");

  const customTheme = {
    toggle: {
      checked: {
        color: {
          primary: "bg-primaryColor",
        },
      },
    },
  };

  const handleCollapseToggle = () => {
    setIsCollapsed(!isCollapsed); // Toggle the collapsed state
  };

  const handleAdd = () => {
    let newQuestion = {
      id: uuidv4(), // Unique identifier for each question
      title: "Question",
      type: "multiple",
      items: [],
      text: "", // reserved for free Response
    };
    setQuestions([...questions, newQuestion]);
    // Implement backend call to add question here.
  };

  const handleAddItem = (questionId) => {
    const updatedQuestions = questions.map((question) => {
      if (question.id === questionId) {
        return {
          ...question,
          items: [...question.items, { id: uuidv4(), value: "" }],
        };
      }
      return question;
    });
    setQuestions(updatedQuestions);
    // Implement backend call to add item here.
  };

  const handleQuestionChange = (index, updatedQuestion) => {
    const updatedQuestions = questions.map((question, i) =>
      i === index ? updatedQuestion : question
    );
    setQuestions(updatedQuestions);
    // Implement backend call to update question here.
  };

  const handleRemoveQuestion = (questionId) => {
    const updatedQuestions = questions.filter(
      (question) => question.id !== questionId
    );
    setQuestions(updatedQuestions);
    // Implement backend call to remove question here.
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const updatedQuestions = Array.from(questions);
    const [movedQuestion] = updatedQuestions.splice(result.source.index, 1);
    updatedQuestions.splice(result.destination.index, 0, movedQuestion);
    setQuestions(updatedQuestions);
    // Implement backend call to update question order here.
  };

  useEffect(() => {
    console.log(questions);
    const handleResize = () => {
      setMinWidth(`${window.innerWidth * 0.4}px`);
    };

    // Set initial minWidth
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [questions]);

  return (
    <div style={{ minWidth }} className="w-full rounded-sm bg-grey p-4">
      <div className="m-0 flex flex-col border-b border-gray-800">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-start gap-4">
            <h2 className="text-lg font-bold">Registration Form</h2>
            <ToggleSwitch
              onChange={() => setEdit(!edit)}
              checked={edit}
              theme={customTheme}
              color={"primary"}
            />
          </div>
          <div
            className="flex cursor-pointer items-center gap-4"
            onClick={handleCollapseToggle}
          >
            {edit && (
              <>
                {isCollapsed ? (
                  <ChevronDownIcon className="h-6 w-6 text-primaryColor" />
                ) : (
                  <ChevronUpIcon className="h-6 w-6 text-primaryColor" />
                )}
              </>
            )}
          </div>
        </div>
        {edit && (
          <div
            className={`transition-max-height overflow-hidden duration-500 ease-in-out ${
              isCollapsed ? "max-h-0" : "max-h-screen"
            }`}
          >
            <div className="mt-4">
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="questions">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {questions.map((question, index) => (
                        <Draggable
                          key={question.id}
                          draggableId={String(question.id)}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              style={{ cursor: "default !important" }}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`mb-4 rounded-lg bg-white ${
                                snapshot.isDragging ? "opacity-50" : ""
                              }`}
                            >
                              <QuestionCard
                                index={index}
                                question={question}
                                onChange={(updatedQuestion) =>
                                  handleQuestionChange(index, updatedQuestion)
                                }
                                provided={provided}
                                onAddItem={() => handleAddItem(question.id)} // Pass the handleAddItem function
                                onRemove={() =>
                                  handleRemoveQuestion(question.id)
                                } // Pass the handleRemoveQuestion function
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
              <div
                className="flex cursor-pointer items-start gap-4"
                onClick={handleAdd}
              >
                <PlusIcon className="h-6 w-6 text-primaryColor" />
                <p
                  style={{
                    color: "#637381",
                    fontFamily: "Open Sans",
                    fontStyle: "normal",
                    fontSize: "20",
                    fontWeight: "600",
                  }}
                >
                  Add Question
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAuthWrapper(Customization);
