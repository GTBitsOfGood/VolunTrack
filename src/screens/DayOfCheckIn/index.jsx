import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import InputField from "../../components/Forms/InputField";
import { checkInValidator } from "./helpers";
import { checkInVolunteer } from "../../queries/attendances";
import { getWaivers } from "../../queries/waivers";
import { useRouter } from "next/router";
import { createUserFromCheckIn, getEvent } from "../../queries/events";
import { Button } from "flowbite-react";

//const adultWaiverResponse = await getWaivers("adult", user.organizationId);
//<div dangerouslySetInnerHTML={{ __html: adultWaiverResponse.data.waivers[0].text }} />
const DayOfCheckin = () => {
  const router = useRouter();
  const { eventId } = router.query;
  let [event, setEvent] = useState([]);
  let [adultContent, setAdultContent] = useState();

  const onRefresh = async () => {
    await getEvent(eventId).then((result) => {
      setEvent(result.data.event.eventParent);
    });
    const adultWaiverResponse = await getWaivers("adult", event.organizationId);
    setAdultContent(adultWaiverResponse.data.waivers[0]?.text);
  };

  useEffect(() => {
    onRefresh();
  }, []);

  const checkIn = (values) => {
    const createUserVals = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.volunteerEmail,
      organizationId: event.organizationId,
    };

    createUserFromCheckIn(eventId, createUserVals, event.title);
  };

  return (
    <React.Fragment>
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          volunteerEmail: "",
          signature: "",
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
            <h1 className="font-semibold">Check-In for {event.title}</h1>
            <div className="w-4/5">
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
              {adultContent && (
                <>
                  <div dangerouslySetInnerHTML={{ __html: adultContent }} />
                  <InputField
                    name="signature"
                    label="Signature"
                    placeholder="Enter your initials"
                    type="signature"
                  />
                </>
              )}
            </div>
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={!isValid || isSubmitting}
              className="bg-purple-600 align-middle hover:bg-purple-700"
              size="sm"
            >
              Check-In
            </Button>
          </form>
        )}
      </Formik>
    </React.Fragment>
  );
};

export default DayOfCheckin;
