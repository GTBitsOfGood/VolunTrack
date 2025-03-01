import { Modal, ModalHeader } from "reactstrap";
import styled from "styled-components";
import PropTypes from "prop-types";
import variables from "../../../design-tokens/_variables.module.scss";
import BoGButton from "../../../components/BoGButton";
import { useEffect, useState } from "react";
import DropdownMenu from "../../../components/Dropdown";

const Styled = {
  ModalHeader: styled(ModalHeader)`
    border-color: transparent;
    p {
      color: ${variables["dark"]};
      font-weight: 700;
      margin-top: 2rem;
      margin-left: 4.5rem;
      padding-right: 3.5rem;
      padding-left: 3.5rem;
      border-bottom: 2px solid ${variables["dark"]};
    }
  `,
};

const CustomRecurringModal = ({
  open,
  toggle,
  setRecurrence,
  recurrenceSettings,
}) => {
  /* Recurrence Selection */
  const dateChars = ["M", "T", "W", "T", "F", "S", "S"];
  const dateName = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  const [date, setDate] = useState([]);

  const everyChoices = ["day", "week", "month", "year"];
  const everyChoicesP = ["days", "weeks", "months", "years"];

  const [everyChoice, setEveryChoice] = useState("week");
  const [repeatNumber, setRepeatNumber] = useState(1);

  useEffect(() => {
    var choice;
    if (everyChoices.includes(everyChoice)) {
      choice = everyChoices.indexOf(everyChoice);
    } else choice = everyChoicesP.indexOf(everyChoice);

    if (repeatNumber > 1) setEveryChoice(everyChoicesP[choice]);
    else setEveryChoice(everyChoices[choice]);
  }, [repeatNumber]);

  /* Recurrence Selection */

  /* Date Selection */

  const [dateSelection, setDateSelection] = useState(false);

  useEffect(() => {
    setDateSelection(
      !(
        everyChoice === "day" ||
        everyChoice === "days" ||
        everyChoice === "year" ||
        everyChoice === "years"
      )
    );
  }, [everyChoice]);

  /* Date Selection */

  /* End Selection */

  const [endChoice, setEndChoice] = useState("Never");

  const endChoices = ["Never", "On", "After"];

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateSplitTomorrow = tomorrow.toISOString().split("T")[0].split("-");

  const [onDate, setOnDate] = useState(
    new Date(
      dateSplitTomorrow[0],
      dateSplitTomorrow[1] - 1,
      dateSplitTomorrow[2]
    )
  ); // Format as "YYYY-MM-DD"

  const [occurences, setOccurences] = useState(1);

  useEffect(() => {
    if (recurrenceSettings) {
      setEveryChoice(recurrenceSettings.recurrenceChoice);
      setRepeatNumber(recurrenceSettings.recurrenceNumber);
      setDate(recurrenceSettings.recurrenceDays);
      setEndChoice(recurrenceSettings.recurrenceEndType);
      setOnDate(recurrenceSettings.recurrenceEndDate);
      setOccurences(recurrenceSettings.recurrenceEndOccurences);
    }
  }, [recurrenceSettings]);

  /* End Selection */

  return (
    <Modal
      style={{ maxWidth: "300px" }}
      isOpen={open}
      toggle={toggle}
      size="xl"
      centered
    >
      <div>
        <div className="flex flex-col gap-4 px-3 py-2">
          <span className="text-xl font-bold">Custom Recurrence</span>
          <div className="flex flex-row items-center gap-2">
            <span className="whitespace-nowrap text-[15px]">Repeat every</span>
            <input
              type="number"
              min="1"
              value={repeatNumber.toString()}
              onChange={(e) => {
                if (e.target.value === "") setRepeatNumber(0);
                else setRepeatNumber(Math.abs(parseInt(e.target.value) * -1));
              }}
              pattern="\d*"
              className="h-[24px] w-full rounded-md border-0 bg-grey p-2 focus:outline-none focus:ring-0 focus:ring-offset-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <DropdownMenu
              value={everyChoice}
              options={repeatNumber > 1 ? everyChoicesP : everyChoices}
              callback={(option) => {
                setEveryChoice(option);
              }}
              className="flex h-[24px] items-center justify-between rounded-md border-0 bg-grey p-2"
              arrow
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-[15px]">Repeat on</div>
            <div className="flex flex-row gap-2">
              {dateName.map((name, index) => (
                <div
                  key={index}
                  className={
                    "flex h-[28px] w-[28px] cursor-pointer items-center justify-center rounded-full " +
                    (!date.includes(name)
                      ? "bg-grey text-black hover:bg-secondaryColor"
                      : "bg-primaryColor text-white") +
                    (!dateSelection ? " brightness-50" : "")
                  }
                  onClick={() => {
                    if (dateSelection) {
                      if (date.includes(name)) {
                        setDate(date.filter((d) => d !== name));
                      } else {
                        setDate([...date, name]);
                      }
                    }
                  }}
                >
                  {dateChars[index]}
                </div>
              ))}
            </div>
          </div>
          <div>Ends</div>
          <div className="flex flex-col gap-4 pl-2">
            {endChoices.map((choice, index) => (
              <div className="items- flex flex-row" key={index}>
                <div
                  onClick={() => setEndChoice(choice)}
                  className="flex w-[98px] items-center gap-4"
                >
                  <div className="flex h-[22px] w-[22px] items-center justify-center rounded-full border-[1.5px] border-primaryColor bg-white">
                    {endChoice === choice && (
                      <div className="h-[10.5px] w-[10.5px] rounded-full bg-primaryColor"></div>
                    )}
                  </div>
                  <span>{choice}</span>
                </div>
                {choice === "On" && (
                  <input
                    type="date"
                    value={onDate ? onDate.toISOString().split("T")[0] : ""}
                    className={
                      "h-[24px] rounded-md border-0 bg-grey p-2 " +
                      (endChoice !== "On" ? " brightness-50" : "")
                    }
                    disabled={endChoice !== "On"}
                    onChange={(e) => {
                      const dateSplit = e.target.value.split("-");
                      setOnDate(
                        new Date(dateSplit[0], dateSplit[1] - 1, dateSplit[2])
                      );
                    }}
                  />
                )}
                {choice === "After" && (
                  <div
                    className={
                      "flex h-[24px] items-center rounded-md border-0 bg-grey p-2 " +
                      (endChoice !== "After" ? " brightness-50" : "")
                    }
                  >
                    <input
                      type="number"
                      min="1"
                      max="999"
                      value={occurences.toString()}
                      onChange={(e) => {
                        if (e.target.value === "") setOccurences(0);
                        else
                          setOccurences(
                            Math.abs(parseInt(e.target.value) * -1)
                          );
                      }}
                      pattern="\d*"
                      disabled={endChoice !== "After"}
                      className="h-[24px] w-[48px] rounded-md border-0 bg-grey p-2 focus:outline-none focus:ring-0 focus:ring-offset-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                    occurences
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <BoGButton
              text="Cancel"
              onClick={() => {
                toggle();
              }}
              outline={true}
            />
            <BoGButton
              text="Confirm"
              onClick={() => {
                toggle();
                setRecurrence({
                  recurrenceChoice: everyChoice,
                  recurrenceNumber: repeatNumber,
                  recurrenceDays: date,
                  recurrenceEndType: endChoice,
                  recurrenceEndDate: onDate,
                  recurrenceEndOccurences: occurences,
                });
              }}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};
CustomRecurringModal.propTypes = {
  open: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  setRecurrence: PropTypes.func.isRequired,
  recurrenceSettings: PropTypes.object,
};

export default CustomRecurringModal;
