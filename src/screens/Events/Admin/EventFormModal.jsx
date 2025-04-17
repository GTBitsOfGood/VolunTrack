import { Label } from "flowbite-react";
import { Field, Form as FForm, Formik } from "formik";
import { useSession } from "next-auth/react";
import PropTypes from "prop-types";
import { useContext, useEffect, useRef, useState } from "react";
import "react-quill/dist/quill.snow.css";
import { Col, ModalBody, Row } from "reactstrap";
import styled from "styled-components";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { eventPopulatedInputClientValidator } from "../../../../server/mongodb/models/Event";
import BoGButton from "../../../components/BoGButton";
import InputField from "../../../components/Forms/InputField";
import { RequestContext } from "../../../providers/RequestProvider";
import { createEvent, updateEvent } from "../../../queries/events";
import * as SForm from "../../sharedStyles/formStyles";
import { getOrganization } from "../../../queries/organizations";
import CustomRecurringModal from "./CustomRecurringModal";
import DropdownMenu from "../../../components/Dropdown";
import { getRegistrations } from "../../../queries/registrations";
import { editRegistration } from "../../../queries/registrations";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import DOMPurify from "dompurify";

import theme from "tailwind.config.js"; // ********ASDLHSLDFHLJKSDHFLJKSHDLKFJHSDLKJFHLKJSDFHLJKSDHF
import { is } from "date-fns/locale";

const Styled = {
  Form: styled(FForm)``,
  Col: styled(Col)`
    padding: 5px;
    padding-bottom: 3px;
  `,
  FifthCol: styled(Col)`
    padding: 5px;
    padding-bottom: 3px;
    max-width: 20%;
  `,
  ThirdCol: styled(Col)`
    padding: 5px;
    padding-bottom: 3px;
    max-width: 33%;
  `,
  ModalBody: styled(ModalBody)`
    margin-left: 1.5rem;
    margin-right: -10px;
  `,
  Row: styled(Row)`
    margin: 0.5rem 2rem 0.5rem 1rem;
  `,
};

