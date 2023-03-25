import { useSession } from "next-auth/react";
import Error from "next/error";
import { useEffect, useState } from "react";
import { Icon } from "../../components/Icon";
import styled from "styled-components";
import { Label, TextInput, Button, Sidebar, Dropdown } from "flowbite-react";
import InputField from "../../components/Forms/InputField";
import { createOrganizationValidator } from "./helpers";
import { Formik } from "formik";
import { ErrorMessage } from "formik";
import {
  getOrganizationData,
  updateOrganizationData,
} from "../../actions/queries";

const SettingsContainer = styled.div`
  min-width: 60%;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
`;

const Header = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const SubHeader = styled.h1`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const SidebarItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const SideBarContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: #f5f5f5;
`;

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

const OrganizationSettings = () => {
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [notificationEmail, setNotificationEmail] = useState("");

  const [primaryColor, setPrimaryColor] = useState("");
  const [imageURL, setImageURL] = useState("");
  // const [hex, setHex] = useState("");
  // const [dropdownStyle, setDropdownStyle] = useState("");

  const [defaultAddress, setDefaultAddress] = useState("");
  const [defaultCity, setDefaultCity] = useState("");
  const [defaultState, setDefaultState] = useState("");
  const [defaultZIP, setDefaultZIP] = useState("");
  const [defaultContactName, setDefaultContactName] = useState("");
  const [defaultContactEmail, setDefaultContactEmail] = useState("");
  const [defaultContactPhone, setDefaultContactPhone] = useState("");

  const [eventSilver, setEventSilver] = useState("");
  const [eventGold, setEventGold] = useState("");
  const [hoursSilver, setHoursSilver] = useState("");
  const [hoursGold, setHoursGold] = useState("");

  const [edit, setEdit] = useState(false);
  const [page, setPage] = useState("orgInfo");

  let user = useSession().data.user;

  const handleWindowClose = (e) => {
    e.preventDefault();
    e.returnValue = "";
    return "Are you sure? You may have unsaved changes.";
  };

  useEffect(() => {
    window.addEventListener("beforeunload", handleWindowClose);
  }, []);

  const loadData = async () => {
    const data = await getOrganizationData(user.organizationId);

    if (data) {
      setName(data.data.orgData.name);
      setWebsite(data.data.orgData.website);
      setNotificationEmail(data.data.orgData.notificationEmail);

      setPrimaryColor(data.data.orgData.primaryColor);
      setImageURL(data.data.orgData.imageURL);

      setDefaultAddress(data.data.orgData.defaultEventAddress);
      setDefaultCity(data.data.orgData.defaultEventCity);
      setDefaultState(data.data.orgData.defaultEventState);
      setDefaultZIP(data.data.orgData.defaultEventZip);
      setDefaultContactName(data.data.orgData.defaultContactName);
      setDefaultContactEmail(data.data.orgData.defaultContactEmail);
      setDefaultContactPhone(data.data.orgData.defaultContactPhone);

      setEventSilver(data.data.orgData.eventSilver);
      setEventGold(data.data.orgData.eventGold);
      setHoursSilver(data.data.orgData.hoursSilver);
      setHoursGold(data.data.orgData.hoursGold);
    }
  };

  const updatePage = (page) => {
    setPage(page);
  };

  function refreshPage() {
    window.location.reload(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (values) => {
    const data = {
      name: values.non_profit_name,
      website: values.non_profit_website,
      notificationEmail: values.notification_email,

      primaryColor: primaryColor,
      imageURL: values.logo_link,

      defaultEventAddress: values.default_address,
      defaultEventCity: values.default_city,
      defaultEventState: values.default_state,
      defaultEventZip: values.default_zip,
      defaultContactName: values.default_contact_name,
      defaultContactEmail: values.default_contact_email,
      defaultContactPhone: values.default_contact_phone,

      eventSilver: values.event_silver,
      eventGold: values.event_gold,
      hoursSilver: values.hours_silver,
      hoursGold: values.hours_gold,
    };

    await updateOrganizationData(user.organizationId, {
      data: data,
    });

    // refreshPage();
  };

  // // based on the primaryColor, use setHex to set the hex value
  // useEffect(() => {
  //   if (primaryColor === "Red") {
  //     setHex("#dc2626");
  //   } else if (primaryColor === "Orange") {
  //     setHex("#c2410c");
  //   } else if (primaryColor === "Yellow") {
  //     setHex("#008000");
  //   } else if (primaryColor === "Green") {
  //     setHex("#FFFF00");
  //   } else if (primaryColor === "Light Blue") {
  //     setHex("#FFA500");
  //   } else if (primaryColor === "Blue") {
  //     setHex("#800080");
  //   } else if (primaryColor === "Purple") {
  //     setHex("#FFC0CB");
  //   } else if (primaryColor === "Magenta") {
  //     setHex("#808080");
  //   }

  //   setDropdownStyle("bg-[" + hex +"] text-white rounded-lg")
  //   console.log(dropdownStyle)
  // }, [primaryColor]);

  return (
    <div>
      <Formik
        initialValues={{
          non_profit_name: name,
          non_profit_website: website,
          notification_email: notificationEmail,

          logo_link: imageURL,

          default_address: defaultAddress,
          default_city: defaultCity,
          default_state: defaultState,
          default_zip: defaultZIP,

          default_contact_name: defaultContactName,
          default_contact_email: defaultContactEmail,
          default_contact_phone: defaultContactPhone,

          event_silver: eventSilver,
          event_gold: eventGold,
          hours_silver: hoursSilver,
          hours_gold: hoursGold,
        }}
        enableReinitialize={true}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(true);
          handleSubmit(values);
          setSubmitting(false);
        }}
        validationSchema={createOrganizationValidator}
      >
        {({ handleSubmit, isValid, isSubmitting, values }) => (
          <div>
            <div className="flex h-24 flex-row">
              <div className="flex w-1/2 flex-col justify-center px-10 pt-2.5">
                <Header className="">Settings</Header>
              </div>
              <div className="flex w-1/2 flex-col items-end justify-center px-7">
                <Button
                  className="w-48 bg-primaryColor hover:bg-hoverColor"
                  onClick={handleSubmit}
                >
                  <b>SAVE</b>
                </Button>
              </div>
            </div>
            <div style={{ display: "flex" }}>
              <SideBarContainer style={{ flexBasis: "20%" }}>
                <div className="w-fit">
                  <Sidebar aria-label="Default sidebar example">
                    <Sidebar.Items>
                      {page === "orgInfo" ? (
                        <SidebarItem
                          className="bg-gray-200"
                          onClick={() => updatePage("orgInfo")}
                        >
                          <Icon color="grey3" name="add" />
                          <div className="">Organization Info</div>
                        </SidebarItem>
                      ) : (
                        <SidebarItem
                          className=""
                          onClick={() => updatePage("orgInfo")}
                        >
                          <Icon color="grey3" name="add" />
                          <div className="">Organization Info</div>
                        </SidebarItem>
                      )}

                      {page === "styling" ? (
                        <SidebarItem
                          className="bg-gray-200"
                          onClick={() => updatePage("styling")}
                        >
                          <Icon color="grey3" name="create" />
                          <div className="">Styling & Theme</div>
                        </SidebarItem>
                      ) : (
                        <SidebarItem onClick={() => updatePage("styling")}>
                          <Icon color="grey3" name="create" />
                          <div className="">Styling & Theme</div>
                        </SidebarItem>
                      )}

                      {page === "defValues" ? (
                        <SidebarItem
                          className="bg-gray-200"
                          onClick={() => updatePage("defValues")}
                        >
                          <Icon color="grey3" name="refresh" />
                          <div className="">Default Values</div>
                        </SidebarItem>
                      ) : (
                        <SidebarItem onClick={() => updatePage("defValues")}>
                          <Icon color="grey3" name="refresh" />
                          <div className="">Default Values</div>
                        </SidebarItem>
                      )}

                      {page === "medals" ? (
                        <SidebarItem
                          className="bg-gray-200"
                          onClick={() => updatePage("medals")}
                        >
                          <Icon color="grey3" name="medal" />
                          <div className="">Medal Thresholds</div>
                        </SidebarItem>
                      ) : (
                        <SidebarItem onClick={() => updatePage("medals")}>
                          <Icon color="grey3" name="medal" />
                          <div className="">Medal Thresholds</div>
                        </SidebarItem>
                      )}
                    </Sidebar.Items>
                  </Sidebar>
                </div>
              </SideBarContainer>
              <SettingsContainer style={{ flexBasis: "80%" }}>
                {page === "styling" && (
                  <div>
                    <Header>Styling & Theme</Header>
                    <div className="pb-3">
                      <div className="mb-0.5 block">
                        <Label htmlFor="email1" value="Theme Color" />
                      </div>
                      <Dropdown
                        label={primaryColor}
                        size="lg"
                        class="rounded-lg bg-secondaryColor text-white"
                      >
                        <Dropdown.Item
                          onClick={() => setPrimaryColor("Red")}
                          className="font-bold text-red-800"
                        >
                          Red
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => setPrimaryColor("Orange")}
                          className="font-bold text-orange-600"
                        >
                          Orange
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => setPrimaryColor("Yellow")}
                          className="font-bold text-yellow-500"
                        >
                          Yellow
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => setPrimaryColor("Green")}
                          className="font-bold text-lime-500"
                        >
                          Green
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => setPrimaryColor("Light Blue")}
                          className="font-bold text-sky-500"
                        >
                          Light Blue
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => setPrimaryColor("Blue")}
                          className="font-bold text-blue-800"
                        >
                          Blue
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => setPrimaryColor("Purple")}
                          className="font-bold text-purple-800"
                        >
                          Purple
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => setPrimaryColor("Magenta")}
                          className="font-bold text-pink-800"
                        >
                          Magenta
                        </Dropdown.Item>
                      </Dropdown>
                    </div>
                    <div className="max-w-lg pb-5">
                      <Label htmlFor="email1" value="Logo Link" />
                      <InputField
                        className="m-auto flex justify-center text-black"
                        name="logo_link"
                        placeholder="https://www.example.com"
                        onChange={() => setEdit(true)}
                      />
                      <div className="pb-3 pt-1 text-slate-500">
                        * Submit a link to your logo. Please make sure the logo
                        is clear and in the right dimension.
                      </div>
                    </div>
                  </div>
                )}
                {page === "orgInfo" && (
                  <div>
                    <Header>Organization Info</Header>

                    <div className="max-w-lg">
                      <div className="pb-3">
                        <Label htmlFor="email1" value="Non-profit Name" />
                        <InputField
                          className="m-auto flex justify-center text-black"
                          name="non_profit_name"
                          placeholder="Bits of Good"
                          onChange={() => setEdit(true)}
                        />
                      </div>
                      <div className="pb-3">
                        <Label htmlFor="email1" value="Non-profit Website" />
                        <InputField
                          className="m-auto flex justify-center text-black"
                          name="non_profit_website"
                          placeholder="https://www.example.com"
                        />
                      </div>
                      <div className="pb-3">
                        <Label htmlFor="email1" value="Notification Email" />
                        <InputField
                          className="m-auto flex justify-center text-black"
                          name="notification_email"
                          placeholder="example@bitsofgood.com"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {page === "defValues" && (
                  <div>
                    <Header>Default Values</Header>
                    <div className="pb-3 text-slate-500">
                      * You can use default values to create an event quickly
                    </div>
                    <b>Default Event Information</b>
                    <div>
                      <div className="max-w-lg">
                        <div className="pb-3">
                          <Label htmlFor="email1" value="Address" />
                          <InputField
                            className="m-auto flex justify-center text-black"
                            name="default_address"
                            placeholder="000 Peachtree St"
                          />
                        </div>
                        <div className="m-auto mt-5 flex gap-5">
                          <div className="pb-3">
                            <Label htmlFor="email1" value="City" />
                            <InputField
                              className="m-auto flex justify-center text-black"
                              name="default_city"
                              placeholder="Atlanta"
                            />
                          </div>
                          <div className="pb-3">
                            <Label htmlFor="email1" value="State" />
                            <InputField
                              className="m-auto flex justify-center text-black"
                              name="default_state"
                              placeholder="GA"
                            />
                          </div>
                          <div className="pb-3">
                            <Label htmlFor="email1" value="ZIP Code" />
                            <InputField
                              className="m-auto flex justify-center text-black"
                              name="default_zip"
                              placeholder="00000"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3">
                      <b>Default Contact Information</b>
                    </div>
                    <div className="max-w-lg">
                      <div className="pb-3">
                        <Label htmlFor="email1" value="Name" />
                        <InputField
                          className="m-auto flex justify-center text-black"
                          name="default_contact_name"
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="pb-3">
                        <Label htmlFor="email1" value="Email" />
                        <InputField
                          className="m-auto flex justify-center text-black"
                          name="default_contact_email"
                          placeholder="example@bitsofgood.com"
                        />
                      </div>
                      <div className="pb-3">
                        <Label htmlFor="email1" value="Phone" />
                        <InputField
                          className="m-auto flex justify-center text-black"
                          name="default_contact_phone"
                          placeholder="XXX-XXX-XXXX"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {page === "medals" && (
                  <div>
                    <Header>Medal Settings</Header>
                    <div className="pb-3 text-slate-500">
                      * You can set goals for volunteers to help them gain
                      different medals and motivate them to keep engaging in
                      different events
                    </div>
                    <b>Event Medals</b>
                    <div>
                      <div className="m-auto mt-5 flex gap-10">
                        <div className="w-32 pb-3">
                          <Label htmlFor="email1" value="Silver Medal" />
                          <InputField
                            className="m-auto flex justify-center text-black"
                            name="event_silver"
                            placeholder="Threshold"
                          />
                        </div>
                        <div className="w-32 pb-3 ">
                          <Label htmlFor="email1" value="Gold Medal" />
                          <InputField
                            className="m-auto flex justify-center text-black"
                            name="event_gold"
                            placeholder="Threshold"
                          />
                        </div>
                      </div>
                      <b>Earned Hour Medals</b>
                      <div className="m-auto mt-5 flex gap-10">
                        <div className="w-32 pb-3">
                          <Label htmlFor="email1" value="Silver Medal" />
                          <InputField
                            className="m-auto flex justify-center text-black"
                            name="hours_silver"
                            placeholder="Threshold"
                          />
                        </div>
                        <div className="w-32 pb-3">
                          <Label htmlFor="email1" value="Gold Medal" />
                          <InputField
                            className="m-auto flex justify-center text-black"
                            name="hours_gold"
                            placeholder="Threshold"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </SettingsContainer>
            </div>
          </div>
        )}
      </Formik>
    </div>
  );
};

export default authWrapper(OrganizationSettings);
