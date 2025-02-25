import { Label, Tooltip, TextInput } from "flowbite-react";
import { Field, Form as FForm, Formik, ErrorMessage } from "formik";
import { useSession } from "next-auth/react";
import PropTypes from "prop-types";
import { useContext, useEffect, useRef, useState } from "react";
import "react-quill/dist/quill.snow.css";
import { Col, FormGroup, Input, ModalBody, ModalFooter, Row } from "reactstrap";
import styled from "styled-components";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { eventPopulatedInputClientValidator } from "../../../../server/mongodb/models/Event";
import BoGButton from "../../../components/BoGButton";
import InputField from "../../../components/Forms/InputField";
import Text from "../../../components/Text";
import { RequestContext } from "../../../providers/RequestProvider";
import { createEvent, updateEvent } from "../../../queries/events";
import * as SForm from "../../sharedStyles/formStyles";
import { getOrganization } from "../../../queries/organizations";
import CustomRecurringModal from "./CustomRecurringModal";
import DropdownMenu from "../../../components/Dropdown";
import { getRegistrations } from "../../../queries/registrations";
import { editRegistration } from "../../../queries/registrations";
import { Dropdown } from "flowbite-react";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

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
                          color: "gray",
                        }}
                      >
                        Event Information
                      </Row>
                      <Row>
                        <Styled.Col>
                          <InputField
                            label="Title"
                            isRequired={true}
                            name="eventParent.title"
                            maxLength={80}
                          />
                        </Styled.Col>
                        <Styled.ThirdCol>
                          <InputField
                            label="Max Volunteers"
                            isRequired={true}
                            name="eventParent.maxVolunteers"
                            type="number"
                            min={1}
                          />
                        </Styled.ThirdCol>
                      </Row>
                      <Row>
                        <Styled.Col>
                          <InputField
                            label="Date"
                            isRequired={true}
                            name="date"
                            type="date"
                            onChangeCapture={(e) => updateRecurringEvents(e)}
                          />
                        </Styled.Col>
                        <Styled.Col>
                          <InputField
                            label="Start Time"
                            isRequired={true}
                            name="eventParent.startTime"
                            type="time"
                          />
                        </Styled.Col>
                        <Styled.Col>
                          <InputField
                            label="End Time"
                            isRequired={true}
                            name="eventParent.endTime"
                            type="time"
                          />
                        </Styled.Col>
                        <Styled.Col>
                          <div className="w-full">
                            <Label className="mb-[3.5px] flex h-6 items-center font-medium text-slate-600">
                              Tasks
                            </Label>
                            <div className="relative w-full" ref={dropdownRef}>
                              <div
                                onClick={() => setIsOpen(!isOpen)}
                                style={{ cursor: "pointer" }}
                                className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                                                saveTask(values, setFieldValue)
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
                                                onClick={() => editTask(index)}
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
                                      {editingTask ? (
                                        <div className="flex flex-col gap-2">
                                          <input
                                            autoFocus
                                            value={taskName}
                                            onChange={(e) =>
                                              setTaskName(e.target.value)
                                            }
                                            onKeyDown={(e) =>
                                              e.key === "Enter" &&
                                              saveTask(values, setFieldValue)
                                            }
                                            className="w-full rounded-md border px-2 py-1 text-sm"
                                            placeholder="New task name"
                                          />
                                          <div className="flex gap-2">
                                            <button
                                              onClick={() => {
                                                saveTask(values, setFieldValue);
                                              }}
                                              className="rounded-md bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400 focus:outline-none"
                                            >
                                              Cancel
                                            </button>

                                            {/* Add Button */}
                                            <button
                                              onClick={() => {
                                                saveTask(values, setFieldValue);
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
                        </Styled.Col>
                      </Row>
                      <Row>
                        <Styled.Col>
                          <Label className="mb-1 flex h-6 items-center font-medium text-slate-600">
                            Recurring
                          </Label>
                          <DropdownMenu
                            value={recurringEvents[recurringEventIndex]}
                            options={recurringEvents}
                            callback={(choice) => {
                              handleRecurringEvent(choice, setFieldValue);
                            }}
                            arrow
                          />
                          <CustomRecurringModal
                            open={showCustomModal}
                            toggle={toggleCustomModal}
                            setRecurrence={handleCustomRecurrence}
                            recurrenceSettings={customRecurrenceSettings}
                            // event={event}
                            // setEvent={(
                            //   e,
                            //   id,
                            //   eventParentId,
                            //   recurringEvent
                            // ) => {
                            //   setEvent(e);
                            //   onEventEdit(id, eventParentId, recurringEvent);
                            // }}
                            // regCount={regCount}
                            // setEventEdit={props?.setEventEdit}
                          />
                        </Styled.Col>
                      </Row>
                      <Row
                        style={{
                          padding: "5px",
                          fontWeight: "bold",
                          color: "gray",
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
                          />
                        </Styled.Col>
                      </Row>
                      <Row>
                        <Styled.Col>
                          <InputField
                            label="City"
                            isRequired={true}
                            name="eventParent.city"
                            type="text"
                          />
                        </Styled.Col>
                        <Styled.FifthCol>
                          <InputField
                            label="State"
                            isRequired={true}
                            name="eventParent.state"
                            type="text"
                          />
                        </Styled.FifthCol>
                        <Styled.ThirdCol>
                          <InputField
                            label="Zip Code"
                            isRequired={true}
                            name="eventParent.zip"
                            type="text"
                          />
                        </Styled.ThirdCol>
                      </Row>
                      <Row
                        style={{
                          // paddingLeft: "5.2rem",
                          padding: "5px",
                          fontWeight: "bold",
                          color: "gray",
                        }}
                      >
                        Event Contact
                      </Row>
                      <Row>
                        <Styled.Col>
                          <InputField
                            label="Phone Number"
                            isRequired={true}
                            name="eventParent.eventContactPhone"
                            type="tel"
                          />
                        </Styled.Col>
                        <Styled.Col>
                          <InputField
                            label="Email Address"
                            isRequired={true}
                            name="eventParent.eventContactEmail"
                            type="email"
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
                      marginRight: "-2rem",
                    }}
                  >
                    <Styled.Col>
                      <div className="flex flex-row">
                        <Label class="mb-1 h-6 font-medium text-slate-600">
                          Description
                        </Label>
                      </div>

                      <Field name="eventParent.description">
                        {() => (
                          <ReactQuill
                            value={values.eventParent.description}
                            onChange={(newValue) => {
                              setFieldValue(
                                "eventParent.description",
                                newValue
                              );
                            }}
                            ref={quill}
                          />
                        )}
                      </Field>
                    </Styled.Col>
                  </Row>
                </SForm.FormGroup>
              </Styled.Form>
              <div className="flex flex-row">
                <Label class="mb-1 h-6 font-medium text-slate-600">Other</Label>
              </div>
              <Styled.Row>
                <FormGroup>
                  <Input
                    defaultChecked={isValidForCourtHours}
                    type="checkbox"
                    onChange={onCourtRequiredHoursCheckbox}
                  />
                  <Text
                    text="This event can count towards volunteer's court required
                    hours"
                  />
                  <Input
                    defaultChecked={isNotifyAdmin}
                    type="checkbox"
                    onChange={onNotifyAdminCheckbox}
                  />
                  <Text text="Notify admins upon registration" />
                  <Input
                    defaultChecked={sendReminderEmail}
                    type="checkbox"
                    onChange={onSendReminderEmailbox}
                  />
                  <Text text="Send reminder emails 48 hours before the event" />
                  <Input
                    defaultChecked={requiresApproval}
                    type="checkbox"
                    onChange={onRequiresApprovalCheckbox}
                  />
                  <Text text="Requires Approval" />
                  {containsExistingEvent(event) && (
                    <div>
                      <Input
                        type="checkbox"
                        onChange={onSendConfirmationEmailCheckbox}
                      />
                      <Text text="I would like to send an email to volunteers with updated information" />
                    </div>
                  )}
                </FormGroup>
              </Styled.Row>
            </Styled.ModalBody>
            <ModalFooter>
              <BoGButton text="Cancel" onClick={toggle} outline={true} />
              <BoGButton
                text={submitText}
                onClick={() => {
                  handleSubmit();
                  setPressed(true);
                }}
                disabled={!isValid || isSubmitting}
              />
            </ModalFooter>
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
