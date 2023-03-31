import { Tabs } from "flowbite-react";
import { useSession } from "next-auth/react";
import Error from "next/error";
import { useEffect, useRef, useState } from "react";
import "react-quill/dist/quill.snow.css";
import BoGButton from "../../components/BoGButton";
import { getWaivers, updateWaiver } from "../../queries/waivers";

function authWrapper(Component) {
  return function WrappedComponent(props) {
    const {
      data: { user },
    } = useSession();
    if (user.role !== "admin") {
      return (
        <Error
          title="You are not authorized to access this page"
          statusCode={403}
        />
      );
    } else {
      return <Component {...props} user={user} />;
    }
  };
}

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

  const loadWaivers = async () => {
    const adult = await getWaivers("adult", user.organizationId);

    if (adult.data.waiver.length > 0) {
      setAdultContent(adult.data.waiver[0].text);
    }

    const minor = await getWaivers("minor", user.organizationId);

    if (minor.data.waiver.length > 0) {
      setMinorContent(minor.data.waiver[0].text);
    }
  };

  useEffect(() => {
    loadWaivers();
  }, []);

  const submitAdult = () => {
    updateWaiver("adult", adultContent, user.organizationId);
  };

  const submitMinor = () => {
    updateWaiver("minor", minorContent, user.organizationId);
  };

  const setAdultTab = () => {
    setTab(true);
  };
  const setMinorTab = () => {
    setTab(false);
  };

  return (
    <div className="flex-column mx-auto my-16 flex w-3/5">
      <h2 className="text-lg font-bold">Manage Waivers</h2>
      <Tabs.Group style="underline">
        <Tabs.Item
          title="Adult Waiver"
          onClick={setAdultTab}
          active={onAdultTab}
        >
          <div className="mb-4 bg-white">
            <ReactQuill
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
          <div className="mb-4 bg-white">
            <ReactQuill
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

export default authWrapper(WaiverManager);