const EventFormModal = ({
  toggle,
  event,
  isGroupEvent,
  setEvent,
  regCount,
  setEventEdit,
  editRecurringEvent = false,
}) => {
  const [sendConfirmationEmail, setSendConfirmationEmail] = useState(false);
  const [organization, setOrganization] = useState({});
  const [isNotifyAdmin, setisNotifyAdmin] = useState(
    event?.eventParent?.isNotifyAdmin ?? false
  );
  const [isValidForCourtHours, setIsValidForCourtHours] = useState(
    event?.eventParent?.isValidForCourtHours ?? false
  );
  const [sendReminderEmail, setSendReminderEmail] = useState(
    event?.eventParent?.sendReminderEmail ?? false
  );
  const [requiresApproval, setRequiresApproval] = useState(
    event?.eventParent?.requiresApproval ?? false
  );
  const {
    data: { user },
  } = useSession();

  const context = useContext(RequestContext);

  useEffect(() => {
    async function fetchData() {
      const response = await getOrganization(user.organizationId);
      if (response.data.organization)
        setOrganization(response.data.organization);
    }
    fetchData();
  }, []);

  const onSubmitCreateEvent = (values, setSubmitting) => {
    const event = {
      date: values.date,
      eventParent: values.eventParent,
      recurringEvent: values.recurringEvent,
      customRecurrenceSettings: customRecurrenceSettings,
    };
    setSubmitting(true);
    if (isGroupEvent) event.eventParent.isPrivate = true;
    if (isValidForCourtHours) event.eventParent.isValidForCourtHours = true;
    if (isNotifyAdmin) event.eventParent.isNotifyAdmin = true;
    if (sendReminderEmail) event.eventParent.sendReminderEmail = true;
    if (requiresApproval) event.eventParent.requiresApproval = true;

    createEvent(event)
      .then((res) => toggle())
      .catch((error) => {
        if (error.response.status !== 200) {
          context.startLoading();
          context.failed(error.response.data.message);
        }
      })
      .finally(() => setSubmitting(false));
  };

  const onSubmitEditEvent = (values, setSubmitting) => {
    const previousRequiresApproval = event?.eventParent?.requiresApproval;
    values.eventParent.isValidForCourtHours = isValidForCourtHours;
    values.eventParent.isNotifyAdmin = isNotifyAdmin;
    values.eventParent.sendReminderEmail = sendReminderEmail;
    values.eventParent.requiresApproval = requiresApproval;
    const editedEvent = {
      date: values.date,
      eventParent: values.eventParent,
      customRecurrenceSettings: customRecurrenceSettings,
    };
    setSubmitting(true);
    updateEvent(
      event._id,
      editedEvent,
      sendConfirmationEmail,
      editRecurringEvent
    )
      .then(() => {
        if (previousRequiresApproval === true && requiresApproval === false) {
          getRegistrations({ eventId: event._id })
            .then((response) => {
              if (response?.data?.registrations?.length > 0) {
                const updatePromises = response.data.registrations.map(
                  (registration) =>
                    editRegistration(registration._id, { approved: "approved" })
                );

                return Promise.all(updatePromises);
              }
            })
            .catch((error) =>
              console.error("Error fetching registrations:", error)
            );
        }
      })
      .catch((error) => console.error("Error updating event:", error))
      .finally(() => setSubmitting(false));

    if (setEvent) {
      const eventParentId = event.eventParent._id;
      event.date = values.date;
      event.eventParent = values.eventParent;
      setEvent(event, event._id, eventParentId, editRecurringEvent);
    }
    if (sendConfirmationEmail && setEventEdit && event?.eventParent?.title) {
      setEventEdit(
        `Registered volunteers have been successfully notified about your edit to the ${event?.eventParent?.title} event!`
      );
    } else if (sendConfirmationEmail && setEventEdit) {
      setEventEdit(
        "Registered volunteers have been successfully notified about your event edit!"
      );
    }
    setSendConfirmationEmail(false);
    // setEventEdit(null);
    toggle();
  };

  const containsExistingEvent = (event) => {
    return event;
  };

  const onSendConfirmationEmailCheckbox = () => {
    setSendConfirmationEmail(!sendConfirmationEmail);
  };

  const onCourtRequiredHoursCheckbox = () => {
    setIsValidForCourtHours(!isValidForCourtHours);
  };

  const onNotifyAdminCheckbox = () => {
    setisNotifyAdmin(!isNotifyAdmin);
  };

  const onSendReminderEmailbox = () => {
    setSendReminderEmail(!sendReminderEmail);
  };

  const onRequiresApprovalCheckbox = () => {
    setRequiresApproval(!requiresApproval);
  };

  const getLocalTime = () => {
    return new Date()
      .toLocaleDateString(undefined, { day: "2-digit", timeZoneName: "short" })
      .substring(4);
  };

  const submitText = containsExistingEvent(event) ? "Save" : "Create Event";

  // eslint-disable-next-line no-unused-vars
  const [press, setPressed] = useState(false);

  let ReactQuill;
  // patch for build failure
  if (typeof window !== "undefined") {
    ReactQuill = require("react-quill");
  }
  const quill = useRef(null);

  /* --- Recurring Event --- */

  const [recurringEventIndex, setRecurringEventIndex] = useState(0);
  const [recurringEvents, setRecurringEvents] = useState([
    "Does not repeat",
    "Daily",
    "Weekly",
    "Monthly",
    "Annually",
    "Custom...",
  ]);
  const dayMapping = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const monthMapping = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const toOrdinal = (number) => {
    const suffixes = ["th", "st", "nd", "rd"];
    const v = number % 100;
    return number + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
  };

  const updateRecurringEvents = (values) => {
    const dateValues = values.target.value.split("-");
    const date = new Date(dateValues[0], dateValues[1], dateValues[2]);
    const newRecurringEvents = [
      "Does not repeat",
      "Daily",
      `Weekly on ${dayMapping[date.getDay()]}`,
      `Monthly on ${toOrdinal(Math.floor((dateValues[2] - 1) / 7) + 1)} ${
        dayMapping[date.getDay()]
      }`,
      `Annually on ${monthMapping[date.getMonth() - 1]} ${toOrdinal(
        date.getDate()
      )}`,
      "Custom...",
    ];
    setRecurringEvents(newRecurringEvents);
    setRecurringEventIndex(recurringEventIndex);
  };

  const recurringEventsMapping = [
    "dnr",
    "daily",
    "weekly",
    "monthly",
    "annually",
    "custom",
  ];

  const handleRecurringEvent = (choice, setFieldValue) => {
    const recurringEventIndex = recurringEvents.findIndex(
      (event) => event === choice
    );
    setRecurringEventIndex(recurringEventIndex);
    setFieldValue(
      "recurringEvent",
      recurringEventsMapping[recurringEventIndex]
    );

    if (recurringEventsMapping[recurringEventIndex] == "custom") {
      toggleCustomModal();
    }
  };

  const [showCustomModal, setShowCustomModal] = useState(false);

  const toggleCustomModal = () => {
    setShowCustomModal((prev) => !prev);
  };

  const [customRecurrenceSettings, setCustomRecurrenceSettings] =
    useState(null);

  const handleCustomRecurrence = (recurrenceSettings) => {
    setCustomRecurrenceSettings(recurrenceSettings);
  };

  /* --- Recurring Event --- */

  /* Add Task */

  const [editingTask, setEditingTask] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);

  const addTask = () => {
    setEditingTask(true);
    setEditIndex(-1);
    setTaskName("");
  };

  const closeTask = () => {
    setEditingTask(false);
    setTaskName("");
    setEditIndex(-1);
  };

  const editTask = (index) => {
    setTaskName(tasks[index]);
    setEditIndex(index);
    setEditingTask(true);
  };

  const saveTask = (values, setFieldValue) => {
    if (taskName === "") {
      closeTask();
      return;
    }
    if (editIndex === -1) {
      setFieldValue("eventParent.tasks", [
        ...values.eventParent.tasks,
        taskName,
      ]);
      setTasks([...values.eventParent.tasks, taskName]);
    } else {
      setFieldValue("eventParent.tasks", [
        ...values.eventParent.tasks.slice(0, editIndex),
        taskName,
        ...values.eventParent.tasks.slice(editIndex + 1),
      ]);
      setTasks([
        ...values.eventParent.tasks.slice(0, editIndex),
        taskName,
        ...values.eventParent.tasks.slice(editIndex + 1),
      ]);
    }
    closeTask();
  };

  const deleteTask = (index, setFieldValue) => {
    setFieldValue("eventParent.tasks", [
      ...tasks.slice(0, index),
      ...tasks.slice(index + 1),
    ]);
    setTasks([...tasks.slice(0, index), ...tasks.slice(index + 1)]);
    closeTask();
  };

  const readTasks = (values) => {
    if (values?.eventParent?.tasks) {
      setTasks(values.eventParent.tasks);
    }
  };

  useEffect(() => {
    if (event?.eventParent?.tasks) {
      setTasks(event.eventParent.tasks);
    }
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null); // Click-outside handler
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

  /* -------- */

  const timeCheck = (event) => {
    if (event?.eventParent?.startTime >= event?.eventParent?.endTime) {
      setInvalidTime(true);
      return false;
    }
    setInvalidTime(false);
    return true;
  };

  const [invalidTime, setInvalidTime] = useState(false);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        date: event?.date ? event.date.split("T")[0] : "",
        recurringEvent: event?.eventParent?.recurringEvent ?? "dnr",
        eventParent: {
          title: event?.eventParent?.title ?? "",
          startTime: event?.eventParent?.startTime ?? "",
          endTime: event?.eventParent?.endTime ?? "",
          localTime: event?.eventParent?.localTime ?? "",
          address:
            event?.eventParent?.address ??
            organization.defaultEventAddress ??
            "",
          city: event?.eventParent?.city ?? organization.defaultEventCity ?? "",
          state:
            event?.eventParent?.state ?? organization.defaultEventState ?? "",
          zip: event?.eventParent?.zip ?? organization.defaultEventZip ?? "",
          eventContactPhone:
            event?.eventParent?.eventContactPhone ??
            organization.defaultContactPhone ??
            "",
          eventContactEmail:
            event?.eventParent?.eventContactEmail ??
            organization.defaultContactEmail ??
            "",
          maxVolunteers: event?.eventParent?.maxVolunteers ?? 1,
          isPrivate: event?.eventParent?.isPrivate ?? isGroupEvent,
          isValidForCourtHours:
            event?.eventParent?.isValidForCourtHours ?? false,
          isNotifyAdmin: event?.eventParent?.isNotifyAdmin ?? false,
          sendReminderEmail: event?.eventParent?.sendReminderEmail ?? false,
          requiresApproval: event?.eventParent?.requiresApproval ?? false,
          organizationId:
            event?.eventParent?.organizationId ?? user.organizationId,
          pocName: isGroupEvent ? event?.eventParent?.pocName ?? "" : "",
          pocEmail: isGroupEvent ? event?.eventParent?.pocEmail ?? "" : "",
          pocPhone: isGroupEvent ? event?.eventParent?.pocPhone ?? "" : "",
          orgName: isGroupEvent ? event?.eventParent?.orgName ?? "" : "",
          orgAddress: isGroupEvent ? event?.eventParent?.orgAddress ?? "" : "",
          orgCity: isGroupEvent ? event?.eventParent?.orgCity ?? "" : "",
          orgState: isGroupEvent ? event?.eventParent?.orgState ?? "" : "",
          orgZip: isGroupEvent ? event?.eventParent?.orgZip ?? "" : "",
          description: event?.eventParent?.description ?? "",
          tasks: event?.eventParent?.tasks ?? [],
        },
      }}
      onSubmit={(values, { setSubmitting }) => {
        containsExistingEvent(event)
          ? onSubmitEditEvent(values, setSubmitting)
          : onSubmitCreateEvent(values, setSubmitting);
      }}
      validationSchema={
        // isGroupEvent
        //   ? groupEventValidator
        //   :
        toFormikValidationSchema(
          eventPopulatedInputClientValidator(
            regCount === null || regCount === undefined
              ? 0
              : Math.max(0, regCount - 1)
          )
        )
      }
    >
      {({ values, handleSubmit, isValid, isSubmitting, setFieldValue }) => {
        return (
          <>
            <Styled.ModalBody>
              <Styled.Form>
                <SForm.FormGroup>
                  <Row>
                    <Col>
                      <Row
                        style={{
                          padding: "5px",
                          fontWeight: "bold",
                          color: "black",
                        }}
                      >
                        Event Information
                      </Row>
                      <Row>
                        <Styled.ThirdCol>
                          <InputField
                            label="Title"
                            isRequired={true}
                            name="eventParent.title"
                            maxLength={80}
                            placeholder="Title of the Event"
                          />
                        </Styled.ThirdCol>
                        <Styled.FifthCol>
                          <InputField
                            label="Max Volunteers"
                            isRequired={true}
                            name="eventParent.maxVolunteers"
                            type="number"
                            min={1}
                            placeholder="Max Number"
                          />
                        </Styled.FifthCol>
                        <Styled.Col>
                          <div className="h-100 flex flex-col justify-center">
                            <Label className="mb-1 flex h-6 items-center font-black">
                              Requires Approval
                            </Label>
                            <div>
                              <div className="inline-flex items-center">
                                <div
                                  className={
                                    "relative h-6 w-11 cursor-pointer rounded-full bg-gray-200 " +
                                    (requiresApproval ? "bg-primaryColor" : "")
                                  }
                                  onClick={() => {
                                    onRequiresApprovalCheckbox(
                                      !requiresApproval
                                    );
                                  }}
                                >
                                  <div
                                    className={
                                      "absolute start-[2px] top-[2px] h-5 w-5 rounded-full bg-white transition-all content-[''] " +
                                      (requiresApproval
                                        ? "translate-x-full border-white"
                                        : "")
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </Styled.Col>
                      </Row>
                      <Row>
                        <Styled.Col>
                          <div className="flex flex-row justify-between gap-2 max-lg:flex-wrap">
                            <div className="flex w-full max-w-full flex-row justify-between gap-2">
                              <div className="w-full max-w-[33%]">
                                <InputField
                                  label="Date"
                                  isRequired={true}
                                  name="date"
                                  type="date"
                                  onChangeCapture={(e) =>
                                    updateRecurringEvents(e)
                                  }
                                  disabled={editRecurringEvent}
                                />
                              </div>
                              <div className="w-full max-w-[33%]">
                                <InputField
                                  label="Start Time"
                                  isRequired={true}
                                  name="eventParent.startTime"
                                  type="time"
                                  invalid={invalidTime}
                                />
                              </div>
                              <div className="w-full max-w-[33%]">
                                <InputField
                                  label="End Time"
                                  isRequired={true}
                                  name="eventParent.endTime"
                                  type="time"
                                  invalid={invalidTime}
                                />
                              </div>
                            </div>
                            <div className="flex w-full flex-row justify-between gap-2">
                              <div className="w-full max-w-[50%]">
                                <Label className="mb-1 flex h-6 items-center font-black">
                                  Recurring Event
                                </Label>
                                <DropdownMenu
                                  value={recurringEvents[recurringEventIndex]}
                                  options={recurringEvents}
                                  callback={(choice) => {
                                    handleRecurringEvent(choice, setFieldValue);
                                  }}
                                  arrow
                                  disabled={editRecurringEvent}
                                />
                                <CustomRecurringModal
                                  open={showCustomModal}
                                  toggle={toggleCustomModal}
                                  setRecurrence={handleCustomRecurrence}
                                  recurrenceSettings={customRecurrenceSettings}
                                />
                              </div>
                              <div className="w-full max-w-[50%]">
                                <Label className="mb-[3.5px] flex h-6 items-center font-black">
                                  Tasks
                                </Label>
                                <div
                                  className="relative w-full"
                                  ref={dropdownRef}
                                >
                                  <div
                                    onClick={() => setIsOpen(!isOpen)}
                                    style={{ cursor: "pointer" }}
                                    className="flex h-[40px] w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-black hover:bg-gray-50 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  >
                                    <span>
                                      {tasks.length > 0
                                        ? `${tasks.length} tasks`
                                        : "Select tasks"}
                                    </span>
                                    <ChevronDownIcon className="ml-2 h-4 w-4" />
                                  </div>

                                  {isOpen && (
                                    <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
                                      <div className="max-h-60 overflow-y-auto p-2">
                                        {tasks.map((task, index) => (
                                          <div
                                            key={index}
                                            className="group flex items-center justify-between rounded-md p-2 hover:bg-gray-100"
                                          >
                                            {editIndex === index ? (
                                              <div className="flex w-full flex-col gap-2">
                                                <input
                                                  autoFocus
                                                  value={taskName}
                                                  onChange={(e) =>
                                                    setTaskName(e.target.value)
                                                  }
                                                  onKeyDown={(e) =>
                                                    e.key === "Enter" &&
                                                    saveTask(
                                                      values,
                                                      setFieldValue
                                                    )
                                                  }
                                                  className="w-full rounded-md border px-2 py-1 text-sm"
                                                  placeholder="Edit task name"
                                                />
                                                <div className="flex gap-2">
                                                  <button
                                                    onClick={() =>
                                                      saveTask(
                                                        values,
                                                        setFieldValue
                                                      )
                                                    }
                                                    className="rounded-md bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
                                                  >
                                                    Update
                                                  </button>
                                                  <button
                                                    onClick={() =>
                                                      deleteTask(
                                                        index,
                                                        setFieldValue
                                                      )
                                                    }
                                                    className="rounded-md bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                                                  >
                                                    Delete
                                                  </button>
                                                </div>
                                              </div>
                                            ) : (
                                              <>
                                                <span className="flex-1 text-sm">
                                                  {task}
                                                </span>
                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100">
                                                  <button
                                                    onClick={() =>
                                                      editTask(index)
                                                    }
                                                    className="text-blue-600 hover:text-blue-800"
                                                  >
                                                    Edit
                                                  </button>
                                                  <button
                                                    onClick={() =>
                                                      deleteTask(
                                                        index,
                                                        setFieldValue
                                                      )
                                                    }
                                                    className="text-red-600 hover:text-red-800"
                                                  >
                                                    <svg
                                                      xmlns="http://www.w3.org/2000/svg"
                                                      fill="none"
                                                      viewBox="0 0 24 24"
                                                      strokeWidth="1.5"
                                                      stroke="currentColor"
                                                      className="h-4 w-4"
                                                    >
                                                      <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M6 18L18 6M6 6l12 12"
                                                      />
                                                    </svg>
                                                  </button>
                                                </div>
                                              </>
                                            )}
                                          </div>
                                        ))}

                                        <div className="border-t pt-2">
                                          {editingTask && editIndex === -1 ? (
                                            <div className="flex flex-col gap-2">
                                              <input
                                                autoFocus
                                                value={taskName}
                                                onChange={(e) =>
                                                  setTaskName(e.target.value)
                                                }
                                                onKeyDown={(e) =>
                                                  e.key === "Enter" &&
                                                  saveTask(
                                                    values,
                                                    setFieldValue
                                                  )
                                                }
                                                className="w-full rounded-md border px-2 py-1 text-sm"
                                                placeholder="New task name"
                                              />
                                              <div className="flex gap-2">
                                                <button
                                                  onClick={() => {
                                                    saveTask(
                                                      values,
                                                      setFieldValue
                                                    );
                                                  }}
                                                  className="rounded-md bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400 focus:outline-none"
                                                >
                                                  Cancel
                                                </button>

                                                {/* Add Button */}
                                                <button
                                                  onClick={() => {
                                                    saveTask(
                                                      values,
                                                      setFieldValue
                                                    );
                                                  }}
                                                  className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none"
                                                >
                                                  Add
                                                </button>
                                              </div>
                                            </div>
                                          ) : (
                                            <button
                                              onClick={addTask}
                                              className="flex w-full items-center gap-2 rounded-md p-2 text-sm text-gray-600 hover:bg-gray-100"
                                            >
                                              + Add new task
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Click-outside handler */}
                                  {isOpen && (
                                    <div
                                      className="fixed inset-0 z-0 bg-transparent"
                                      onClick={() => setIsOpen(false)}
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Styled.Col>
                      </Row>
                      <Row
                        style={{
                          padding: "5px",
                          fontWeight: "bold",
                          color: "black",
                          marginTop: "1rem",
                        }}
                      >
                        Event Location
                      </Row>
                      <Row>
                        <Styled.Col>
                          <InputField
                            label="Address"
                            isRequired={true}
                            name="eventParent.address"
                            type="text"
                            placeholder="Detailed Address"
                          />
                        </Styled.Col>
                        <Styled.FifthCol>
                          <InputField
                            label="City"
                            isRequired={true}
                            name="eventParent.city"
                            type="text"
                            placeholder="City"
                          />
                        </Styled.FifthCol>
                        <Styled.FifthCol>
                          <InputField
                            label="State"
                            isRequired={true}
                            name="eventParent.state"
                            type="text"
                            placeholder="State"
                          />
                        </Styled.FifthCol>
                        <Styled.FifthCol>
                          <InputField
                            label="Zip Code"
                            isRequired={true}
                            name="eventParent.zip"
                            type="text"
                            placeholder="00000"
                          />
                        </Styled.FifthCol>
                      </Row>
                      <Row
                        style={{
                          padding: "5px",
                          fontWeight: "bold",
                          color: "black",
                          marginTop: "1rem",
                        }}
                      >
                        Event Contact
                      </Row>
                      <Row>
                        <Styled.Col>
                          <InputField
                            label="Email Address"
                            isRequired={true}
                            name="eventParent.eventContactEmail"
                            type="email"
                            placeholder="example@email.com"
                          />
                        </Styled.Col>
                        <Styled.Col>
                          <InputField
                            label="Phone Number"
                            isRequired={true}
                            name="eventParent.eventContactPhone"
                            type="tel"
                            placeholder="xxx-xxx-xxxx"
                          />
                        </Styled.Col>
                      </Row>
                    </Col>
                    {isGroupEvent && (
                      <Col>
                        <Row
                          style={{
                            marginLeft: "0.5rem",
                            padding: "5px",
                            fontWeight: "bold",
                            color: "gray",
                          }}
                        >
                          Organization Information
                        </Row>
                        <div
                          style={{
                            backgroundColor: "#F4F4F4",
                            marginLeft: "1rem",
                            marginRight: "-2rem",
                            padding: "1rem",
                            paddingLeft: "1rem",
                          }}
                        >
                          <Row>
                            <Styled.Col>
                              <InputField
                                label="Name"
                                isRequired={true}
                                name="eventParent.orgName"
                                type="text"
                              />
                            </Styled.Col>
                          </Row>
                          <Row>
                            <Styled.Col>
                              <InputField
                                label="Address"
                                isRequired={true}
                                name="eventParent.orgAddress"
                                type="text"
                              />
                            </Styled.Col>
                          </Row>
                          <Row>
                            <Styled.Col>
                              <InputField
                                label="City"
                                isRequired={true}
                                name="eventParent.orgCity"
                                type="text"
                              />
                            </Styled.Col>
                            <Styled.FifthCol>
                              <InputField
                                label="State"
                                isRequired={true}
                                name="eventParent.orgState"
                                type="text"
                              />
                            </Styled.FifthCol>
                            <Styled.ThirdCol>
                              <InputField
                                label="Zip Code"
                                isRequired={true}
                                name="eventParent.orgZip"
                                type="text"
                                placeholder="00000"
                              />
                            </Styled.ThirdCol>
                          </Row>
                          <Row
                            style={{
                              marginLeft: "-0.7rem",
                              fontWeight: "bold",
                              color: "gray",
                            }}
                          >
                            Point of Contact
                          </Row>
                          <Row>
                            <Styled.Col>
                              <InputField
                                label="Name"
                                isRequired={true}
                                name="eventParent.pocName"
                                type="text"
                              />
                            </Styled.Col>
                            <Styled.Col>
                              <InputField
                                label="Phone Number"
                                isRequired={true}
                                name="eventParent.pocPhone"
                                type="tel"
                              />
                            </Styled.Col>
                          </Row>
                          <Row>
                            <Styled.Col>
                              <InputField
                                label="Email Address"
                                isRequired={true}
                                name="eventParent.pocEmail"
                                type="email"
                              />
                            </Styled.Col>
                          </Row>
                        </div>
                      </Col>
                    )}
                  </Row>
                  <Row
                    style={{
                      padding: "5px",
                      fontWeight: "bold",
                      color: "black",
                    }}
                  >
                    Description
                  </Row>
                  <Row
                    style={{
                      marginRight: "-0.86rem",
                    }}
                  >
                    <Styled.Col>
                      <Field name="eventParent.description" className="h-48">
                        {() => (
                          <ReactQuill
                            value={values.eventParent.description}
                            onChange={(newValue) => {
                              setFieldValue(
                                "eventParent.description",
                                DOMPurify.sanitize(newValue)
                              );
                            }}
                            modules={{
                              toolbar: [
                                "bold",
                                "italic",
                                "underline",
                                {},
                                { align: [] },
                                {},
                                "link",
                                "image",
                                "clean",
                              ],
                            }}
                            ref={quill}
                            placeholder="Write your description here."
                            className="flex flex-col-reverse overflow-hidden rounded-lg border !border-gray-300 !border-gray-300 [&_.ql-container]:border-0 [&_.ql-toolbar]:border-0 [&_.ql-toolbar]:border-t"
                          />
                        )}
                      </Field>
                    </Styled.Col>
                  </Row>
                </SForm.FormGroup>
              </Styled.Form>
              <Row
                style={{
                  padding: "5px",
                  fontWeight: "bold",
                  color: "black",
                  marginTop: "1rem",
                }}
              >
                Other
              </Row>
              <Styled.Row>
                <div className="flex w-full flex-wrap gap-6">
                  <div>
                    <Label>Notify admins upon registration </Label>
                    <div>
                      <div className="inline-flex cursor-pointer items-center">
                        <div
                          className={
                            "relative h-6 w-11 rounded-full bg-gray-200 " +
                            (isNotifyAdmin ? "bg-primaryColor" : "")
                          }
                          onClick={() => onNotifyAdminCheckbox()}
                        >
                          <div
                            className={
                              "absolute start-[2px] top-[2px] h-5 w-5 rounded-full bg-white transition-all content-[''] " +
                              (isNotifyAdmin
                                ? "translate-x-full border-white"
                                : "")
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label>
                      Send reminder emails 48 hours before the event{" "}
                    </Label>
                    <div>
                      <label className="inline-flex cursor-pointer items-center">
                        <div
                          className={
                            "relative h-6 w-11 rounded-full bg-gray-200 " +
                            (sendReminderEmail ? "bg-primaryColor" : "")
                          }
                          onClick={() => onSendReminderEmailbox()}
                        >
                          <div
                            className={
                              "absolute start-[2px] top-[2px] h-5 w-5 rounded-full bg-white transition-all content-[''] " +
                              (sendReminderEmail
                                ? "translate-x-full border-white"
                                : "")
                            }
                          />
                        </div>
                      </label>
                    </div>
                  </div>
                  <div>
                    <Label>
                      Event can count towards volunteer&apos;s court required
                      hours
                    </Label>
                    <div>
                      <label className="inline-flex cursor-pointer items-center">
                        <div
                          className={
                            "relative h-6 w-11 rounded-full bg-gray-200 " +
                            (isValidForCourtHours ? "bg-primaryColor" : "")
                          }
                          onClick={() => onCourtRequiredHoursCheckbox()}
                        >
                          <div
                            className={
                              "absolute start-[2px] top-[2px] h-5 w-5 rounded-full bg-white transition-all content-[''] " +
                              (isValidForCourtHours
                                ? "translate-x-full border-white"
                                : "")
                            }
                          />
                        </div>
                      </label>
                    </div>
                  </div>
                  {containsExistingEvent(event) && (
                    <div>
                      <Label>
                        I would like to send an email to volunteers with updated
                        information
                      </Label>
                      <div>
                        <label className="inline-flex cursor-pointer items-center">
                          <div
                            className={
                              "relative h-6 w-11 rounded-full bg-gray-200 " +
                              (sendConfirmationEmail ? "bg-primaryColor" : "")
                            }
                            onClick={() => onSendConfirmationEmailCheckbox()}
                          >
                            <div
                              className={
                                "absolute start-[2px] top-[2px] h-5 w-5 rounded-full bg-white transition-all content-[''] " +
                                (sendConfirmationEmail
                                  ? "translate-x-full border-white"
                                  : "")
                              }
                            />
                          </div>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </Styled.Row>
              <Row>
                <div>
                  {invalidTime && (
                    <div className="w-full text-left">
                      <strong>Start time must be before end time.</strong>
                    </div>
                  )}
                  <div className="justify-begin flex w-full flex-row gap-2">
                    <BoGButton
                      text={submitText}
                      onClick={() => {
                        if (!timeCheck(values)) return;
                        handleSubmit();
                        setPressed(true);
                      }}
                      disabled={!isValid || isSubmitting}
                    />
                    <BoGButton text="Cancel" onClick={toggle} outline={true} />
                  </div>
                </div>
              </Row>
            </Styled.ModalBody>
          </>
        );
      }}
    </Formik>
  );
};

EventFormModal.propTypes = {
  event: PropTypes.object.isRequired,
  toggle: PropTypes.func.isRequired,
  isGroupEvent: PropTypes.bool.isRequired,
  setEvent: PropTypes.func.isRequired,
  setEventEdit: PropTypes.func,
  editRecurringEvent: PropTypes.bool,
};

export default EventFormModal;
