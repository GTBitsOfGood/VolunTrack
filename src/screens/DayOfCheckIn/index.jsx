import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import InputField from "../../components/Forms/InputField";
import { checkInValidator } from "./helpers";
import { getWaivers } from "../../queries/waivers";
import { useRouter } from "next/router";
import { createUserFromCheckIn, getEvent } from "../../queries/events";
import { Button, Label } from "flowbite-react";
import Text from "../../components/Text";
import { FormGroup, Input } from "reactstrap";
import { sendResetPasswordEmail } from "../../queries/users";

const DayOfCheckin = () => {
  const router = useRouter();
  const { eventId } = router.query;
  let [event, setEvent] = useState([]);
  let [didAgree, setDidAgree] = useState(false);
  let [adultWaiver, setAdultWaiver] = useState();

  const onRefresh = async () => {
    await getEvent(eventId).then(async (result) => {
      setEvent(result.data.event.eventParent);
      await getWaivers(
        "adult",
        result.data.event.eventParent.organizationId
      ).then((result) => {
        if (result.data.waivers.length > 0) {
          setAdultWaiver(result.data.waivers[0]?.text);
        }
      });
    });
  };

  useEffect(() => {
    onRefresh();
  }, []);

  const checkIn = async (values) => {
    const createUserVals = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.volunteerEmail,
      organizationId: event.organizationId,
    };

    createUserFromCheckIn(eventId, createUserVals, event.title).then(
      async (result) => {
        if (result.createdUser) {
          await sendResetPasswordEmail(createUserVals.email, true);
        }
        router.replace("/login");
      }
    );
  };

  const changeAgreement = () => {
    setDidAgree(!didAgree);
  };

  return (
    <div className="flex-column mx-auto mb-8 mt-16 flex w-5/6 items-center justify-center rounded-xl border py-8 shadow-xl sm:w-[28rem]">
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          volunteerEmail: "",
        }}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(true);
          checkIn(values);
          setSubmitting(false);
        }}
        validationSchema={checkInValidator}
      >
        {({ handleSubmit, isValid, isSubmitting }) => (
          <form className="flex-column flex items-center space-y-2">
            <Text
              className="px-3"
              type="subheader"
              text={`Check in for ${event.title}`}
            ></Text>
            <div className="w-11/12">
              <div className="flex w-full justify-evenly space-x-5">
                <InputField
                  name="firstName"
                  placeholder="First Name"
                  label="First Name"
                />

                <InputField
                  name="lastName"
                  label="Last Name"
                  placeholder="Last Name"
                />
              </div>
              <InputField
                name="volunteerEmail"
                label="Email Address"
                placeholder="Your Email"
                type="email"
              />
              {adultWaiver && (
                <div>
                  <Label className="mb-1 h-6 font-medium text-slate-600">
                    Participation Waiver
                  </Label>
                  <div
                    className="h-96 overflow-auto rounded-sm border p-1"
                    dangerouslySetInnerHTML={{ __html: adultWaiver }}
                  />
                  <FormGroup className="ml-4 mt-2">
                    <Input type="checkbox" onChange={changeAgreement} />
                    <Text text="I agree to the above waiver" />
                  </FormGroup>
                </div>
              )}
            </div>
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={!isValid || isSubmitting || !didAgree}
              className="bg-purple-700 align-middle hover:bg-purple-600"
              size="sm"
            >
              Check-In
            </Button>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default DayOfCheckin;
