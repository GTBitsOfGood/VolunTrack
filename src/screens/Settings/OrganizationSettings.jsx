import { useSession } from "next-auth/react";
import Error from "next/error";
import { useEffect, useState } from "react";
import { Icon } from "../../components/Icon";
import styled from "styled-components";
import { Label, TextInput, Button, Sidebar, Dropdown } from "flowbite-react";
import InputField from "../../components/Forms/InputField";
import { createOrganizationValidator } from "./helpers";
import { Formik } from "formik";
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

  const [defaultAddress, setDefaultAddress] = useState("");
  const [defaultCity, setDefaultCity] = useState("");
  const [defaultState, setDefaultState] = useState("");
  const [defaultZIP, setDefaultZIP] = useState("");
  const [defaultContactName, setDefaultContactName] = useState("");
  const [defaultContactEmail, setDefaultContactEmail] = useState("");
  const [defaultContactPhone, setDefaultContactPhone] = useState("");

  const [edit, setEdit] = useState(false);
  const [page, setPage] = useState("styling");

  let user = useSession().data.user;

  const handleWindowClose = (e) => {
    e.preventDefault();
    e.returnValue = '';
    return 'Are you sure? You may have unsaved changes.';
  }

  useEffect(() => {
    window.addEventListener('beforeunload', handleWindowClose);
    
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
    }
  };

  const updatePage = (page) => {
    setPage(page);
  };


  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (values) => {
    console.log(values)

    setEdit(false);

    const data = {
      name: values.non_profit_name,
      website: values.non_profit_website,
      notificationEmail: values.notification_email,

      primaryColor: primaryColor,
      imageURL: values.logo_link,

      defaultEventAddress: values.defaultAddress,
      defaultEventCity: values.defaultCity,
      defaultEventState: values.defaultState,
      defaultEventZip: values.defaultZIP,
      defaultContactName: values.defaultContactName,
      defaultContactEmail: values.defaultContactEmail,
      defaultContactPhone: values.defaultContactPhone,
    };

    await updateOrganizationData(user.organizationId, {
      data: data,
    });
  };

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
            <div className="flex flex-row h-24">

              <div className="flex flex-col w-1/2 justify-center px-10 pt-2.5">

                <Header className="">Settings</Header>
              </div>
              <div className="flex flex-col w-1/2 justify-center items-end px-7">
                <Button className="w-48" onClick={handleSubmit}>
                  <b>SAVE</b>
                </Button>
              </div>


            </div>
            <div style={{ display: "flex" }}>
              <SideBarContainer style={{ flexBasis: "20%" }}>
                <div className="w-fit">
                  <Sidebar aria-label="Default sidebar example" >
                    <Sidebar.Items>

                      <SidebarItem onClick={() => updatePage("styling")}>
                        <Icon color="grey3" name="create" />Styling & Theme
                      </SidebarItem>
                      <SidebarItem onClick={() => updatePage("orgInfo")}>
                        <Icon color="grey3" name="add" />Organization Info
                      </SidebarItem>
                      <SidebarItem onClick={() => updatePage("defValues")}>
                        <Icon color="grey3" name="refresh" />Default Values
                      </SidebarItem>

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
                      >
                        <Dropdown.Item onClick={() => setPrimaryColor("Red")}>
                          Red
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => setPrimaryColor("Orange")} >
                          Orange
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => setPrimaryColor("Yellow")}>
                          Yellow
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => setPrimaryColor("Green")}>
                          Green
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => setPrimaryColor("Light Blue")}>
                          Light Blue
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => setPrimaryColor("Dark Blue")}>
                          Dark Blue
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => setPrimaryColor("Purple")}>
                          Purple
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => setPrimaryColor("Magenta")}>
                          Magenta
                        </Dropdown.Item>
                      </Dropdown>

                    </div>
                    <div className="pb-5">
                      <Label htmlFor="email1" value="Logo Link" />
                      <InputField
                        className="flex justify-center m-auto text-black"
                        name="logo_link"
                        placeholder="https://www.example.com"
                      />
                      <div className="text-slate-500 pb-3 pt-1" >* Submit a link to your logo. Please make sure the logo is clear and in the right dimension.</div>
                    </div>

                  </div>
                )}
                {page === "orgInfo" && (
                  <div>
                    <Header>Organization Info</Header>

                    <div className="m-auto mt-5 ">
                      <div className="pb-3">
                        <Label htmlFor="email1" value="Non-profit Name" />
                        <InputField
                          className="flex justify-center m-auto text-black"
                          name="non_profit_name"
                          placeholder="Bits of Good"
                        />
                      </div>
                      <div className="pb-3">
                        <Label htmlFor="email1" value="Non-profit Website" />
                        <InputField
                          className="flex justify-center m-auto text-black"
                          name="non_profit_website"
                          placeholder="https://www.example.com"
                        />
                      </div>
                      <div className="pb-3">
                        <Label htmlFor="email1" value="Notification Email" />
                        <InputField
                          className="flex justify-center m-auto text-black"
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
                    <div className="text-slate-500 pb-3" >* You can use default values to create an event quickly</div>
                    <b>Default Event Information</b>
                    <div>
                      <div className="m-auto mt-5 ">
                        <div className="pb-3">
                          <Label htmlFor="email1" value="Address" />
                          <InputField
                            className="flex justify-center m-auto text-black"
                            name="default_address"
                            placeholder="000 Peachtree St"
                          />
                        </div>
                        <div className="pb-3">
                          <Label htmlFor="email1" value="City" />
                          <InputField
                            className="flex justify-center m-auto text-black"
                            name="default_city"
                            placeholder="Atlanta"
                          />
                        </div>
                        <div className="pb-3">
                          <Label htmlFor="email1" value="State" />
                          <InputField
                            className="flex justify-center m-auto text-black"
                            name="default_state"
                            placeholder="GA"
                          />
                        </div>
                        <div className="pb-3">
                          <Label htmlFor="email1" value="ZIP Code" />
                          <InputField
                            className="flex justify-center m-auto text-black"
                            name="default_zip"
                            placeholder="00000"
                          />
                        </div>

                      </div>
                    </div>

                    <div className="pt-3">
                      <b>Default Contact Information</b>
                    </div>
                    <div className="m-auto mt-5 ">
                      <div className="pb-3">
                        <Label htmlFor="email1" value="Name" />
                        <InputField
                          className="flex justify-center m-auto text-black"
                          name="default_contact_name"
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="pb-3">
                        <Label htmlFor="email1" value="Email" />
                        <InputField
                          className="flex justify-center m-auto text-black"
                          name="default_contact_email"
                          placeholder="example@bitsofgood.com"
                        />
                      </div>
                      <div className="pb-3">
                        <Label htmlFor="email1" value="Phone" />
                        <InputField
                          className="flex justify-center m-auto text-black"
                          name="default_contact_phone"
                          placeholder="XXX-XXX-XXXX"
                        />
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
