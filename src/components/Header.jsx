import "flowbite-react";
import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, withRouter } from "next/router";
import React from "react";
import { useEffect } from "react";
import { getOrganizationData } from "../actions/queries";

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
    router.push("/assistants");
  };

  const goToManageWaivers = () => {
    router.push("/manage-waivers");
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
      const response = await getOrganizationData(user.organizationId);
      if (response.data.orgData) setImageURL(response.data.orgData.imageURL);
    }
    fetchData();
  }, []);

  return (
    <Navbar fluid={false} rounded={true}>
      <Navbar.Brand tag={(props) => <Link {...props} />} href="/home">
        <img src={imageURL} alt="org logo" className="h-10" />
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Navbar.Link
          href="/home"
          className={`text-lg font-bold hover:no-underline md:hover:text-primaryColor ${
            currPageMatches("/home")
              ? "text-primaryColor"
              : "text-secondaryColor"
          }`}
        >
          Home
        </Navbar.Link>
        {user.role === "admin" && (
          <Navbar.Link
            href="/volunteers"
            className={`text-lg font-bold hover:no-underline md:hover:text-primaryColor ${
              currPageMatches("/volunteers")
                ? "text-primaryColor"
                : "text-secondaryColor"
            }`}
          >
            Volunteers
          </Navbar.Link>
        )}
        <Navbar.Link
          href="/events"
          className={`text-lg font-bold hover:no-underline md:hover:text-primaryColor ${
            currPageMatches("/events")
              ? "text-primaryColor"
              : "text-secondaryColor"
          }`}
        >
          Events
        </Navbar.Link>
        {user.role === "volunteer" && (
          <Navbar.Link
            onClick={goToStats}
            href="/stats"
            className={`text-lg font-bold hover:no-underline md:hover:text-primaryColor ${
              currPageMatches("/stats")
                ? "text-primaryColor"
                : "text-secondaryColor"
            }`}
          >
            Participation History
          </Navbar.Link>
        )}
        <Navbar.Link>
          {user.role === "admin" && (
            <Dropdown
              arrowIcon={true}
              inline={true}
              label={
                <div
                  className={`text-lg font-bold md:hover:text-primaryColor  ${
                    currPageMatches("/assistants") ||
                    currPageMatches("/manage-waivers")
                      ? "text-primaryColor"
                      : "text-secondaryColor"
                  }`}
                >
                  Settings
                </div>
              }
            >
              <Dropdown.Item onClick={goToManageAdmins} href="/assistants">
                Manage Admins
              </Dropdown.Item>
              <Dropdown.Item onClick={goToManageWaivers} href="/manage-waivers">
                Manage Waivers
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
        <div className="mr-2 flex hidden md:order-2 md:block">
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
                  <p className="mb-0">{`${user.bio?.first_name} ${user.bio?.last_name}`}</p>
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
                  currPageMatches("/assistants") ||
                  currPageMatches("/manage-waivers")
                    ? "text-primaryColor"
                    : "text-secondaryColor"
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
