import { Tabs } from "flowbite-react";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import "react-quill/dist/quill.snow.css";
import BoGButton from "../../components/BoGButton";
import { getWaivers, updateWaiver } from "../../queries/waivers";
import AdminAuthWrapper from "../../utils/AdminAuthWrapper";
import { Toast } from "flowbite-react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const WaiverManager = () => {
  let ReactQuill;
  // patch for build failure
  if (typeof window !== "undefined") {
    ReactQuill = require("react-quill");
  }
  const quill = useRef(null);

  const {
    data: { user },
  } = useSession();

  const [adultContent, setAdultContent] = useState("");
  const [minorContent, setMinorContent] = useState("");
  const [onAdultTab, setTab] = useState(true);
  const [minorSaved, setMinorSaved] = useState(false);
  const [adultSaved, setAdultSaved] = useState(false);

  const loadWaivers = async () => {
    const adult = await getWaivers("adult", user.organizationId);

    if (adult.data.waivers.length > 0) {
      setAdultContent(adult.data.waivers[0].text);
    }

    const minor = await getWaivers("minor", user.organizationId);

    if (minor.data.waivers.length > 0) {
      setMinorContent(minor.data.waivers[0].text);
    }
  };

  useEffect(() => {
    loadWaivers();
  }, []);

  const submitAdult = () => {
    updateWaiver({
      type: "adult",
      text: adultContent,
      organizationId: user.organizationId,
    });
    setAdultSaved(true);
  };

  const submitMinor = () => {
    updateWaiver({
      type: "minor",
      text: minorContent,
      organizationId: user.organizationId,
    });
    setMinorSaved(true);
  };

  const setAdultTab = () => {
    setTab(true);
  };
  const setMinorTab = () => {
    setTab(false);
  };

  return (
    <div className="flex-column mx-1 my-2 flex rounded-sm bg-grey p-4 md:w-5/6">
      <h2 className="text-lg font-bold">Edit Waivers</h2>
      <Tabs.Group style="underline">
        <Tabs.Item
          title="Adult Waiver"
          onClick={setAdultTab}
          active={onAdultTab}
        >
          {adultSaved && (
            <div className="pb-3">
              <Toast>
                <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                  <CheckCircleIcon className="h-5 w-5" />
                </div>
                <div className="pl-2 text-sm font-normal">
                  Adult waiver saved successfully!
                </div>
                <Toast.Toggle />
              </Toast>
            </div>
          )}
          <div className="mb-16 bg-white">
            <ReactQuill
              className="h-96"
              value={adultContent}
              onChange={(newValue) => {
                setAdultContent(newValue);
              }}
              ref={quill}
            />
          </div>
          <div className="flex justify-end">
            <BoGButton onClick={submitAdult} text="Save" />
          </div>
        </Tabs.Item>
        <Tabs.Item
          title="Minor Waiver"
          onClick={setMinorTab}
          active={!onAdultTab}
        >
          {minorSaved && (
            <div className="pb-3">
              <Toast>
                <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                  <CheckCircleIcon className="h-5 w-5" />
                </div>
                <div className="pl-2 text-sm font-normal">
                  Minor waiver saved successfully!
                </div>
                <Toast.Toggle />
              </Toast>
            </div>
          )}
          <div className="mb-4 bg-white">
            <ReactQuill
              className="h-96"
              value={minorContent}
              onChange={(newValue) => {
                setMinorContent(newValue);
              }}
              ref={quill}
            />
          </div>
          <div className="flex justify-end">
            <BoGButton onClick={submitMinor} text="Save" />
          </div>
        </Tabs.Item>
      </Tabs.Group>
    </div>
  );
};

export default AdminAuthWrapper(WaiverManager);
