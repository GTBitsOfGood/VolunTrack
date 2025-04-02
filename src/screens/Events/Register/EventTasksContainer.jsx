import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Text from "../../../components/Text";
import { CheckIcon } from "@heroicons/react/24/solid";

const EventTasksContainer = ({
  event,
  user,
  eventId,
  setTasks,
  isRegistered,
  tasks,
}) => {
  const [selectedTasks, setSelectedTasks] = useState(tasks);

  useEffect(() => {
    setSelectedTasks(tasks); // Sync selectedTasks with tasks
  }, [tasks]); // Only update when tasks change

  const editTasks = (task) => {
    if (selectedTasks.includes(task)) {
      setSelectedTasks(selectedTasks.filter((t) => t !== task));
    } else {
      setSelectedTasks([...selectedTasks, task]);
    }
  };

  const [allTasks, setAllTasks] = useState([]);

  useEffect(() => {
    if (event && event.eventParent) {
      setAllTasks(event?.eventParent?.tasks);
    }
  }, [event]);
  useEffect(() => {
    setTasks(selectedTasks);
  }, [selectedTasks]);

  return (
    <div className="flex w-11/12 flex-col space-y-2 rounded-md">
      <div className="flex flex-row items-center">
        <h3 className={"mb-0 mt-4 text-xl font-bold"}>
          {isRegistered ? "Chosen Tasks" : "Event Tasks"}
          {allTasks.length > 0 && <span className="text-red-600">*</span>}
        </h3>
      </div>
      <div className="flex w-full flex-row flex-wrap gap-7">
        {allTasks.map((task, index) => (
          <div
            key={index}
            className="flex flex-row items-center"
            onClick={() => {
              if (!isRegistered) {
                editTasks(task);
              }
            }}
          >
            <div className="mr-2 h-[18px] w-[18px] rounded-[2px] border-[1px] border-black">
              {selectedTasks.includes(task) && (
                <div className="flex h-full w-full items-center justify-center bg-primaryColor">
                  <CheckIcon
                    width="12px"
                    color="white"
                    className="stroke-[1.6px]"
                    stroke="currentColor"
                  />
                </div>
              )}
            </div>
            <Text text={task} type="body" />
          </div>
        ))}
      </div>
    </div>
  );
};

EventTasksContainer.propTypes = {
  event: PropTypes.object,
  user: PropTypes.object,
  eventId: PropTypes.string,
  setTasks: PropTypes.func,
  // confirmRegPage: PropTypes.bool,
};

export default EventTasksContainer;
