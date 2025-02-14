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

const CustomRecurringModal = ({ open, toggle }) => {
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
  const [date, setDate] = useState(dateName[0]);

  const everyChoices = ["day", "week", "month", "year"];
  const everyChoicesP = ["days", "weeks", "months", "years"];

  const [everyChoice, setEveryChoice] = useState("day");

  const [repeatNumber, setRepeatNumber] = useState(1);

  console.log(everyChoice);

  useEffect(() => {
    var choice;
    console.log(repeatNumber);
    console.log(everyChoice);
    if (everyChoices.includes(everyChoice)) {
      console.log("no P");
      choice = everyChoices.indexOf(everyChoice);
    }
    else choice = everyChoicesP.indexOf(everyChoice);

    console.log(choice);

    if (repeatNumber > 1) setEveryChoice(everyChoicesP[choice]);
    else setEveryChoice(everyChoices[choice]);
  }, [repeatNumber]);


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
              className="h-[24px] w-full rounded-md border-0 bg-grey p-2 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <DropdownMenu
              value={everyChoice}
              options={repeatNumber > 1 ? everyChoicesP : everyChoices}
              callback={(option) => {
                setEveryChoice(option);
                console.log(option);
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
                  className={
                    "flex h-[28px] w-[28px] cursor-pointer items-center justify-center rounded-full " +
                    (date !== name
                      ? "bg-grey text-black hover:bg-secondaryColor"
                      : "bg-primaryColor text-white")
                  }
                  onClick={() => {
                    setDate(name);
                  }}
                >
                  {dateChars[index]}
                </div>
              ))}
            </div>
          </div>
          <div>Ends</div>
          <div className="flex flex-col gap-4 pl-2">
            <div
              onClick={() => setRecurringEvent(false)}
              className="flex items-center gap-4"
            >
              <div className="flex h-[22px] w-[22px] items-center justify-center rounded-full border-[1.5px] border-primaryColor bg-white">
                {/* {!recurringEvent && (
                  <div className="h-[10.5px] w-[10.5px] rounded-full bg-primaryColor"></div>
                )} */}
              </div>
              <span>This event</span>
            </div>
            <div
              onClick={() => setRecurringEvent(true)}
              className="flex items-center gap-4"
            >
              <div className="flex h-[22px] w-[22px] items-center justify-center rounded-full border-[1.5px] border-primaryColor bg-white">
                {/* {recurringEvent && (
                  <div className="h-[10.5px] w-[10.5px] rounded-full bg-primaryColor"></div>
                )} */}
              </div>
              <span>This and future events</span>
            </div>
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
                // setRecurringEventConfirm(true);
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
  event: PropTypes.object.isRequired,
  setEvent: PropTypes.func,
  setEventEdit: PropTypes.func,
};

export default CustomRecurringModal;
