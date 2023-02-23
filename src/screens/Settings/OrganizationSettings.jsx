import { useSession } from "next-auth/react";
import Error from "next/error";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Label, TextInput, Button } from "flowbite-react";


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

  
    const loadData = async () => {
        //const data = await getOrganizationData(user.organizationId);
    
        //console.log(data)
      };
    
      useEffect(() => {
        loadData();
      }, []);

  return (
    <SettingsContainer>

    <Header>Organization Settings</Header>       

    <SubHeader>Current Organization Data</SubHeader>

    <div className="mb-0.5 block">
        Name: {name}
    </div>
    <div className="mb-0.5 block">
        Website: {website}
    </div>
    <div className="mb-0.5 block">
        Invited Admins: {invitedAdmins}
    </div>
    <div className="mb-0.5 block">
        Primary Color: {primaryColor}
    </div>
    <div className="mb-0.5 block">
        Secondary Color: {secondaryColor}
    </div>
    <div className="mb-0.5 block">
        Default Address: {defaultAddress}
    </div>
    <div className="mb-0.5 block">
        Default City: {defaultCity}
    </div>
    <div className="mb-0.5 block">
        Default State: {defaultState}
    </div>
    <div className="mb-0.5 block">
        Default ZIP: {defaultZIP}
    </div>
    <div className="mb-0.5 block">
        Default Contact Name: {defaultContactName}
    </div>
    <div className="mb-0.5 block">
        Default Contact Email: {defaultContactEmail}
    </div>
    <div className="mb-0.5 block">
        Default Contact Phone: {defaultContactPhone}
    </div>
    <div className="mb-5"></div>

    <SubHeader>Update Organization Data</SubHeader>

    
  <b>General Information</b>
  <div>
    <div className="mb-0.5 block">
      <Label
        htmlFor="email1"
        value="Name"
      />
    </div>
    <TextInput
      id="email1"
      type="email"
      placeholder=""
      required={false}
    />
  </div>
  <div>
    <div className="mb-0.5 block">
      <Label
        htmlFor="email1"
        value="Website"
      />
    </div>
    <TextInput
      id="email1"
      type="email"
      placeholder=""
      required={false}
    />
  </div>
<form className="flex flex-col gap-4">
  <div>
    <div className="mb-0.5 block">
      <Label
        htmlFor="email1"
        value="Primary Color"
      />
    </div>
    <TextInput
      id="email1"
      type="email"
      placeholder=""
      required={false}
    />
  </div>
  <div>
    <div className="mb-0.5 block">
      <Label
        htmlFor="email1"
        value="Seconday Color"
      />
    </div>
    <TextInput
      id="email1"
      type="email"
      placeholder=""
      required={false}
    />
  </div>
  <hr></hr>
  <b>Default Event Information</b>
  <div>
    <div className="mb-0.5 block">
      <Label
        htmlFor="email1"
        value="Address"
      />
    </div>
    <TextInput
      id="email1"
      type="email"
      placeholder=""
      required={false}
    />
  </div>
  <div>
    <div className="mb-0.5 block">
      <Label
        htmlFor="email1"
        value="City"
      />
    </div>
    <TextInput
      id="email1"
      type="email"
      placeholder=""
      required={false}
    />
  </div>
  <div>
    <div className="mb-0.5 block">
      <Label
        htmlFor="email1"
        value="State"
      />
    </div>
    <TextInput
      id="email1"
      type="email"
      placeholder=""
      required={false}
    />
  </div>
  <div>
    <div className="mb-0.5 block">
      <Label
        htmlFor="email1"
        value="ZIP"
      />
    </div>
    <TextInput
      id="email1"
      type="email"
      placeholder=""
      required={false}
    />
  </div>
  <hr></hr>
  <b>Default Contact Information</b>
  <div>
    <div className="mb-0.5 block">
      <Label
        htmlFor="email1"
        value="Name"
      />
    </div>
    <TextInput
      id="email1"
      type="email"
      placeholder=""
      required={false}
    />
  </div>
  <div>
    <div className="mb-0.5 block">
      <Label
        htmlFor="email1"
        value="Email"
      />
    </div>
    <TextInput
      id="email1"
      type="email"
      placeholder=""
      required={false}
    />
  </div>
  <div>
    <div className="mb-0.5 block">
      <Label
        htmlFor="email1"
        value="Phone"
      />
    </div>
    <TextInput
      id="email1"
      type="email"
      placeholder=""
      required={false}
    />
  </div>
    <div className="mb-3"></div>
  <Button type="submit">
    <b>SAVE</b>
  </Button>
</form>
        
        
    </SettingsContainer>
  );
};

export default authWrapper(OrganizationSettings);
