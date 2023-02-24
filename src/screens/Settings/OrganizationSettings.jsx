import { useSession } from "next-auth/react";
import Error from "next/error";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Label, TextInput, Button } from "flowbite-react";
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
  const [slug, setSlug] = useState("");
  const [invitedAdmins, setInvitedAdmins] = useState("");
  const [primaryColor, setPrimaryColor] = useState("");
  const [secondaryColor, setSecondaryColor] = useState("");
  const [defaultAddress, setDefaultAddress] = useState("");
  const [defaultCity, setDefaultCity] = useState("");
  const [defaultState, setDefaultState] = useState("");
  const [defaultZIP, setDefaultZIP] = useState("");
  const [defaultContactName, setDefaultContactName] = useState("");
  const [defaultContactEmail, setDefaultContactEmail] = useState("");
  const [defaultContactPhone, setDefaultContactPhone] = useState("");

  let user = useSession().data.user;

  const loadData = async () => {
    const data = await getOrganizationData(user.organizationId);

    if (data) {
      setName(data.data.orgData.name);
      document.getElementById("name").value = data.data.orgData.name;
      setWebsite(data.data.orgData.website);
      document.getElementById("website").value = data.data.orgData.website;
      setSlug(data.data.orgData.slug);
      setInvitedAdmins(data.data.orgData.invitedAdmins);
      setPrimaryColor(data.data.orgData.primaryColor);
      document.getElementById("primary").value = data.data.orgData.primaryColor;
      setSecondaryColor(data.data.orgData.secondaryColor);
      document.getElementById("secondary").value =
        data.data.orgData.secondaryColor;
      setDefaultAddress(data.data.orgData.defaultEventAddress);
      document.getElementById("address").value =
        data.data.orgData.defaultEventAddress;
      setDefaultCity(data.data.orgData.defaultEventCity);
      document.getElementById("city").value =
        data.data.orgData.defaultEventCity;
      setDefaultState(data.data.orgData.defaultEventState);
      document.getElementById("state").value =
        data.data.orgData.defaultEventState;
      setDefaultZIP(data.data.orgData.defaultEventZip);
      document.getElementById("zip").value = data.data.orgData.defaultEventZip;
      setDefaultContactName(data.data.orgData.defaultContactName);
      document.getElementById("contactName").value =
        data.data.orgData.defaultContactName;
      setDefaultContactEmail(data.data.orgData.defaultContactEmail);
      document.getElementById("contactEmail").value =
        data.data.orgData.defaultContactEmail;
      setDefaultContactPhone(data.data.orgData.defaultContactPhone);
      document.getElementById("contactPhone").value =
        data.data.orgData.defaultContactPhone;
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const submitData = async () => {
    // get the values from the TextInput
    const name = document.getElementById("name").value;
    const website = document.getElementById("website").value;
    const primaryColor = document.getElementById("primary").value;
    const secondaryColor = document.getElementById("secondary").value;
    const defaultAddress = document.getElementById("address").value;
    const defaultCity = document.getElementById("city").value;
    const defaultState = document.getElementById("state").value;
    const defaultZIP = document.getElementById("zip").value;
    const defaultContactName = document.getElementById("contactName").value;
    const defaultContactEmail = document.getElementById("contactEmail").value;
    const defaultContactPhone = document.getElementById("contactPhone").value;

    //create a JSON with all these previous values
    const data = {
      name: name,
      website: website,
      primaryColor: primaryColor,
      secondaryColor: secondaryColor,
      defaultEventAddress: defaultAddress,
      defaultEventCity: defaultCity,
      defaultEventState: defaultState,
      defaultEventZip: defaultZIP,
      defaultContactName: defaultContactName,
      defaultContactEmail: defaultContactEmail,
      defaultContactPhone: defaultContactPhone,
    };

    await updateOrganizationData(user.organizationId, {
      data: data,
    });
  };

  return (
    <SettingsContainer>
      <Header>Organization Settings</Header>

      <SubHeader>Current Organization Data</SubHeader>

      <div className="mb-0.5 block">
        <b>Name:</b> {name}
      </div>
      <div className="mb-0.5 block">
        <b>Website:</b> {website}
      </div>
      <div className="mb-0.5 block">
        <b>Slug:</b> {slug}
      </div>
      <div className="mb-0.5 block">
        <b>Invited Admins:</b> {invitedAdmins}
      </div>
      <div className="mb-0.5 block">
        <b>Primary Color:</b> {primaryColor}
      </div>
      <div className="mb-0.5 block">
        <b>Secondary Color:</b> {secondaryColor}
      </div>
      <div className="mb-0.5 block">
        <b>Default Address:</b> {defaultAddress}
      </div>
      <div className="mb-0.5 block">
        <b>Default City:</b> {defaultCity}
      </div>
      <div className="mb-0.5 block">
        <b>Default State:</b> {defaultState}
      </div>
      <div className="mb-0.5 block">
        <b>Default ZIP:</b> {defaultZIP}
      </div>
      <div className="mb-0.5 block">
        <b>Default Contact Name: </b>
        {defaultContactName}
      </div>
      <div className="mb-0.5 block">
        <b>Default Contact Email:</b> {defaultContactEmail}
      </div>
      <div className="mb-0.5 block">
        <b>Default Contact Phone:</b> {defaultContactPhone}
      </div>
      <div className="mb-5"></div>

      <SubHeader>Update Organization Data</SubHeader>

      <b>General Information</b>
      <div>
        <div className="mb-0.5 block">
          <Label htmlFor="email1" value="Name" />
        </div>
        <TextInput id="name" type="name" placeholder="" required={false} />
      </div>
      <div>
        <div className="mb-0.5 block">
          <Label htmlFor="email1" value="Website" />
        </div>
        <TextInput
          id="website"
          type="website"
          placeholder=""
          required={false}
        />
      </div>
      <form className="flex flex-col gap-4">
        <div>
          <div className="mb-0.5 block">
            <Label htmlFor="email1" value="Primary Color" />
          </div>
          <TextInput
            id="primary"
            type="primary"
            placeholder=""
            required={false}
          />
        </div>
        <div>
          <div className="mb-0.5 block">
            <Label htmlFor="email1" value="Seconday Color" />
          </div>
          <TextInput
            id="secondary"
            type="secondary"
            placeholder=""
            required={false}
          />
        </div>
        <hr></hr>
        <b>Default Event Information</b>
        <div>
          <div className="mb-0.5 block">
            <Label htmlFor="email1" value="Address" />
          </div>
          <TextInput
            id="address"
            type="address"
            placeholder=""
            required={false}
          />
        </div>
        <div>
          <div className="mb-0.5 block">
            <Label htmlFor="email1" value="City" />
          </div>
          <TextInput id="city" type="city" placeholder="" required={false} />
        </div>
        <div>
          <div className="mb-0.5 block">
            <Label htmlFor="email1" value="State" />
          </div>
          <TextInput id="state" type="state" placeholder="" required={false} />
        </div>
        <div>
          <div className="mb-0.5 block">
            <Label htmlFor="email1" value="ZIP" />
          </div>
          <TextInput id="zip" type="zip" placeholder="" required={false} />
        </div>
        <hr></hr>
        <b>Default Contact Information</b>
        <div>
          <div className="mb-0.5 block">
            <Label htmlFor="email1" value="Name" />
          </div>
          <TextInput
            id="contactName"
            type="contactName"
            placeholder=""
            required={false}
          />
        </div>
        <div>
          <div className="mb-0.5 block">
            <Label htmlFor="email1" value="Email" />
          </div>
          <TextInput
            id="contactEmail"
            type="contactEmail"
            placeholder=""
            required={false}
          />
        </div>
        <div>
          <div className="mb-0.5 block">
            <Label htmlFor="email1" value="Phone" />
          </div>
          <TextInput
            id="contactPhone"
            type="contactPhone"
            placeholder=""
            required={false}
          />
        </div>
        <div className="mb-3"></div>
        <Button type="submit" onClick={submitData}>
          <b>SAVE</b>
        </Button>
      </form>
    </SettingsContainer>
  );
};

export default authWrapper(OrganizationSettings);
