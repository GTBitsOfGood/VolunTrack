import "flowbite-react";
import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, withRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { getOrganization } from "../queries/organizations";

const Header = () => {
  const router = useRouter();
  const [customHome, setCustomHome] = useState(false);
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

  const onRegistrationsClicked = () => {
    router.push("/registrations");
  };

  const onEventsClicked = () => {
    router.push("/events");
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
      setCustomHome(
        response.data.organization?.aboutPageToggle &&
          response.data.organization.homePage !== ""
      );
    }
    fetchData();
  }, []);

  return (
    <Navbar
      fluid={true}
      rounded={true}
      className="my-custom-navbar mx-16 items-center justify-between py-0"
    >
      <Navbar.Brand tag={(props) => <Link {...props} />} href="/home">
        <img src={imageURL} alt="org logo" className="h-10" />
      </Navbar.Brand>
      <Navbar.Toggle />
      <div>
        <Navbar.Collapse className="!md:space-x-4 mt-2 flex flex-row items-center">
          {user.role === "admin" ? (
            <Navbar.Link
              href="/home"
              className={`text-lg font-bold hover:no-underline md:hover:text-primaryColor ${
                currPageMatches("/home") ? "text-primaryColor" : ""
              }`}
            >
              Home
            </Navbar.Link>
          ) : (
            <Navbar.Link
              href="/home"
              className={`text-lg font-bold hover:no-underline md:hover:text-primaryColor ${
                currPageMatches("/home") ? "text-primaryColor" : ""
              }`}
            >
              Volunteering
            </Navbar.Link>
          )}

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

          {user.role != "admin" && customHome && (
            <Navbar.Link
              href="/custom-home"
              className={`text-lg font-bold hover:no-underline md:hover:text-primaryColor ${
                currPageMatches("/custom-home") ? "text-primaryColor" : ""
              }`}
            >
              About
            </Navbar.Link>
          )}

          {user.role != "admin" ? (
            <Navbar.Link
              href="/events"
              className={`text-lg font-bold hover:no-underline md:hover:text-primaryColor ${
                currPageMatches("/events") ? "text-primaryColor" : ""
              }`}
            >
              Events
            </Navbar.Link>
          ) : (
            <Navbar.Link
              className={`text-lg font-bold hover:no-underline md:hover:text-primaryColor ${
                currPageMatches("/events") ? "text-primaryColor" : ""
              }`}
            >
              <Dropdown
                arrowIcon={true}
                inline={true}
                label={<div>Events</div>}
                className="font-medium"
              >
                <Dropdown.Item
                  href="/registrations"
                  onClick={onRegistrationsClicked}
                >
                  Approval Portal
                </Dropdown.Item>

                <Dropdown.Item href="/events" onClick={onEventsClicked}>
                  Event Calendar
                </Dropdown.Item>
              </Dropdown>
            </Navbar.Link>
          )}

          {user.role === "admin" && (
            <Navbar.Link
              className={`text-lg font-bold md:hover:text-primaryColor  ${
                currPageMatches("/admins") ||
                currPageMatches("/manage-waivers") ||
                currPageMatches("/organization-settings")
                  ? "text-primaryColor"
                  : ""
              }`}
            >
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
            </Navbar.Link>
          )}
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
      </div>
    </Navbar>
  );
};

export default withRouter(Header);
