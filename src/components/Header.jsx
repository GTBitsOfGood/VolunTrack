import "flowbite-react";
import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, withRouter } from "next/router";
import React, { useEffect } from "react";
import { getOrganization } from "../queries/organizations";

const Header = () => {
  const router = useRouter();
  const {
    data: { user },
  } = useSession();

  const logout = () => {
    signOut();
  };

  const goToProfile = () => {
    router.push("/profile");
  };

  const goToHistory = () => {
    router.push("/history");
  };

  const goToBogApprovalPortal = () => {
    router.push("/bog-portal");
  };

  const gotToSummary = () => {
    router.push("/events-summary");
  };

  const goToStats = () => {
    router.push("/stats");
  };

  const goToManageAdmins = () => {
    router.push("/admins");
  };

  const goToOrganizationSettings = () => {
    router.push("/organization-settings");
  };

  const currPageMatches = (page) => router.pathname === page;

  const dropdownItems = (
    <React.Fragment>
      <Dropdown.Item onClick={goToProfile} href="/profile">
        Profile
      </Dropdown.Item>
      {user.role === "admin" && (
        <div>
          <Dropdown.Item onClick={goToHistory} href="/history">
            Change History
          </Dropdown.Item>
          <Dropdown.Item onClick={gotToSummary} href="/events-summary">
            Event Summary
          </Dropdown.Item>
        </div>
      )}
      {user.isBitsOfGoodAdmin === true && (
        <div>
          <Dropdown.Item onClick={goToBogApprovalPortal} href="/bog-portal">
            BOG Approval Portal
          </Dropdown.Item>
        </div>
      )}
      <Dropdown.Divider />
      <Dropdown.Item onClick={logout} href="/">
        Sign Out
      </Dropdown.Item>
    </React.Fragment>
  );

  const [imageURL, setImageURL] = React.useState("/images/bog_logo.png");

  useEffect(() => {
    async function fetchData() {
      const response = await getOrganization(user.organizationId);
      if (response.data.organization)
        setImageURL(response.data.organization.imageUrl);
    }
    fetchData();
  }, []);

  return (
    <Navbar
      fluid={false}
      rounded={true}
      className="py-0 md:mx-auto md:w-5/6 md:border-b"
    >
      <Navbar.Brand tag={(props) => <Link {...props} />} href="/home">
        <img src={imageURL} alt="org logo" className="h-10" />
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse className="mt-2 items-center">
        <Navbar.Link
          href="/home"
          className={`text-lg font-bold hover:no-underline md:hover:text-primaryColor ${
            currPageMatches("/home") ? "text-primaryColor" : ""
          }`}
        >
          Home
        </Navbar.Link>
        {user.role === "admin" && (
          <Navbar.Link
            href="/volunteers"
            className={`text-lg font-bold hover:no-underline md:hover:text-primaryColor ${
              currPageMatches("/volunteers") ? "text-primaryColor" : ""
            }`}
          >
            Volunteers
          </Navbar.Link>
        )}
        <Navbar.Link
          href="/events"
          className={`text-lg font-bold hover:no-underline md:hover:text-primaryColor ${
            currPageMatches("/events") ? "text-primaryColor" : ""
          }`}
        >
          Events
        </Navbar.Link>
        {user.role === "volunteer" && (
          <Navbar.Link
            onClick={goToStats}
            href="/stats"
            className={`text-lg font-bold hover:no-underline md:hover:text-primaryColor ${
              currPageMatches("/stats") ? "text-primaryColor" : ""
            }`}
          >
            Participation History
          </Navbar.Link>
        )}
        <Navbar.Link
          className={`text-lg font-bold md:hover:text-primaryColor  ${
            currPageMatches("/admins") ||
            currPageMatches("/manage-waivers") ||
            currPageMatches("/organization-settings")
              ? "text-primaryColor"
              : ""
          }`}
        >
          {user.role === "admin" && (
            <Dropdown
              arrowIcon={true}
              inline={true}
              label={<div>Settings</div>}
              className="font-medium"
            >
              <Dropdown.Item onClick={goToManageAdmins} href="/admins">
                Manage Admins
              </Dropdown.Item>
              <Dropdown.Item
                onClick={goToOrganizationSettings}
                href="/organization-settings"
              >
                Organization Settings
              </Dropdown.Item>
            </Dropdown>
          )}
        </Navbar.Link>
        <div className="flex hidden md:order-2 md:block">
          <Dropdown
            arrowIcon={true}
            inline={true}
            label={
              <div className="flex">
                <Avatar
                  img={user.imageUrl ?? "/images/gradient-avatar.png"}
                  alt="icon"
                  rounded={true}
                />
                <div className="ml-3 flex flex-col gap-0 text-left">
                  <p className="mb-0">{`${user.firstName} ${user.lastName}`}</p>
                  <p className="mb-0 capitalize">{user.role}</p>
                </div>
              </div>
            }
          >
            {dropdownItems}
          </Dropdown>
        </div>
        <Navbar.Link className="block md:hidden">
          <Dropdown
            arrowIcon={true}
            inline={true}
            label={
              <div
                className={`text-lg font-bold ${
                  currPageMatches("/profile") ? "text-primaryColor" : ""
                }`}
              >
                Profile Settings
              </div>
            }
          >
            {dropdownItems}
          </Dropdown>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default withRouter(Header);
